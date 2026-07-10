import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { supabase } from '../lib/supabase';
import { Lang } from '../data/translations';

interface DashboardChartsProps {
  userId: string;
  lang?: Lang;
}

const COLORS = ['#6b2737', '#c9a227', '#009e49', '#6b2737', '#CE1126', '#2f6f4e'];

const DashboardCharts = ({ userId, lang = 'fr' }: DashboardChartsProps) => {
  const [balanceHistory, setBalanceHistory] = useState<any[]>([]);
  const [transactionHistory, setTransactionHistory] = useState<any[]>([]);
  const [distribution, setDistribution] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 📝 Traductions
  const texts = {
    fr: {
      balanceEvolution: '📈 Évolution du patrimoine',
      recentTransactions: '📊 Transactions récentes',
      distribution: '🧩 Répartition des fonds',
      balance: 'Solde',
      gains: 'Gains cumulés',
      deposits: 'Dépôts',
      withdrawals: 'Retraits',
      totalInvested: 'Total investi',
      totalReturns: 'Total gains',
      totalWithdrawn: 'Total retiré',
      noData: 'Pas assez de données pour afficher les graphiques',
      day: 'Jour',
      amount: 'Montant',
    },
    en: {
      balanceEvolution: '📈 Portfolio evolution',
      recentTransactions: '📊 Recent transactions',
      distribution: '🧩 Fund distribution',
      balance: 'Balance',
      gains: 'Cumulative gains',
      deposits: 'Deposits',
      withdrawals: 'Withdrawals',
      totalInvested: 'Total invested',
      totalReturns: 'Total gains',
      totalWithdrawn: 'Total withdrawn',
      noData: 'Not enough data to display charts',
      day: 'Day',
      amount: 'Amount',
    },
    es: {
      balanceEvolution: '📈 Evolución del patrimonio',
      recentTransactions: '📊 Transacciones recientes',
      distribution: '🧩 Distribución de fondos',
      balance: 'Saldo',
      gains: 'Ganancias acumuladas',
      deposits: 'Depósitos',
      withdrawals: 'Retiros',
      totalInvested: 'Total invertido',
      totalReturns: 'Total ganancias',
      totalWithdrawn: 'Total retirado',
      noData: 'No hay suficientes datos para mostrar gráficos',
      day: 'Día',
      amount: 'Monto',
    },
  };

  const t = texts[lang] || texts.fr;

  useEffect(() => {
    const fetchChartData = async () => {
      if (!userId) return;
      setLoading(true);

      try {
        // 1️⃣ Récupérer l'utilisateur
        const { data: userData } = await supabase
          .from('users')
          .select('balance, total_returns, created_at')
          .eq('id', userId)
          .single();

        // 2️⃣ Récupérer les transactions des 7 derniers jours
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data: transactions } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', userId)
          .gte('created_at', sevenDaysAgo.toISOString())
          .order('created_at', { ascending: true });

        // 3️⃣ Préparer les données pour l'évolution du solde
        const balanceData = [];
        let runningBalance = userData?.balance || 0;
        let runningReturns = userData?.total_returns || 0;

        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-US', {
            weekday: 'short',
            day: 'numeric',
          });

          // Recalculer le solde pour ce jour à partir des transactions
          const dayTransactions = transactions?.filter((t) => {
            const tDate = new Date(t.created_at);
            return tDate.toDateString() === date.toDateString();
          }) || [];

          // Simuler l'évolution du solde
          if (i < 6) {
            const prevDate = new Date();
            prevDate.setDate(prevDate.getDate() - (i + 1));
            const prevBalance = balanceData[balanceData.length - 1]?.balance || 0;
            
            // Appliquer les transactions du jour
            let dayChange = 0;
            dayTransactions.forEach((t) => {
              if (t.transaction_type === 'deposit' && t.status === 'confirmed') {
                dayChange += t.amount;
              }
              if (t.transaction_type === 'withdrawal' && t.status === 'confirmed') {
                dayChange -= t.amount;
              }
            });
            
            // Ajouter le rendement quotidien (8% du solde précédent)
            const dailyGain = prevBalance * 0.08;
            runningBalance = prevBalance + dayChange + dailyGain;
            runningReturns += dailyGain;
          }

          balanceData.push({
            day: dateStr,
            balance: Math.round(runningBalance * 100) / 100,
            gains: Math.round(runningReturns * 100) / 100,
            date: date,
          });
        }

        setBalanceHistory(balanceData);

        // 4️⃣ Préparer les données des transactions récentes
        const transactionData = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-US', {
            weekday: 'short',
            day: 'numeric',
          });

          const dayTransactions = transactions?.filter((t) => {
            const tDate = new Date(t.created_at);
            return tDate.toDateString() === date.toDateString();
          }) || [];

          const deposits = dayTransactions
            .filter((t) => t.transaction_type === 'deposit' && t.status === 'confirmed')
            .reduce((sum, t) => sum + t.amount, 0);

          const withdrawals = dayTransactions
            .filter((t) => t.transaction_type === 'withdrawal' && t.status === 'confirmed')
            .reduce((sum, t) => sum + t.amount, 0);

          transactionData.push({
            day: dateStr,
            deposits: Math.round(deposits * 100) / 100,
            withdrawals: Math.round(withdrawals * 100) / 100,
          });
        }

        setTransactionHistory(transactionData);

        // 5️⃣ Préparer les données de répartition
        const totalInvested = transactions
          ?.filter((t) => t.transaction_type === 'deposit' && t.status === 'confirmed')
          .reduce((sum, t) => sum + t.amount, 0) || 0;

        const totalWithdrawn = transactions
          ?.filter((t) => t.transaction_type === 'withdrawal' && t.status === 'confirmed')
          .reduce((sum, t) => sum + t.amount, 0) || 0;

        const totalReturns = userData?.total_returns || 0;

        setDistribution([
          { name: t.totalInvested, value: Math.round(totalInvested * 100) / 100, color: COLORS[0] },
          { name: t.totalReturns, value: Math.round(totalReturns * 100) / 100, color: COLORS[1] },
          { name: t.totalWithdrawn, value: Math.round(totalWithdrawn * 100) / 100, color: COLORS[2] },
        ]);

      } catch (error) {
        console.error('❌ Erreur chargement graphiques:', error);
      }

      setLoading(false);
    };

    fetchChartData();
  }, [userId, lang]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <p className="text-gray-400 text-sm text-center">Chargement des graphiques...</p>
      </div>
    );
  }

  // Vérifier si on a assez de données
  const hasData = balanceHistory.some(d => d.balance > 0) || 
                  transactionHistory.some(d => d.deposits > 0 || d.withdrawals > 0);

  if (!hasData) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <p className="text-gray-400 text-sm text-center">{t.noData}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 📈 Graphique 1 : Évolution du patrimoine */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">{t.balanceEvolution}</h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={balanceHistory}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6b2737" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6b2737" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gainsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c9a227" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#c9a227" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} />
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                fontSize: '12px',
              }}
              formatter={(value: number) => value.toFixed(2)}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#6b2737"
              strokeWidth={2}
              fill="url(#balanceGradient)"
              name={t.balance}
            />
            <Area
              type="monotone"
              dataKey="gains"
              stroke="#c9a227"
              strokeWidth={2}
              fill="url(#gainsGradient)"
              name={t.gains}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 📊 Graphique 2 : Transactions récentes - Dépôts en vert, Retraits en rouge */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">{t.recentTransactions}</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={transactionHistory}>
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} />
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                fontSize: '12px',
              }}
              formatter={(value: number) => value.toFixed(2)}
            />
            <Legend />
            <Bar dataKey="deposits" fill="#22c55e" name={t.deposits} radius={[4, 4, 0, 0]} />
            <Bar dataKey="withdrawals" fill="#ef4444" name={t.withdrawals} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🧩 Graphique 3 : Répartition (prend toute la largeur) */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">{t.distribution}</h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={distribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  fontSize: '12px',
                }}
                formatter={(value: number) => value.toFixed(2)}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2">
            {distribution.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-600">{item.name}</span>
                <span className="text-sm font-semibold text-gray-800">{item.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;