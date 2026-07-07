import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { countries, CountryCode, Lang } from '../data/countries';
import DashboardCharts from './DashboardCharts';

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
  const WHATSAPP_LINK = 'https://wa.me/message/YCYBNEDFB3CTA1';

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

  const getCountry = (): CountryCode => {
    const params = new URLSearchParams(window.location.search);
    const country = params.get('country') as CountryCode;
    return country && (country === 'pe' || country === 'mx') ? country : 'pe';
  };

  const countryCode = getCountry();
  const country = countries[countryCode];
  const minDeposit = country.amounts.minDeposit || 100;

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
      yape: 'Yape',
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
      yape: 'Yape',
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
      yape: 'Yape',
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
    },
  };

  const t = texts[lang] || texts.fr;

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
          <div className="w-12 h-12 border-4 border-[#D91023] border-t-transparent rounded-full animate-spin mx-auto"></div>
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
            className="mt-4 bg-[#D91023] hover:bg-[#D91023]/80 text-white font-bold px-6 py-3 rounded-full transition-all"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e8edf5] p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* ============================================================ */}
        {/* 1️⃣ EN-TÊTE - Nom + Boutons */}
        {/* ============================================================ */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {t.greeting}, {profile.full_name}
              </h1>
              <p className="text-gray-400 text-sm">{profile.email}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setShowDepositForm(!showDepositForm);
                  setShowWithdrawForm(false);
                  setShowWithdrawMessage(false);
                }}
                className="bg-[#D91023] hover:bg-[#D91023]/90 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg text-sm"
              >
                + {t.deposit}
              </button>
              <button
                onClick={() => {
                  if (withdrawStatus.allowed) {
                    setShowWithdrawForm(!showWithdrawForm);
                    setShowDepositForm(false);
                    setShowWithdrawMessage(false);
                  } else {
                    setShowWithdrawMessage(true);
                    setShowWithdrawForm(false);
                    setTimeout(() => setShowWithdrawMessage(false), 5000);
                  }
                }}
                className={`font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg text-sm ${
                  withdrawStatus.allowed
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-pointer hover:bg-gray-300'
                }`}
              >
                {t.withdraw}
              </button>
              <button
                onClick={onClose}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold px-4 py-2.5 rounded-xl transition-all text-sm"
              >
                ✕ {t.close}
              </button>
              <button
                onClick={() => { signOut(); window.location.href = '/'; }}
                className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-4 py-2.5 rounded-xl transition-all border border-red-200 text-sm"
              >
                {t.logout}
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2️⃣ FORMULAIRE DE DÉPÔT (juste en dessous de l'en-tête) */}
        {/* ============================================================ */}
        {showDepositForm && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t.newDeposit}</h3>
            
            {depositSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm">
                {t.depositSuccess}
              </div>
            )}

            {depositError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
                ❌ {depositError}
              </div>
            )}

            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {t.amountLabel} <span className="text-gray-400 font-normal">({t.minAmount} : {minDeposit})</span>
                </label>
                <input
                  type="number"
                  min={minDeposit}
                  step="1"
                  placeholder={`Ex: ${minDeposit}`}
                  className="w-full p-3 bg-gray-50 rounded-xl text-gray-800 border border-gray-200 focus:border-[#D91023] outline-none transition-all"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">{t.paymentMethod}</label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl text-gray-800 border border-gray-200 focus:border-[#D91023] outline-none transition-all"
                  value={depositMethod}
                  onChange={(e) => setDepositMethod(e.target.value)}
                >
                  <option value="bank_transfer">{t.bankTransfer}</option>
                  <option value="yape">{t.yape}</option>
                  <option value="plin">{t.plin}</option>
                  <option value="paypal">{t.paypal}</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={depositLoading}
                  className="flex-1 bg-[#D91023] hover:bg-[#D91023]/90 text-white font-semibold py-3 rounded-xl disabled:opacity-50 transition-all shadow-sm"
                >
                  {depositLoading ? t.sending : t.confirmDeposit}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDepositForm(false)}
                  className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 rounded-xl transition-all"
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
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 shadow-sm animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💰</span>
                <div>
                  <p className="font-semibold text-green-700">{t.returnCredited}</p>
                  <p className="text-sm text-green-600">
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
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6 shadow-sm animate-fade-in-up">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⏳</span>
              <div>
                <p className="font-semibold text-yellow-700">
                  {t.withdrawNotAllowed} {withdrawStatus.daysLeft} {t.withdrawNotAllowedDays}
                </p>
                <p className="text-sm text-yellow-600">{t.withdrawNotAllowedSub}</p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 4️⃣ STATISTIQUES */}
        {/* ============================================================ */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wider">{t.balance}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{profile.balance.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wider">{t.pending}</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingTotal.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wider">{t.totalInvested}</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{totalInvested.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wider">{t.totalWithdrawn}</p>
            <p className="text-2xl font-bold text-red-500 mt-1">{totalWithdrawn.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wider">{t.estimatedReturns}</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">{estimatedReturns.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wider">{t.totalReturns}</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">{(profile.total_returns || 0).toFixed(2)}</p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 5️⃣ REVENU QUOTIDIEN */}
        {/* ============================================================ */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mb-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">{t.dailyReturns}</p>
              <p className="text-2xl font-bold text-blue-700">{dailyReturn.toFixed(2)}</p>
            </div>
            <div className="text-3xl">📅</div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 6️⃣ GRAPHIQUES AVEC RECHARTS (remplace le graphique simple) */}
        {/* ============================================================ */}
        {user && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">{t.charts}</h3>
            <DashboardCharts userId={user.id} lang={lang} />
          </div>
        )}

        {/* ============================================================ */}
        {/* 7️⃣ FORMULAIRE DE RETRAIT */}
        {/* ============================================================ */}
        {showWithdrawForm && withdrawStatus.allowed && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t.newWithdraw}</h3>
            
            {withdrawSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm">
                {t.withdrawSuccess}
              </div>
            )}

            {withdrawError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
                ❌ {withdrawError}
              </div>
            )}

            <form onSubmit={handleWithdraw} className="space-y-4">
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
                  className="w-full p-3 bg-gray-50 rounded-xl text-gray-800 border border-gray-200 focus:border-blue-500 outline-none transition-all"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">{t.paymentMethod}</label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl text-gray-800 border border-gray-200 focus:border-blue-500 outline-none transition-all"
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                >
                  <option value="bank_transfer">{t.bankTransfer}</option>
                  <option value="yape">{t.yape}</option>
                  <option value="plin">{t.plin}</option>
                  <option value="paypal">{t.paypal}</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={withdrawLoading}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl disabled:opacity-50 transition-all shadow-sm"
                >
                  {withdrawLoading ? t.sending : t.confirmWithdraw}
                </button>
                <button
                  type="button"
                  onClick={() => setShowWithdrawForm(false)}
                  className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 rounded-xl transition-all"
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
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">{t.history}</h2>
          
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">{t.noTransactions}</p>
              <p className="text-gray-400 text-xs mt-1">{t.startInvesting}</p>
              <button
                onClick={() => setShowDepositForm(true)}
                className="mt-4 bg-[#D91023] hover:bg-[#D91023]/90 text-white font-semibold px-6 py-2 rounded-xl transition-all text-sm"
              >
                + {t.deposit}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 text-gray-400 font-medium">{t.reference}</th>
                    <th className="text-left py-2 text-gray-400 font-medium">{t.type}</th>
                    <th className="text-left py-2 text-gray-400 font-medium">{t.amount}</th>
                    <th className="text-left py-2 text-gray-400 font-medium">{t.method}</th>
                    <th className="text-left py-2 text-gray-400 font-medium">{t.status}</th>
                    <th className="text-left py-2 text-gray-400 font-medium">{t.date}</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-50 hover:bg-gray-50 transition-all">
                      <td className="py-2 text-gray-600 font-mono text-xs">{transaction.reference}</td>
                      <td className="py-2 text-gray-600 text-xs">{getTypeText(transaction.transaction_type)}</td>
                      <td className="py-2 text-gray-800 font-semibold">{transaction.amount.toFixed(2)}</td>
                      <td className="py-2 text-gray-500 text-xs">{transaction.payment_method}</td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(transaction.status)}`}>
                          {getStatusText(transaction.status)}
                        </span>
                      </td>
                      <td className="py-2 text-gray-400 text-xs">
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