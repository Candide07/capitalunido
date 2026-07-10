import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { countries, CountryCode, Lang } from '../data/countries';
import DashboardCharts from './DashboardCharts';
import AffiliateDashboard from './AffiliateDashboard';
import NotificationBell from './NotificationBell';
import { UserPlus } from 'lucide-react';

interface Transaction {
  id: number;
  amount: number;
  status: 'pending' | 'confirmed' | 'rejected';
  reference: string;
  payment_method: string;
  transaction_type: 'deposit' | 'withdrawal';
  created_at: string;
}

interface UserProfile {
  full_name: string;
  email: string;
  phone: string;
  balance: number;
  last_daily_return?: string;
  total_returns?: number;
  first_deposit_date?: string;
  total_withdrawn?: number;
}

interface UserDashboardProps {
  onClose: () => void;
  lang?: Lang;
}

const UserDashboard = ({ onClose, lang = 'fr' }: UserDashboardProps) => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États pour les dépôts
  const [depositAmount, setDepositAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState('bank_transfer');
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositError, setDepositError] = useState<string | null>(null);
  const [depositSuccess, setDepositSuccess] = useState(false);
  const [showDepositForm, setShowDepositForm] = useState(false);

  // États pour les retraits
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bank_transfer');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [showWithdrawMessage, setShowWithdrawMessage] = useState(false);

  // État pour l'affiliation
  const [showAffiliate, setShowAffiliate] = useState(false);

  // 🔔 Notification de rendement
  const [returnNotification, setReturnNotification] = useState<{
    show: boolean;
    amount: number;
    date: Date | null;
  }>({ show: false, amount: 0, date: null });

  // 📈 Données simulées pour le dashboard (conservées pour le graphique simple)
  const [investmentData] = useState([
    { day: 'Lun', value: 100 },
    { day: 'Mar', value: 120 },
    { day: 'Mer', value: 115 },
    { day: 'Jeu', value: 140 },
    { day: 'Ven', value: 130 },
    { day: 'Sam', value: 155 },
    { day: 'Dim', value: 180 },
  ]);

  // 🔗 Lien WhatsApp
  const WHATSAPP_LINK = 'https://wa.me/message/7OTB46V5AO4SM1';

  const totalInvested = transactions
    .filter(t => t.status === 'confirmed' && t.transaction_type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawn = transactions
    .filter(t => t.status === 'confirmed' && t.transaction_type === 'withdrawal')
    .reduce((sum, t) => sum + t.amount, 0);

  // ✅ 8% PAR JOUR sur le total investi
  const DAILY_RATE = 0.08; // 8% par jour
  const estimatedReturns = totalInvested * DAILY_RATE; // Rendement par jour
  const dailyReturn = estimatedReturns; // Revenu quotidien = 8% du total investi

  // Vérifier si l'utilisateur peut retirer
  const canWithdraw = (): { allowed: boolean; daysLeft: number; firstDepositDate: string | null } => {
    if (!profile?.first_deposit_date) {
      return { allowed: false, daysLeft: 30, firstDepositDate: null };
    }

    const firstDate = new Date(profile.first_deposit_date);
    const now = new Date();
    const diffTime = now.getTime() - firstDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 30) {
      return { allowed: true, daysLeft: 0, firstDepositDate: profile.first_deposit_date };
    } else {
      return { allowed: false, daysLeft: 30 - diffDays, firstDepositDate: profile.first_deposit_date };
    }
  };

  const withdrawStatus = canWithdraw();

  // 👈 Détection du pays depuis le numéro de téléphone
  const detectCountryFromPhone = (phone: string): CountryCode => {
    if (!phone) return 'pe';
    
    const cleanPhone = phone.replace(/\s/g, '');
    
    // Indicatif Pérou: +51 ou 51
    if (cleanPhone.startsWith('+51') || cleanPhone.startsWith('51')) {
      return 'pe';
    }
    // Indicatif Mexique: +52 ou 52
    if (cleanPhone.startsWith('+52') || cleanPhone.startsWith('52')) {
      return 'mx';
    }
    
    // Par défaut Pérou
    return 'pe';
  };

  // 👈 Récupération du pays
  const getCountry = (): CountryCode => {
    // 1. Depuis l'URL (pour test)
    const params = new URLSearchParams(window.location.search);
    const urlCountry = params.get('country') as CountryCode;
    if (urlCountry && (urlCountry === 'pe' || urlCountry === 'mx')) {
      return urlCountry;
    }
    
    // 2. Depuis le profil utilisateur (téléphone)
    if (profile?.phone) {
      const detected = detectCountryFromPhone(profile.phone);
      if (detected) return detected;
    }
    
    // 3. Par défaut Pérou
    return 'pe';
  };

  const countryCode = getCountry();
  const country = countries[countryCode];

  const texts = {
    fr: {
      loading: 'Chargement de votre tableau de bord...',
      profileNotFound: '⚠️ Profil non trouvé. Veuillez contacter le support.',
      greeting: 'Bonjour',
      balance: 'Solde disponible',
      pending: 'En attente',
      totalInvested: 'Total investi',
      totalWithdrawn: 'Total retiré',
      estimatedReturns: 'Gain quotidien (8%/jour)',
      dailyReturns: 'Gain du jour',
      deposit: 'Déposer',
      withdraw: 'Retirer',
      close: 'Fermer',
      logout: 'Déconnexion',
      newDeposit: '💰 Nouveau dépôt',
      newWithdraw: '💸 Nouveau retrait',
      depositSuccess: '✅ Votre demande de dépôt a été enregistrée ! Vous allez être redirigé vers WhatsApp.',
      withdrawSuccess: '✅ Votre demande de retrait a été enregistrée !',
      amountLabel: 'Montant',
      minAmount: 'minimum',
      maxAmount: 'maximum',
      paymentMethod: 'Méthode de paiement',
      bankTransfer: 'Virement bancaire',
      plin: 'Plin',
      paypal: 'PayPal',
      confirmDeposit: 'Confirmer le dépôt',
      confirmWithdraw: 'Confirmer le retrait',
      sending: 'Envoi...',
      cancel: 'Annuler',
      infoText: 'Après validation, votre compte sera mis à jour.',
      history: 'Historique des transactions',
      noTransactions: 'Aucune transaction pour le moment',
      reference: 'Référence',
      amount: 'Montant',
      method: 'Méthode',
      status: 'Statut',
      date: 'Date',
      type: 'Type',
      pendingStatus: 'En attente',
      confirmedStatus: 'Confirmé',
      rejectedStatus: 'Rejeté',
      errorAmount: 'Veuillez entrer un montant valide',
      errorMinAmount: 'Le montant minimum de dépôt est de',
      errorMaxAmount: 'Vous ne pouvez pas retirer plus que votre solde',
      errorDeposit: 'Erreur lors de la création du dépôt',
      errorWithdraw: 'Erreur lors de la création du retrait',
      investmentEvolution: 'Évolution de vos investissements',
      startInvesting: 'Commencez à investir dès maintenant !',
      returnCredited: '💰 Gain quotidien crédité !',
      returnAmount: '8% de votre investissement total',
      totalReturns: 'Total des gains',
      withdrawNotAllowed: 'Retrait disponible dans',
      withdrawNotAllowedDays: 'jours',
      withdrawNotAllowedSub: 'Vous pourrez retirer vos fonds après 30 jours suivant votre premier dépôt.',
      depositRedirect: 'Redirection vers WhatsApp...',
      totalBalance: 'Patrimoine total',
      charts: 'Graphiques',
      affiliate: 'Affiliation',
    },
    en: {
      loading: 'Loading your dashboard...',
      profileNotFound: '⚠️ Profile not found. Please contact support.',
      greeting: 'Hello',
      balance: 'Available balance',
      pending: 'Pending',
      totalInvested: 'Total invested',
      totalWithdrawn: 'Total withdrawn',
      estimatedReturns: 'Daily gain (8%/day)',
      dailyReturns: "Today's gain",
      deposit: 'Deposit',
      withdraw: 'Withdraw',
      close: 'Close',
      logout: 'Logout',
      newDeposit: '💰 New deposit',
      newWithdraw: '💸 New withdrawal',
      depositSuccess: '✅ Your deposit request has been recorded! You will be redirected to WhatsApp.',
      withdrawSuccess: '✅ Your withdrawal request has been recorded!',
      amountLabel: 'Amount',
      minAmount: 'minimum',
      maxAmount: 'maximum',
      paymentMethod: 'Payment method',
      bankTransfer: 'Bank transfer',
      plin: 'Plin',
      paypal: 'PayPal',
      confirmDeposit: 'Confirm deposit',
      confirmWithdraw: 'Confirm withdrawal',
      sending: 'Sending...',
      cancel: 'Cancel',
      infoText: 'After validation, your account will be updated.',
      history: 'Transaction history',
      noTransactions: 'No transactions yet',
      reference: 'Reference',
      amount: 'Amount',
      method: 'Method',
      status: 'Status',
      date: 'Date',
      type: 'Type',
      pendingStatus: 'Pending',
      confirmedStatus: 'Confirmed',
      rejectedStatus: 'Rejected',
      errorAmount: 'Please enter a valid amount',
      errorMinAmount: 'The minimum deposit amount is',
      errorMaxAmount: 'You cannot withdraw more than your balance',
      errorDeposit: 'Error creating deposit',
      errorWithdraw: 'Error creating withdrawal',
      investmentEvolution: 'Investment evolution',
      startInvesting: 'Start investing now!',
      returnCredited: '💰 Daily gain credited!',
      returnAmount: '8% of your total investment',
      totalReturns: 'Total gains',
      withdrawNotAllowed: 'Withdrawal available in',
      withdrawNotAllowedDays: 'days',
      withdrawNotAllowedSub: 'You can withdraw your funds after 30 days following your first deposit.',
      depositRedirect: 'Redirecting to WhatsApp...',
      totalBalance: 'Total wealth',
      charts: 'Charts',
      affiliate: 'Affiliate',
    },
    es: {
      loading: 'Cargando tu panel de control...',
      profileNotFound: '⚠️ Perfil no encontrado. Por favor contacta al soporte.',
      greeting: 'Hola',
      balance: 'Saldo disponible',
      pending: 'Pendiente',
      totalInvested: 'Total invertido',
      totalWithdrawn: 'Total retirado',
      estimatedReturns: 'Ganancia diaria (8%/día)',
      dailyReturns: 'Ganancia del día',
      deposit: 'Depositar',
      withdraw: 'Retirar',
      close: 'Cerrar',
      logout: 'Cerrar sesión',
      newDeposit: '💰 Nuevo depósito',
      newWithdraw: '💸 Nuevo retiro',
      depositSuccess: '✅ ¡Tu solicitud de depósito ha sido registrada! Serás redirigido a WhatsApp.',
      withdrawSuccess: '✅ ¡Tu solicitud de retiro ha sido registrada!',
      amountLabel: 'Monto',
      minAmount: 'mínimo',
      maxAmount: 'máximo',
      paymentMethod: 'Método de pago',
      bankTransfer: 'Transferencia bancaria',
      plin: 'Plin',
      paypal: 'PayPal',
      confirmDeposit: 'Confirmar depósito',
      confirmWithdraw: 'Confirmar retiro',
      sending: 'Enviando...',
      cancel: 'Cancelar',
      infoText: 'Después de la validación, tu cuenta será actualizada.',
      history: 'Historial de transacciones',
      noTransactions: 'No hay transacciones por el momento',
      reference: 'Referencia',
      amount: 'Monto',
      method: 'Método',
      status: 'Estado',
      date: 'Fecha',
      type: 'Tipo',
      pendingStatus: 'Pendiente',
      confirmedStatus: 'Confirmado',
      rejectedStatus: 'Rechazado',
      errorAmount: 'Por favor ingresa un monto válido',
      errorMinAmount: 'El monto mínimo de depósito es',
      errorMaxAmount: 'No puedes retirar más de tu saldo',
      errorDeposit: 'Error al crear el depósito',
      errorWithdraw: 'Error al crear el retiro',
      investmentEvolution: 'Evolución de tus inversiones',
      startInvesting: '¡Empieza a invertir ahora!',
      returnCredited: '💰 ¡Ganancia diaria acreditada!',
      returnAmount: '8% de tu inversión total',
      totalReturns: 'Ganancias totales',
      withdrawNotAllowed: 'Retiro disponible en',
      withdrawNotAllowedDays: 'días',
      withdrawNotAllowedSub: 'Podrás retirar tus fondos después de 30 días de tu primer depósito.',
      depositRedirect: 'Redirigiendo a WhatsApp...',
      totalBalance: 'Patrimonio total',
      charts: 'Gráficos',
      affiliate: 'Afiliado',
    },
  };

  const t = texts[lang] || texts.fr;

  // 👈 MIN DEPOSIT selon le pays détecté automatiquement
  const minDeposit = (() => {
    switch (countryCode) {
      case 'mx': return 650;
      case 'pe': return 100;
      default: return 100;
    }
  })();

  // 👈 MÉTHODES DE PAIEMENT disponibles
  const getPaymentMethods = () => {
    const methods = [
      { value: 'bank_transfer', label: t.bankTransfer },
      { value: 'plin', label: t.plin },
      { value: 'paypal', label: t.paypal },
    ];
    return methods;
  };

  const paymentMethods = getPaymentMethods();

  // 📈 Calcul automatique des rendements quotidiens (8% par jour)
  const calculateDailyReturn = async (profileData: UserProfile) => {
    if (!user) return;

    const now = new Date();
    const lastReturn = profileData.last_daily_return ? new Date(profileData.last_daily_return) : null;
    
    if (lastReturn) {
      const hoursDiff = (now.getTime() - lastReturn.getTime()) / (1000 * 60 * 60);
      if (hoursDiff < 24) return;
    }

    const dailyRate = 0.08;
    const returnAmount = profileData.balance * dailyRate;
    
    if (returnAmount <= 0) return;

    const newBalance = profileData.balance + returnAmount;
    const newTotalReturns = (profileData.total_returns || 0) + returnAmount;

    const { error } = await supabase
      .from('users')
      .update({
        balance: newBalance,
        total_returns: newTotalReturns,
        last_daily_return: now.toISOString()
      })
      .eq('id', user.id);

    if (error) {
      console.error('❌ Erreur rendement:', error);
    } else {
      setProfile({
        ...profileData,
        balance: newBalance,
        total_returns: newTotalReturns,
        last_daily_return: now.toISOString()
      });
      
      setReturnNotification({
        show: true,
        amount: returnAmount,
        date: now
      });
      
      setTimeout(() => {
        setReturnNotification({ show: false, amount: 0, date: null });
      }, 8000);
    }
  };

  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    const fetchData = async () => {
      setLoading(true);

      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Erreur profil:', profileError);
      } else {
        setProfile(profileData);
        await calculateDailyReturn(profileData);
      }

      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (transactionsError) {
        console.error('Erreur transactions:', transactionsError);
      } else {
        setTransactions(transactionsData || []);
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  // 💰 Faire un dépôt
  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      setDepositError(t.errorAmount);
      return;
    }

    if (amount < minDeposit) {
      setDepositError(`${t.errorMinAmount} ${minDeposit}`);
      return;
    }

    setDepositLoading(true);
    setDepositError(null);
    setDepositSuccess(false);

    const reference = `DEP-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const isFirstDeposit = transactions.filter(t => t.transaction_type === 'deposit' && t.status === 'confirmed').length === 0;

    const { error } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: user.id,
          amount: amount,
          status: 'pending',
          reference: reference,
          payment_method: depositMethod,
          transaction_type: 'deposit',
        }
      ]);

    if (error) {
      console.error('Erreur dépôt:', error);
      setDepositError(t.errorDeposit);
      setDepositLoading(false);
    } else {
      setDepositSuccess(true);
      setDepositAmount('');
      
      if (isFirstDeposit) {
        await supabase
          .from('users')
          .update({ first_deposit_date: new Date().toISOString() })
          .eq('id', user.id);
      }

      const message = `Bonjour, je viens de faire une demande de dépôt de ${amount} sur CapitalUnido. Ma référence est ${reference}. Pouvez-vous m'aider à finaliser mon paiement ?`;
      
      setTimeout(() => {
        window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`, '_blank');
      }, 1500);

      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setTransactions(data || []);
      
      setTimeout(() => setShowDepositForm(false), 2000);
      setDepositLoading(false);
    }
  };

  // 💸 Faire un retrait
  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setWithdrawError(t.errorAmount);
      return;
    }

    if (amount > profile.balance) {
      setWithdrawError(t.errorMaxAmount);
      return;
    }

    setWithdrawLoading(true);
    setWithdrawError(null);
    setWithdrawSuccess(false);

    const reference = `WIT-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const { error } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: user.id,
          amount: amount,
          status: 'pending',
          reference: reference,
          payment_method: withdrawMethod,
          transaction_type: 'withdrawal',
        }
      ]);

    if (error) {
      console.error('Erreur retrait:', error);
      setWithdrawError(t.errorWithdraw);
    } else {
      setWithdrawSuccess(true);
      setWithdrawAmount('');
      
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setTransactions(data || []);
      
      setTimeout(() => setShowWithdrawForm(false), 2000);
    }

    setWithdrawLoading(false);
  };

  const pendingTotal = transactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const maxValue = Math.max(...investmentData.map(d => d.value), 100);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'confirmed': return 'bg-green-100 text-green-800 border border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border border-red-300';
      default: return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return t.pendingStatus;
      case 'confirmed': return t.confirmedStatus;
      case 'rejected': return t.rejectedStatus;
      default: return status;
    }
  };

  const getTypeText = (type: string) => {
    if (type === 'deposit') return '📥 Dépôt';
    if (type === 'withdrawal') return '📤 Retrait';
    return type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e8edf5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#6b2737] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e8edf5] flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-3xl shadow-2xl">
          <p className="text-gray-600">{t.profileNotFound}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="mt-4 bg-[#6b2737] hover:bg-[#6b2737]/80 text-white font-bold px-6 py-3 rounded-full transition-all"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e8edf5] p-3 sm:p-4 md:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* ============================================================ */}
        {/* 1️⃣ EN-TÊTE - Nom + Boutons */}
        {/* ============================================================ */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 w-full lg:w-auto">
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 truncate">
                  {t.greeting}, {profile.full_name}
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 truncate">{profile.email}</p>
              </div>
              <div className="flex-shrink-0">
                <NotificationBell 
                  userId={user?.id || ''} 
                  lang={lang}
                  country={countryCode}
                />
              </div>
            </div>
            
            {/* Boutons - responsive */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full lg:w-auto">
              <button
                onClick={() => {
                  setShowDepositForm(!showDepositForm);
                  setShowWithdrawForm(false);
                  setShowWithdrawMessage(false);
                  setShowAffiliate(false);
                }}
                className="bg-[#6b2737] hover:bg-[#6b2737]/90 text-white font-semibold px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg text-xs sm:text-sm flex-1 sm:flex-none"
              >
                + {t.deposit}
              </button>
              <button
                onClick={() => {
                  if (withdrawStatus.allowed) {
                    setShowWithdrawForm(!showWithdrawForm);
                    setShowDepositForm(false);
                    setShowWithdrawMessage(false);
                    setShowAffiliate(false);
                  } else {
                    setShowWithdrawMessage(true);
                    setShowWithdrawForm(false);
                    setTimeout(() => setShowWithdrawMessage(false), 5000);
                  }
                }}
                className={`font-semibold px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg text-xs sm:text-sm flex-1 sm:flex-none ${
                  withdrawStatus.allowed
                    ? 'bg-[#6b2737] hover:bg-[#4e1d29] text-white'
                    : 'bg-gray-200 text-gray-400 cursor-pointer hover:bg-gray-300'
                }`}
              >
                {t.withdraw}
              </button>
              <button
                onClick={() => {
                  setShowAffiliate(!showAffiliate);
                  setShowDepositForm(false);
                  setShowWithdrawForm(false);
                  setShowWithdrawMessage(false);
                }}
                className={`font-semibold px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg text-xs sm:text-sm flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none ${
                  showAffiliate
                    ? 'bg-purple-700 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">{t.affiliate}</span>
                <span className="xs:hidden">Aff.</span>
              </button>
              <button
                onClick={onClose}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all text-xs sm:text-sm flex-1 sm:flex-none"
              >
                ✕ <span className="hidden xs:inline">{t.close}</span>
              </button>
              <button
                onClick={() => { signOut(); window.location.href = '/'; }}
                className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all border border-red-200 text-xs sm:text-sm flex-1 sm:flex-none"
              >
                <span className="hidden xs:inline">{t.logout}</span>
                <span className="xs:hidden">🚪</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* AFFILIATION */}
        {/* ============================================================ */}
        {showAffiliate && (
          <div className="mb-4 sm:mb-6">
            <AffiliateDashboard lang={lang} />
          </div>
        )}

        {/* ============================================================ */}
        {/* 2️⃣ FORMULAIRE DE DÉPÔT */}
        {/* ============================================================ */}
        {showDepositForm && (
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">{t.newDeposit}</h3>
            
            {depositSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl mb-3 sm:mb-4 text-xs sm:text-sm">
                {t.depositSuccess}
              </div>
            )}

            {depositError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl mb-3 sm:mb-4 text-xs sm:text-sm">
                ❌ {depositError}
              </div>
            )}

            <form onSubmit={handleDeposit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {t.amountLabel} <span className="text-gray-400 font-normal">({t.minAmount} : {minDeposit})</span>
                </label>
                <input
                  type="number"
                  min={minDeposit}
                  step="1"
                  placeholder={`Ex: ${minDeposit}`}
                  className="w-full p-2.5 sm:p-3 bg-gray-50 rounded-xl text-gray-800 border border-gray-200 focus:border-[#6b2737] outline-none transition-all text-sm"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">{t.paymentMethod}</label>
                <select
                  className="w-full p-2.5 sm:p-3 bg-gray-50 rounded-xl text-gray-800 border border-gray-200 focus:border-[#6b2737] outline-none transition-all text-sm"
                  value={depositMethod}
                  onChange={(e) => setDepositMethod(e.target.value)}
                >
                  {paymentMethods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 sm:gap-3">
                <button
                  type="submit"
                  disabled={depositLoading}
                  className="flex-1 bg-[#6b2737] hover:bg-[#6b2737]/90 text-white font-semibold py-2.5 sm:py-3 rounded-xl disabled:opacity-50 transition-all shadow-sm text-sm"
                >
                  {depositLoading ? t.sending : t.confirmDeposit}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDepositForm(false)}
                  className="px-4 sm:px-6 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2.5 sm:py-3 rounded-xl transition-all text-sm"
                >
                  {t.cancel}
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center">{t.infoText}</p>
            </form>
          </div>
        )}

        {/* ============================================================ */}
        {/* 3️⃣ NOTIFICATIONS ET MESSAGES */}
        {/* ============================================================ */}
        {returnNotification.show && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 shadow-sm animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl">💰</span>
                <div>
                  <p className="font-semibold text-green-700 text-sm sm:text-base">{t.returnCredited}</p>
                  <p className="text-xs sm:text-sm text-green-600">
                    +{returnNotification.amount.toFixed(2)} ({t.returnAmount})
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setReturnNotification({ show: false, amount: 0, date: null })}
                className="text-green-500 hover:text-green-700"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {showWithdrawMessage && !withdrawStatus.allowed && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 shadow-sm animate-fade-in-up">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl">⏳</span>
              <div>
                <p className="font-semibold text-yellow-700 text-sm sm:text-base">
                  {t.withdrawNotAllowed} {withdrawStatus.daysLeft} {t.withdrawNotAllowedDays}
                </p>
                <p className="text-xs sm:text-sm text-yellow-600">{t.withdrawNotAllowedSub}</p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 4️⃣ STATISTIQUES */}
        {/* ============================================================ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-3 sm:p-4 md:p-5 border border-gray-100">
            <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">{t.balance}</p>
            <p className="text-base sm:text-xl md:text-2xl font-bold text-gray-800 mt-0.5 sm:mt-1">{profile.balance.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-3 sm:p-4 md:p-5 border border-gray-100">
            <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">{t.pending}</p>
            <p className="text-base sm:text-xl md:text-2xl font-bold text-yellow-600 mt-0.5 sm:mt-1">{pendingTotal.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-3 sm:p-4 md:p-5 border border-gray-100">
            <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">{t.totalInvested}</p>
            <p className="text-base sm:text-xl md:text-2xl font-bold text-[#6b2737] font-mono-data mt-0.5 sm:mt-1">{totalInvested.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-3 sm:p-4 md:p-5 border border-gray-100">
            <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">{t.totalWithdrawn}</p>
            <p className="text-base sm:text-xl md:text-2xl font-bold text-red-500 mt-0.5 sm:mt-1">{totalWithdrawn.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-3 sm:p-4 md:p-5 border border-gray-100">
            <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">{t.estimatedReturns}</p>
            <p className="text-base sm:text-xl md:text-2xl font-bold text-purple-600 mt-0.5 sm:mt-1">{estimatedReturns.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-3 sm:p-4 md:p-5 border border-gray-100">
            <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">{t.totalReturns}</p>
            <p className="text-base sm:text-xl md:text-2xl font-bold text-[#2f6f4e] font-mono-data mt-0.5 sm:mt-1">{(profile.total_returns || 0).toFixed(2)}</p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 5️⃣ REVENU QUOTIDIEN */}
        {/* ============================================================ */}
        <div className="bg-gradient-to-r from-[#f7f4ef] to-[#efe9df] rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 border border-[#e4ded3]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">{t.dailyReturns}</p>
              <p className="text-base sm:text-xl md:text-2xl font-bold text-[#6b2737] font-mono-data">{dailyReturn.toFixed(2)}</p>
            </div>
            <div className="text-2xl sm:text-3xl">📅</div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 6️⃣ GRAPHIQUES AVEC RECHARTS */}
        {/* ============================================================ */}
        {user && (
          <div className="mb-4 sm:mb-6">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-4">{t.charts}</h3>
            <DashboardCharts userId={user.id} lang={lang} />
          </div>
        )}

        {/* ============================================================ */}
        {/* 7️⃣ FORMULAIRE DE RETRAIT */}
        {/* ============================================================ */}
        {showWithdrawForm && withdrawStatus.allowed && (
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">{t.newWithdraw}</h3>
            
            {withdrawSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl mb-3 sm:mb-4 text-xs sm:text-sm">
                {t.withdrawSuccess}
              </div>
            )}

            {withdrawError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl mb-3 sm:mb-4 text-xs sm:text-sm">
                ❌ {withdrawError}
              </div>
            )}

            <form onSubmit={handleWithdraw} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {t.amountLabel} <span className="text-gray-400 font-normal">({t.maxAmount} : {profile.balance.toFixed(2)})</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max={profile.balance}
                  step="1"
                  placeholder={`Ex: ${Math.min(100, profile.balance)}`}
                  className="w-full p-2.5 sm:p-3 bg-gray-50 rounded-xl text-gray-800 border border-gray-200 focus:border-[#6b2737] outline-none transition-all text-sm"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">{t.paymentMethod}</label>
                <select
                  className="w-full p-2.5 sm:p-3 bg-gray-50 rounded-xl text-gray-800 border border-gray-200 focus:border-[#6b2737] outline-none transition-all text-sm"
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                >
                  {paymentMethods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 sm:gap-3">
                <button
                  type="submit"
                  disabled={withdrawLoading}
                  className="flex-1 bg-[#6b2737] hover:bg-[#4e1d29] text-white font-semibold py-2.5 sm:py-3 rounded-xl disabled:opacity-50 transition-all shadow-sm text-sm"
                >
                  {withdrawLoading ? t.sending : t.confirmWithdraw}
                </button>
                <button
                  type="button"
                  onClick={() => setShowWithdrawForm(false)}
                  className="px-4 sm:px-6 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2.5 sm:py-3 rounded-xl transition-all text-sm"
                >
                  {t.cancel}
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center">{t.infoText}</p>
            </form>
          </div>
        )}

        {/* ============================================================ */}
        {/* 8️⃣ HISTORIQUE */}
        {/* ============================================================ */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
          <h2 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4">{t.history}</h2>
          
          {transactions.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <p className="text-gray-400 text-xs sm:text-sm">{t.noTransactions}</p>
              <p className="text-gray-400 text-[10px] sm:text-xs mt-1">{t.startInvesting}</p>
              <button
                onClick={() => setShowDepositForm(true)}
                className="mt-3 sm:mt-4 bg-[#6b2737] hover:bg-[#6b2737]/90 text-white font-semibold px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl transition-all text-xs sm:text-sm"
              >
                + {t.deposit}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 px-2 sm:px-0 text-gray-400 font-medium">{t.reference}</th>
                    <th className="text-left py-2 px-2 sm:px-0 text-gray-400 font-medium">{t.type}</th>
                    <th className="text-left py-2 px-2 sm:px-0 text-gray-400 font-medium">{t.amount}</th>
                    <th className="hidden sm:table-cell text-left py-2 px-2 sm:px-0 text-gray-400 font-medium">{t.method}</th>
                    <th className="text-left py-2 px-2 sm:px-0 text-gray-400 font-medium">{t.status}</th>
                    <th className="text-left py-2 px-2 sm:px-0 text-gray-400 font-medium">{t.date}</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-50 hover:bg-gray-50 transition-all">
                      <td className="py-2 px-2 sm:px-0 text-gray-600 font-mono text-[10px] sm:text-xs truncate max-w-[60px] sm:max-w-none">{transaction.reference}</td>
                      <td className="py-2 px-2 sm:px-0 text-gray-600 text-[10px] sm:text-xs">{getTypeText(transaction.transaction_type)}</td>
                      <td className="py-2 px-2 sm:px-0 text-gray-800 font-semibold text-xs sm:text-sm">{transaction.amount.toFixed(2)}</td>
                      <td className="hidden sm:table-cell py-2 px-2 sm:px-0 text-gray-500 text-xs">{transaction.payment_method}</td>
                      <td className="py-2 px-2 sm:px-0">
                        <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${getStatusBadge(transaction.status)}`}>
                          {getStatusText(transaction.status)}
                        </span>
                      </td>
                      <td className="py-2 px-2 sm:px-0 text-gray-400 text-[10px] sm:text-xs">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;