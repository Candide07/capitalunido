import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lang } from '../data/translations';

interface RegisterProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
  lang?: Lang;
}

const Register = ({ onClose, onSwitchToLogin, lang = 'fr' }: RegisterProps) => {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const texts = {
    fr: {
      title: '📝 Inscription',
      subtitle: 'Créez votre compte CapitalUnido',
      fullName: 'Nom complet',
      phone: 'Téléphone',
      email: 'Email',
      password: 'Mot de passe (min 6 caractères)',
      confirmPassword: 'Confirmer le mot de passe',
      register: '🚀 Créer mon compte',
      loading: '⏳ Inscription...',
      haveAccount: 'Déjà un compte ?',
      signIn: 'Se connecter',
      secure: '🔒 Vos données sont sécurisées • Un email de confirmation vous sera envoyé',
      success: '✅ Inscription réussie ! Vous pouvez maintenant vous connecter.',
      error: '❌ Erreur lors de l\'inscription',
      passwordMismatch: 'Les mots de passe ne correspondent pas',
      back: '← Retour à l\'accueil',
      close: '✕',
    },
    en: {
      title: '📝 Sign Up',
      subtitle: 'Create your CapitalUnido account',
      fullName: 'Full name',
      phone: 'Phone',
      email: 'Email',
      password: 'Password (min 6 characters)',
      confirmPassword: 'Confirm password',
      register: '🚀 Create my account',
      loading: '⏳ Signing up...',
      haveAccount: 'Already have an account?',
      signIn: 'Log in',
      secure: '🔒 Your data is secure • A confirmation email will be sent to you',
      success: '✅ Registration successful! You can now log in.',
      error: '❌ Error during registration',
      passwordMismatch: 'Passwords do not match',
      back: '← Back to home',
      close: '✕',
    },
    es: {
      title: '📝 Registro',
      subtitle: 'Crea tu cuenta CapitalUnido',
      fullName: 'Nombre completo',
      phone: 'Teléfono',
      email: 'Correo electrónico',
      password: 'Contraseña (mín 6 caracteres)',
      confirmPassword: 'Confirmar contraseña',
      register: '🚀 Crear mi cuenta',
      loading: '⏳ Registrando...',
      haveAccount: '¿Ya tienes cuenta?',
      signIn: 'Iniciar sesión',
      secure: '🔒 Tus datos están seguros • Recibirás un email de confirmación',
      success: '✅ ¡Registro exitoso! Ya puedes iniciar sesión.',
      error: '❌ Error durante el registro',
      passwordMismatch: 'Las contraseñas no coinciden',
      back: '← Volver al inicio',
      close: '✕',
    },
  };

  const t = texts[lang] || texts.fr;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await signUp(email, password, fullName, phone);

    if (error) {
      console.error('Erreur inscription:', error);
      setError(t.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // Rediriger vers la page de connexion après 2 secondes
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f0eb] via-[#faf6f0] to-[#f5f0eb] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-2xl">
        <button onClick={onClose} className="float-right text-gray-400 hover:text-gray-600 text-xl">
          {t.close}
        </button>

        <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1">
          {t.back}
        </button>

        <h2 className="text-3xl font-black text-center mb-2 text-gray-900">{t.title}</h2>
        <p className="text-center text-gray-500 mb-8">{t.subtitle}</p>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-4">
            {t.success}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder={t.fullName}
              className="w-full p-4 bg-gray-50 rounded-2xl text-gray-800 placeholder-gray-400 border-2 border-gray-200 focus:border-[#D91023] outline-none"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div>
            <input
              type="tel"
              placeholder={t.phone}
              className="w-full p-4 bg-gray-50 rounded-2xl text-gray-800 placeholder-gray-400 border-2 border-gray-200 focus:border-[#D91023] outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div>
            <input
              type="email"
              placeholder={t.email}
              className="w-full p-4 bg-gray-50 rounded-2xl text-gray-800 placeholder-gray-400 border-2 border-gray-200 focus:border-[#D91023] outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder={t.password}
              className="w-full p-4 bg-gray-50 rounded-2xl text-gray-800 placeholder-gray-400 border-2 border-gray-200 focus:border-[#D91023] outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder={t.confirmPassword}
              className="w-full p-4 bg-gray-50 rounded-2xl text-gray-800 placeholder-gray-400 border-2 border-gray-200 focus:border-[#D91023] outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D91023] hover:bg-[#D91023]/80 text-white font-bold py-4 rounded-2xl disabled:opacity-50 transition-all"
          >
            {loading ? t.loading : t.register}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-500">
            {t.haveAccount}{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-[#D91023] font-semibold hover:underline"
            >
              {t.signIn}
            </button>
          </p>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">{t.secure}</p>
      </div>
    </div>
  );
};

export default Register;