import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Copy, Share2, Users, Award, Gift, ChevronRight, TrendingUp, UserPlus } from 'lucide-react';

interface AffiliateStats {
  level_1_count: number;
  level_2_count: number;
  level_3_count: number;
  total_paid: number;
  total_pending: number;
}

interface Referral {
  id: string;
  referred_email: string;
  referred_name: string;
  level: number;
  status: string;
  amount: number;
  created_at: string;
  rewarded_at: string | null;
}

interface Commission {
  id: string;
  amount: number;
  type: string;
  status: string;
  created_at: string;
  paid_at: string | null;
}

const AffiliateDashboard = ({ lang = 'fr' }: { lang?: 'fr' | 'en' | 'es' }) => {
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState('');
  const [stats, setStats] = useState<AffiliateStats>({
    level_1_count: 0,
    level_2_count: 0,
    level_3_count: 0,
    total_paid: 0,
    total_pending: 0,
  });
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [referralLink, setReferralLink] = useState('');
  const [activeTab, setActiveTab] = useState<'referrals' | 'commissions'>('referrals');

  const texts = {
    fr: {
      title: '👥 Programme d\'affiliation',
      subtitle: 'Parrainez vos amis et gagnez des commissions sur 3 niveaux',
      yourCode: 'Votre code d\'affiliation',
      copy: 'Copier',
      copied: 'Copié !',
      share: 'Partager',
      stats: 'Vos statistiques',
      level1: 'Niveau 1 (25%)',
      level2: 'Niveau 2 (10%)',
      level3: 'Niveau 3 (5%)',
      totalPaid: 'Commissions versées',
      totalPending: 'Commissions en attente',
      referrals: 'Mes parrainages',
      commissions: 'Mes commissions',
      noReferrals: 'Aucun parrainage pour le moment',
      inviteFriends: 'Invitez vos amis et gagnez jusqu\'à 25% de leurs dépôts !',
      copyLink: 'Copier le lien',
      status: {
        pending: 'En attente',
        active: 'Actif',
        rewarded: 'Récompensé',
        paid: 'Payé',
      },
      shareText: 'Rejoignez-moi sur CapitalUnido avec mon code : ',
      referralBonus: 'Bonus de parrainage',
      dailyCommission: 'Commission quotidienne',
      level: 'Niveau',
      amount: 'Montant',
      date: 'Date',
      status_label: 'Statut',
      user: 'Utilisateur',
      commission: 'Commission',
      type: 'Type',
      noCommissions: 'Aucune commission pour le moment',
      yourReferrals: 'Vos parrainages',
      levelLabel: 'Niveau',
    },
    en: {
      title: '👥 Affiliate Program',
      subtitle: 'Refer your friends and earn commissions on 3 levels',
      yourCode: 'Your affiliate code',
      copy: 'Copy',
      copied: 'Copied!',
      share: 'Share',
      stats: 'Your statistics',
      level1: 'Level 1 (25%)',
      level2: 'Level 2 (10%)',
      level3: 'Level 3 (5%)',
      totalPaid: 'Paid commissions',
      totalPending: 'Pending commissions',
      referrals: 'My referrals',
      commissions: 'My commissions',
      noReferrals: 'No referrals yet',
      inviteFriends: 'Invite your friends and earn up to 25% of their deposits!',
      copyLink: 'Copy link',
      status: {
        pending: 'Pending',
        active: 'Active',
        rewarded: 'Rewarded',
        paid: 'Paid',
      },
      shareText: 'Join me on CapitalUnido with my code: ',
      referralBonus: 'Referral bonus',
      dailyCommission: 'Daily commission',
      level: 'Level',
      amount: 'Amount',
      date: 'Date',
      status_label: 'Status',
      user: 'User',
      commission: 'Commission',
      type: 'Type',
      noCommissions: 'No commissions yet',
      yourReferrals: 'Your referrals',
      levelLabel: 'Level',
    },
    es: {
      title: '👥 Programa de afiliados',
      subtitle: 'Recomienda a tus amigos y gana comisiones en 3 niveles',
      yourCode: 'Tu código de afiliado',
      copy: 'Copiar',
      copied: '¡Copiado!',
      share: 'Compartir',
      stats: 'Tus estadísticas',
      level1: 'Nivel 1 (25%)',
      level2: 'Nivel 2 (10%)',
      level3: 'Nivel 3 (5%)',
      totalPaid: 'Comisiones pagadas',
      totalPending: 'Comisiones pendientes',
      referrals: 'Mis referidos',
      commissions: 'Mis comisiones',
      noReferrals: 'Sin referidos por el momento',
      inviteFriends: '¡Invita a tus amigos y gana hasta el 25% de sus depósitos!',
      copyLink: 'Copiar enlace',
      status: {
        pending: 'Pendiente',
        active: 'Activo',
        rewarded: 'Recompensado',
        paid: 'Pagado',
      },
      shareText: 'Únete a CapitalUnido con mi código: ',
      referralBonus: 'Bono de referencia',
      dailyCommission: 'Comisión diaria',
      level: 'Nivel',
      amount: 'Monto',
      date: 'Fecha',
      status_label: 'Estado',
      user: 'Usuario',
      commission: 'Comisión',
      type: 'Tipo',
      noCommissions: 'Sin comisiones por el momento',
      yourReferrals: 'Tus referidos',
      levelLabel: 'Nivel',
    },
  };

  const t = texts[lang] || texts.fr;

  useEffect(() => {
    if (!user) return;

    const fetchAffiliateData = async () => {
      setLoading(true);

      // 1. Récupérer le code d'affiliation
      const { data: codeData } = await supabase
        .from('affiliate_codes')
        .select('code')
        .eq('user_id', user.id)
        .single();

      if (codeData) {
        setReferralCode(codeData.code);
        setReferralLink(`${window.location.origin}/register?ref=${codeData.code}`);
      }

      // 2. Récupérer les statistiques
      const { data: statsData } = await supabase
        .from('affiliate_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (statsData) {
        setStats({
          level_1_count: statsData.level_1_count || 0,
          level_2_count: statsData.level_2_count || 0,
          level_3_count: statsData.level_3_count || 0,
          total_paid: statsData.total_paid || 0,
          total_pending: statsData.total_pending || 0,
        });
      }

      // 3. Récupérer les parrainages avec les infos utilisateurs
      // ℹ️ On passe par la fonction sécurisée get_my_referred_users() plutôt
      // que par un join direct sur "users" (bloqué par RLS, et qui exposerait
      // des colonnes sensibles comme le solde si jamais autorisé directement).
      const { data: referralsData, error: referralsError } = await supabase
        .rpc('get_my_referred_users');

      if (referralsError) {
        console.error('❌ Erreur récupération filleuls:', referralsError);
      }

      if (referralsData) {
        const formattedReferrals = referralsData.map((r: any) => ({
          id: r.referral_id,
          level: r.level,
          status: r.status,
          created_at: r.created_at,
          rewarded_at: r.rewarded_at,
          referred_email: r.referred_email || 'Inconnu',
          referred_name: r.referred_full_name || 'Utilisateur',
          amount: 0, // Sera calculé depuis les commissions
        }));
        setReferrals(formattedReferrals);
      }

      // 4. Récupérer les commissions
      const { data: commissionsData } = await supabase
        .from('commissions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (commissionsData) {
        setCommissions(commissionsData);
      }

      setLoading(false);
    };

    fetchAffiliateData();
  }, [user]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'CapitalUnido - Investissement intelligent',
        text: `${t.shareText} ${referralCode}`,
        url: referralLink,
      });
    } else {
      handleCopyLink();
    }
  };

  const getStatusText = (status: string) => {
    return t.status[status as keyof typeof t.status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'rewarded': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 2: return 'text-blue-600 bg-blue-50 border-blue-200';
      case 3: return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getLevelLabel = (level: number) => {
    switch (level) {
      case 1: return `🥇 ${t.level1}`;
      case 2: return `🥈 ${t.level2}`;
      case 3: return `🥉 ${t.level3}`;
      default: return `Niveau ${level}`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold">{t.title}</h2>
        <p className="text-blue-100 mt-1">{t.subtitle}</p>
      </div>

      {/* Code d'affiliation */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <p className="text-sm font-medium text-gray-700 mb-2">{t.yourCode}</p>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-[150px] bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl px-4 py-3">
            <code className="text-lg font-mono font-bold text-blue-600">{referralCode}</code>
          </div>
          <button
            onClick={handleCopyCode}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            {copied ? t.copied : t.copy}
          </button>
          <button
            onClick={handleShare}
            className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            {t.share}
          </button>
        </div>
        <button
          onClick={handleCopyLink}
          className="mt-3 text-sm text-blue-600 hover:text-blue-700 hover:underline"
        >
          {t.copyLink}
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 text-center">
          <div className="text-2xl mb-1">🥇</div>
          <p className="text-2xl font-bold text-yellow-600">{stats.level_1_count}</p>
          <p className="text-xs text-gray-500">{t.level1}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 text-center">
          <div className="text-2xl mb-1">🥈</div>
          <p className="text-2xl font-bold text-blue-600">{stats.level_2_count}</p>
          <p className="text-xs text-gray-500">{t.level2}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 text-center">
          <div className="text-2xl mb-1">🥉</div>
          <p className="text-2xl font-bold text-purple-600">{stats.level_3_count}</p>
          <p className="text-xs text-gray-500">{t.level3}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 text-center">
          <Gift className="w-6 h-6 text-green-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-green-600">{stats.total_paid.toFixed(2)}</p>
          <p className="text-xs text-gray-500">{t.totalPaid}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 text-center">
          <Award className="w-6 h-6 text-orange-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-orange-600">{stats.total_pending.toFixed(2)}</p>
          <p className="text-xs text-gray-500">{t.totalPending}</p>
        </div>
      </div>

      {/* Message d'invitation */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4 border border-purple-100">
        <p className="text-gray-700 text-center">
          🚀 {t.inviteFriends}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('referrals')}
          className={`px-4 py-2 font-medium transition-all ${
            activeTab === 'referrals'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <UserPlus className="w-4 h-4 inline mr-1" />
          {t.referrals}
        </button>
        <button
          onClick={() => setActiveTab('commissions')}
          className={`px-4 py-2 font-medium transition-all ${
            activeTab === 'commissions'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <TrendingUp className="w-4 h-4 inline mr-1" />
          {t.commissions}
        </button>
      </div>

      {/* Contenu des tabs */}
      {activeTab === 'referrals' && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">{t.yourReferrals}</h3>
          
          {referrals.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">{t.noReferrals}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 text-gray-500 font-medium">{t.user}</th>
                    <th className="text-left py-2 text-gray-500 font-medium">{t.levelLabel}</th>
                    <th className="text-left py-2 text-gray-500 font-medium">{t.status_label}</th>
                    <th className="text-left py-2 text-gray-500 font-medium">{t.date}</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((referral) => (
                    <tr key={referral.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="py-2 text-gray-800 font-medium">{referral.referred_name}</td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getLevelColor(referral.level)}`}>
                          {getLevelLabel(referral.level)}
                        </span>
                      </td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(referral.status)}`}>
                          {getStatusText(referral.status)}
                        </span>
                      </td>
                      <td className="py-2 text-gray-400 text-xs">
                        {new Date(referral.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'commissions' && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">{t.commissions}</h3>
          
          {commissions.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">{t.noCommissions}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 text-gray-500 font-medium">{t.amount}</th>
                    <th className="text-left py-2 text-gray-500 font-medium">{t.type}</th>
                    <th className="text-left py-2 text-gray-500 font-medium">{t.status_label}</th>
                    <th className="text-left py-2 text-gray-500 font-medium">{t.date}</th>
                  </tr>
                </thead>
                <tbody>
                  {commissions.map((commission) => (
                    <tr key={commission.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="py-2 text-gray-800 font-semibold text-green-600">
                        +{commission.amount.toFixed(2)}
                      </td>
                      <td className="py-2 text-gray-600 text-xs">
                        {commission.type === 'referral_bonus' ? t.referralBonus : t.dailyCommission}
                      </td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(commission.status)}`}>
                          {getStatusText(commission.status)}
                        </span>
                      </td>
                      <td className="py-2 text-gray-400 text-xs">
                        {new Date(commission.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AffiliateDashboard;