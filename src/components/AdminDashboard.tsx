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
  admin_notes?: string;
  users?: {
    full_name: string;
    email: string;
    phone: string;
  };
}

interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  balance: number;
  total_returns: number;
  created_at: string;
  referred_by: string | null;
}

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard = ({ onClose }: AdminDashboardProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // États pour le crédit manuel
  const [selectedUserForCredit, setSelectedUserForCredit] = useState<User | null>(null);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [creditAmount, setCreditAmount] = useState('');
  const [creditReason, setCreditReason] = useState('');
  const [creditLoading, setCreditLoading] = useState(false);
  
  // États pour la suppression
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // États pour les onglets
  const [activeTab, setActiveTab] = useState<'transactions' | 'users'>('transactions');

  // 🔍 Recherche
  const [searchTerm, setSearchTerm] = useState('');

  // 📊 Statistiques
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    pendingCount: 0,
  });

  // 👈 FETCH USERS - Récupère depuis la table users avec les soldes
  const fetchUsers = async () => {
    try {
      console.log('📤 Récupération des utilisateurs...');
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erreur fetch users:', error);
        return;
      }

      console.log(`✅ ${data?.length || 0} utilisateurs récupérés`);
      console.log('📊 Données:', data);

      if (data && data.length > 0) {
        setUsers(data);
        setStats(prev => ({ ...prev, totalUsers: data.length }));
      } else {
        console.warn('⚠️ Aucun utilisateur trouvé dans la table users');
        setUsers([]);
        setStats(prev => ({ ...prev, totalUsers: 0 }));
      }
    } catch (err) {
      console.error('❌ Erreur fetchUsers:', err);
    }
  };

  // 👈 FETCH TRANSACTIONS
  const fetchTransactions = async () => {
    setLoading(true);
    
    const { data: txData, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (txError) {
      console.error('Erreur transactions:', txError);
      setLoading(false);
      return;
    }

    if (!txData || txData.length === 0) {
      setTransactions([]);
      setStats(prev => ({ ...prev, pendingCount: 0 }));
      setLoading(false);
      return;
    }

    const { data: userData } = await supabase
      .from('users')
      .select('id, email, full_name, phone');

    const transactionsWithUsers = txData.map(tx => {
      const user = userData?.find(u => u.id === tx.user_id);
      return {
        ...tx,
        users: {
          full_name: user?.full_name || 'Utilisateur inconnu',
          email: user?.email || 'Email inconnu',
          phone: user?.phone || ''
        }
      };
    });

    setTransactions(transactionsWithUsers);
    
    const deposits = txData.filter(t => t.status === 'confirmed' && t.transaction_type === 'deposit') || [];
    const withdrawals = txData.filter(t => t.status === 'confirmed' && t.transaction_type === 'withdrawal') || [];
    const pending = txData.filter(t => t.status === 'pending') || [];
    
    setStats(prev => ({
      ...prev,
      totalDeposits: deposits.reduce((sum, t) => sum + t.amount, 0),
      totalWithdrawals: withdrawals.reduce((sum, t) => sum + t.amount, 0),
      pendingCount: pending.length,
    }));
    
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
    fetchUsers();
  }, []);

  // ✅ Valider une transaction
  const handleConfirm = async (transaction: Transaction) => {
    const typeLabel = transaction.transaction_type === 'deposit' ? 'dépôt' : 'retrait';
    if (!confirm(`Confirmer le ${typeLabel} de ${transaction.amount} pour ${transaction.users?.full_name || 'Utilisateur inconnu'} ?`)) return;

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
    fetchUsers();
  };

  // ❌ Refuser une transaction
  const handleReject = async (transaction: Transaction) => {
    const typeLabel = transaction.transaction_type === 'deposit' ? 'dépôt' : 'retrait';
    if (!confirm(`Refuser le ${typeLabel} de ${transaction.amount} pour ${transaction.users?.full_name || 'Utilisateur inconnu'} ?`)) return;

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
    fetchUsers();
  };

  // 💰 Créditer un utilisateur manuellement
  const handleCreditUser = async () => {
    if (!selectedUserForCredit) return;
    
    const amount = parseFloat(creditAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Montant invalide');
      return;
    }

    setCreditLoading(true);
    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          balance: (selectedUserForCredit.balance || 0) + amount 
        })
        .eq('id', selectedUserForCredit.id);

      if (updateError) throw updateError;

      const reference = `ADMIN-CREDIT-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      
      const { error: txError } = await supabase
        .from('transactions')
        .insert([{
          user_id: selectedUserForCredit.id,
          amount: amount,
          status: 'confirmed',
          reference: reference,
          payment_method: 'admin_credit',
          transaction_type: 'deposit',
          admin_notes: creditReason || 'Crédit manuel depuis l\'admin'
        }]);

      if (txError) throw txError;

      await fetchUsers();
      await fetchTransactions();
      
      setShowCreditModal(false);
      setSelectedUserForCredit(null);
      setCreditAmount('');
      setCreditReason('');

      alert(`✅ ${amount} crédités avec succès à ${selectedUserForCredit.full_name || selectedUserForCredit.email}`);

    } catch (error) {
      console.error('Erreur crédit:', error);
      alert('❌ Erreur lors du crédit');
    }
    setCreditLoading(false);
  };

  // 🗑️ Supprimer un utilisateur
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    if (!confirm(`⚠️ Êtes-vous sûr de vouloir supprimer définitivement ${userToDelete.full_name || userToDelete.email} ?\n\nToutes ses données seront perdues.`)) {
      setShowDeleteModal(false);
      setUserToDelete(null);
      return;
    }

    setDeleteLoading(true);
    try {
      await supabase.from('transactions').delete().eq('user_id', userToDelete.id);
      await supabase.from('referrals').delete().or(`referrer_id.eq.${userToDelete.id},referred_id.eq.${userToDelete.id}`);
      await supabase.from('commissions').delete().eq('user_id', userToDelete.id);
      await supabase.from('affiliate_codes').delete().eq('user_id', userToDelete.id);
      await supabase.from('notifications').delete().eq('user_id', userToDelete.id);
      
      const { error: profileError } = await supabase
        .from('users')
        .delete()
        .eq('id', userToDelete.id);
      
      if (profileError) {
        console.error('Erreur suppression profil:', profileError);
      }

      await fetchUsers();
      await fetchTransactions();
      
      setShowDeleteModal(false);
      setUserToDelete(null);
      
      alert(`✅ ${userToDelete.full_name || userToDelete.email} a été supprimé de la base.\n\n⚠️ Pour supprimer définitivement son compte, allez dans Supabase → Authentication → Users → Delete.`);

    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('❌ Erreur lors de la suppression');
    }
    setDeleteLoading(false);
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

  const filteredUsers = users.filter(u =>
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5f0eb] via-[#faf6f0] to-[#f5f0eb] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#6b2737] border-t-transparent rounded-full animate-spin mx-auto"></div>
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
              <p className="text-gray-500">Gestion des utilisateurs et des transactions</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold text-sm">
                ⏳ {pendingTransactions.length} en attente
              </span>
              <button
                onClick={() => { window.location.href = '/'; }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-4 py-2 rounded-full transition-all text-sm"
              >
                ← Retour au site
              </button>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 md:p-6 shadow-2xl border border-[#e4ded3]">
            <p className="text-gray-500 text-xs md:text-sm">👥 Utilisateurs</p>
            <p className="text-xl md:text-2xl font-black text-gray-900">{stats.totalUsers}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 md:p-6 shadow-2xl border border-green-200">
            <p className="text-gray-500 text-xs md:text-sm">📊 Total dépôts</p>
            <p className="text-xl md:text-2xl font-black text-green-600">{stats.totalDeposits.toFixed(2)}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 md:p-6 shadow-2xl border border-red-200">
            <p className="text-gray-500 text-xs md:text-sm">💸 Total retraits</p>
            <p className="text-xl md:text-2xl font-black text-red-600">{stats.totalWithdrawals.toFixed(2)}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 md:p-6 shadow-2xl border border-yellow-200">
            <p className="text-gray-500 text-xs md:text-sm">⏳ En attente</p>
            <p className="text-xl md:text-2xl font-black text-yellow-600">{stats.pendingCount}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 md:p-6 shadow-2xl border border-purple-200">
            <p className="text-gray-500 text-xs md:text-sm">📋 Total TX</p>
            <p className="text-xl md:text-2xl font-black text-purple-600">{transactions.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 mb-6 bg-white/80 backdrop-blur-xl rounded-t-3xl px-6 pt-4 shadow-2xl">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 font-medium transition-all ${
              activeTab === 'transactions'
                ? 'text-[#6b2737] border-b-2 border-[#6b2737]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📋 Transactions
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-medium transition-all ${
              activeTab === 'users'
                ? 'text-[#6b2737] border-b-2 border-[#6b2737]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            👥 Utilisateurs
          </button>
        </div>

        {/* Onglet Transactions */}
        {activeTab === 'transactions' && (
          <div className="bg-white/80 backdrop-blur-xl rounded-b-3xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Toutes les transactions</h2>
            
            {transactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucune transaction</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
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
                        <td className="py-3 text-gray-800 font-mono text-xs">{transaction.reference}</td>
                        <td className={`py-3 text-xs font-semibold ${getTypeColor(transaction.transaction_type)}`}>
                          {getTypeLabel(transaction.transaction_type)}
                        </td>
                        <td className="py-3">
                          <div className="text-gray-800 font-semibold text-sm">{transaction.users?.full_name || 'Utilisateur inconnu'}</div>
                          <div className="text-gray-500 text-xs">{transaction.users?.email || 'Email inconnu'}</div>
                        </td>
                        <td className="py-3 text-gray-800 font-bold">{transaction.amount.toFixed(2)}</td>
                        <td className="py-3 text-gray-600 text-xs">{transaction.payment_method}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusBadge(transaction.status)}`}>
                            {getStatusText(transaction.status)}
                          </span>
                        </td>
                        <td className="py-3">
                          {transaction.status === 'pending' && (
                            <div className="flex gap-2 flex-wrap">
                              <button
                                onClick={() => handleConfirm(transaction)}
                                disabled={actionLoading && selectedTransaction?.id === transaction.id}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold transition-all disabled:opacity-50"
                              >
                                ✅ Valider
                              </button>
                              <button
                                onClick={() => handleReject(transaction)}
                                disabled={actionLoading && selectedTransaction?.id === transaction.id}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold transition-all disabled:opacity-50"
                              >
                                ❌ Refuser
                              </button>
                            </div>
                          )}
                          {transaction.status !== 'pending' && (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Onglet Utilisateurs */}
        {activeTab === 'users' && (
          <div className="bg-white/80 backdrop-blur-xl rounded-b-3xl p-6 shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-900">👥 Utilisateurs</h2>
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#6b2737] focus:ring-2 focus:ring-[#6b2737]/20 transition outline-none bg-white/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {filteredUsers.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucun utilisateur trouvé</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-gray-500 font-semibold">Nom</th>
                      <th className="text-left py-3 text-gray-500 font-semibold">Email</th>
                      <th className="text-left py-3 text-gray-500 font-semibold">Solde</th>
                      <th className="text-left py-3 text-gray-500 font-semibold">Gains</th>
                      <th className="text-left py-3 text-gray-500 font-semibold">Parrain</th>
                      <th className="text-left py-3 text-gray-500 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-all">
                        <td className="py-3 font-semibold text-gray-800">{user.full_name || '—'}</td>
                        <td className="py-3 text-gray-600 text-sm">{user.email}</td>
                        <td className="py-3 font-bold text-[#6b2737] font-mono-data">{user.balance?.toFixed(2) || '0.00'}</td>
                        <td className="py-3 font-bold text-green-600">{user.total_returns?.toFixed(2) || '0.00'}</td>
                        <td className="py-3 text-gray-500 text-xs">{user.referred_by ? '✅ Oui' : '—'}</td>
                        <td className="py-3">
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => {
                                setSelectedUserForCredit(user);
                                setShowCreditModal(true);
                              }}
                              className="bg-[#6b2737] hover:bg-[#4e1d29] text-white px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                            >
                              💰 Créditer
                            </button>
                            <button
                              onClick={() => {
                                setUserToDelete(user);
                                setShowDeleteModal(true);
                              }}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                            >
                              🗑️ Supprimer
                            </button>
                          </div>
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

      {/* Modal de crédit */}
      {showCreditModal && selectedUserForCredit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-800 mb-4">💰 Créditer un utilisateur</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Utilisateur</p>
                <p className="font-medium text-gray-800">{selectedUserForCredit.full_name || selectedUserForCredit.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Solde actuel</p>
                <p className="font-bold text-[#6b2737] font-mono-data">{selectedUserForCredit.balance?.toFixed(2) || '0.00'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant à créditer *
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Ex: 100.00"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#6b2737] focus:ring-2 focus:ring-[#6b2737]/20 transition outline-none"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Raison (optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Bonus, compensation, etc."
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#6b2737] focus:ring-2 focus:ring-[#6b2737]/20 transition outline-none"
                  value={creditReason}
                  onChange={(e) => setCreditReason(e.target.value)}
                />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-700">
                ⚠️ Cette action est irréversible. Vérifiez le montant avant de valider.
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCreditUser}
                disabled={creditLoading || !creditAmount}
                className="flex-1 bg-[#6b2737] hover:bg-[#4e1d29] text-white font-semibold py-2 rounded-xl transition disabled:opacity-50"
              >
                {creditLoading ? '⏳...' : '💰 Créditer'}
              </button>
              <button
                onClick={() => {
                  setShowCreditModal(false);
                  setSelectedUserForCredit(null);
                  setCreditAmount('');
                  setCreditReason('');
                }}
                className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 rounded-xl transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de suppression */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fadeIn">
            <h3 className="text-lg font-bold text-red-600 mb-4">🗑️ Supprimer un utilisateur</h3>
            
            <div className="space-y-4 mb-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                ⚠️ <span className="font-bold">Action irréversible</span>
                <p className="mt-1">Cette action supprimera définitivement toutes les données de l'utilisateur :</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Profil utilisateur</li>
                  <li>Transactions</li>
                  <li>Parrainages</li>
                  <li>Commissions</li>
                  <li>Code d'affiliation</li>
                  <li>Notifications</li>
                </ul>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Utilisateur à supprimer</p>
                <p className="font-medium text-gray-800 text-lg">{userToDelete.full_name || userToDelete.email}</p>
                <p className="text-sm text-gray-500">{userToDelete.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Solde actuel</p>
                <p className="font-bold text-[#6b2737] font-mono-data">{userToDelete.balance?.toFixed(2) || '0.00'}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDeleteUser}
                disabled={deleteLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-xl transition disabled:opacity-50"
              >
                {deleteLoading ? '⏳ Suppression...' : '🗑️ Supprimer définitivement'}
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 rounded-xl transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;