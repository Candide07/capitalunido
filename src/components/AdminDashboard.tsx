import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Transaction {
  id: number;
  user_id: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'rejected';
  reference: string;
  payment_method: string;
  transaction_type: 'deposit' | 'withdrawal';
  created_at: string;
  users?: {
    full_name: string;
    email: string;
    phone: string;
  };
}

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard = ({ onClose }: AdminDashboardProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        users:user_id (
          full_name,
          email,
          phone
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur:', error);
    } else {
      setTransactions(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // ✅ Valider une transaction (dépôt ou retrait)
  const handleConfirm = async (transaction: Transaction) => {
    const typeLabel = transaction.transaction_type === 'deposit' ? 'dépôt' : 'retrait';
    if (!confirm(`Confirmer le ${typeLabel} de ${transaction.amount} pour ${transaction.users?.full_name} ?`)) return;

    setActionLoading(true);
    setSelectedTransaction(transaction);

    const { error: txError } = await supabase
      .from('transactions')
      .update({ status: 'confirmed' })
      .eq('id', transaction.id);

    if (txError) {
      console.error('Erreur:', txError);
      alert('Erreur lors de la validation');
      setActionLoading(false);
      return;
    }

    // Si c'est un dépôt, ajouter au solde
    if (transaction.transaction_type === 'deposit') {
      const { data: userData } = await supabase
        .from('users')
        .select('balance')
        .eq('id', transaction.user_id)
        .single();

      if (userData) {
        const newBalance = (userData.balance || 0) + transaction.amount;
        await supabase
          .from('users')
          .update({ balance: newBalance })
          .eq('id', transaction.user_id);
      }
    }

    // Si c'est un retrait, retirer du solde
    if (transaction.transaction_type === 'withdrawal') {
      const { data: userData } = await supabase
        .from('users')
        .select('balance, total_withdrawn')
        .eq('id', transaction.user_id)
        .single();

      if (userData) {
        const newBalance = (userData.balance || 0) - transaction.amount;
        const newTotalWithdrawn = (userData.total_withdrawn || 0) + transaction.amount;
        await supabase
          .from('users')
          .update({
            balance: newBalance,
            total_withdrawn: newTotalWithdrawn
          })
          .eq('id', transaction.user_id);
      }
    }

    setActionLoading(false);
    setSelectedTransaction(null);
    fetchTransactions();
  };

  // ❌ Refuser une transaction
  const handleReject = async (transaction: Transaction) => {
    const typeLabel = transaction.transaction_type === 'deposit' ? 'dépôt' : 'retrait';
    if (!confirm(`Refuser le ${typeLabel} de ${transaction.amount} pour ${transaction.users?.full_name} ?`)) return;

    setActionLoading(true);
    setSelectedTransaction(transaction);

    const { error } = await supabase
      .from('transactions')
      .update({ status: 'rejected' })
      .eq('id', transaction.id);

    if (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du rejet');
    }

    setActionLoading(false);
    setSelectedTransaction(null);
    fetchTransactions();
  };

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
      case 'pending': return '⏳ En attente';
      case 'confirmed': return '✅ Confirmé';
      case 'rejected': return '❌ Rejeté';
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    if (type === 'deposit') return '📥 Dépôt';
    if (type === 'withdrawal') return '📤 Retrait';
    return type;
  };

  const getTypeColor = (type: string) => {
    if (type === 'deposit') return 'text-green-600';
    if (type === 'withdrawal') return 'text-red-600';
    return 'text-gray-600';
  };

  const pendingTransactions = transactions.filter(t => t.status === 'pending');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5f0eb] via-[#faf6f0] to-[#f5f0eb] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#D91023] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f0eb] via-[#faf6f0] to-[#f5f0eb] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900">⚙️ Administration</h1>
              <p className="text-gray-500">Gestion des dépôts et des retraits</p>
            </div>
            <div className="flex gap-2">
              <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold">
                ⏳ {pendingTransactions.length} en attente
              </span>
              <button
                onClick={() => { window.location.href = '/'; }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-4 py-2 rounded-full transition-all"
              >
                ← Retour au site
              </button>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-blue-200">
            <p className="text-gray-500 text-sm">📊 Total dépôts</p>
            <p className="text-2xl font-black text-gray-900">
              {transactions
                .filter(t => t.status === 'confirmed' && t.transaction_type === 'deposit')
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(2)}
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-red-200">
            <p className="text-gray-500 text-sm">💸 Total retraits</p>
            <p className="text-2xl font-black text-gray-900">
              {transactions
                .filter(t => t.status === 'confirmed' && t.transaction_type === 'withdrawal')
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(2)}
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-yellow-200">
            <p className="text-gray-500 text-sm">⏳ En attente</p>
            <p className="text-2xl font-black text-yellow-600">
              {pendingTransactions.length}
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-green-200">
            <p className="text-gray-500 text-sm">✅ Confirmés</p>
            <p className="text-2xl font-black text-green-600">
              {transactions.filter(t => t.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-red-200">
            <p className="text-gray-500 text-sm">❌ Rejetés</p>
            <p className="text-2xl font-black text-red-600">
              {transactions.filter(t => t.status === 'rejected').length}
            </p>
          </div>
        </div>

        {/* Liste des transactions */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Toutes les transactions</h2>
          
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucune transaction</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-gray-500 font-semibold">Référence</th>
                    <th className="text-left py-3 text-gray-500 font-semibold">Type</th>
                    <th className="text-left py-3 text-gray-500 font-semibold">Utilisateur</th>
                    <th className="text-left py-3 text-gray-500 font-semibold">Montant</th>
                    <th className="text-left py-3 text-gray-500 font-semibold">Méthode</th>
                    <th className="text-left py-3 text-gray-500 font-semibold">Statut</th>
                    <th className="text-left py-3 text-gray-500 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 transition-all">
                      <td className="py-3 text-gray-800 font-mono text-sm">{transaction.reference}</td>
                      <td className={`py-3 text-sm font-semibold ${getTypeColor(transaction.transaction_type)}`}>
                        {getTypeLabel(transaction.transaction_type)}
                      </td>
                      <td className="py-3">
                        <div className="text-gray-800 font-semibold">{transaction.users?.full_name}</div>
                        <div className="text-gray-500 text-xs">{transaction.users?.email}</div>
                      </td>
                      <td className="py-3 text-gray-800 font-bold">{transaction.amount.toFixed(2)}</td>
                      <td className="py-3 text-gray-600 text-sm">{transaction.payment_method}</td>
                      <td className="py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(transaction.status)}`}>
                          {getStatusText(transaction.status)}
                        </span>
                      </td>
                      <td className="py-3">
                        {transaction.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleConfirm(transaction)}
                              disabled={actionLoading && selectedTransaction?.id === transaction.id}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-full text-sm font-bold transition-all disabled:opacity-50"
                            >
                              ✅ Valider
                            </button>
                            <button
                              onClick={() => handleReject(transaction)}
                              disabled={actionLoading && selectedTransaction?.id === transaction.id}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold transition-all disabled:opacity-50"
                            >
                              ❌ Refuser
                            </button>
                          </div>
                        )}
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

export default AdminDashboard;