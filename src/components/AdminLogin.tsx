import { useState } from 'react';

interface AdminLoginProps {
  onLogin: () => void;
  onClose: () => void;
}

const AdminLogin = ({ onLogin, onClose }: AdminLoginProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
    
    setTimeout(() => {
      if (password === adminPassword) {
        setError(false);
        setLoading(false);
        onLogin();
      } else {
        setError(true);
        setLoading(false);
        setPassword('');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f0eb] via-[#faf6f0] to-[#f5f0eb] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-2xl">
        <button onClick={onClose} className="float-right text-gray-400 hover:text-gray-600 text-xl">
          ✕
        </button>

        <div className="text-center mb-8">
          <div className="text-5xl mb-4">⚙️</div>
          <h2 className="text-3xl font-black text-gray-900">Accès Administrateur</h2>
          <p className="text-gray-500 mt-2">Entrez le mot de passe pour accéder au back-office</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Mot de passe administrateur"
              className={`w-full p-4 bg-gray-50 rounded-2xl text-gray-800 placeholder-gray-400 border-2 ${
                error ? 'border-red-500' : 'border-gray-200'
              } focus:border-[#6b2737] outline-none transition-all`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              disabled={loading}
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">❌ Mot de passe incorrect</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6b2737] hover:bg-[#6b2737]/80 text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-50"
          >
            {loading ? '⏳ Vérification...' : '🔓 Accéder à l\'administration'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-xs mt-6">
          🔒 Accès sécurisé • Contactez le support en cas de problème
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;