import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lang } from '../data/translations';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  AlertCircle,
  Shield,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';

interface LoginProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
  lang?: Lang;
  onNavigateToDashboard?: () => void;
}

const Login = ({ 
  onClose, 
  onSwitchToRegister, 
  lang = 'fr',
  onNavigateToDashboard
}: LoginProps) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const texts = {
    fr: {
      title: '🔐 Connexion',
      subtitle: 'Connectez-vous à votre compte',
      email: 'Email',
      emailPlaceholder: 'jean.dupont@email.com',
      password: 'Mot de passe',
      passwordPlaceholder: '••••••••',
      login: '🚀 Se connecter',
      loading: '⏳ Connexion...',
      noAccount: 'Pas encore de compte ?',
      signUp: "S'inscrire",
      secure: '🔒 Connexion sécurisée via Supabase Auth',
      success: '✅ Connexion réussie !',
      error: '❌ Email ou mot de passe incorrect',
      back: '← Retour à l\'accueil',
      rememberMe: 'Se souvenir de moi',
      forgotPassword: 'Mot de passe oublié ?',
    },
    en: {
      title: '🔐 Login',
      subtitle: 'Log in to your account',
      email: 'Email',
      emailPlaceholder: 'john.doe@email.com',
      password: 'Password',
      passwordPlaceholder: '••••••••',
      login: '🚀 Log in',
      loading: '⏳ Logging in...',
      noAccount: "Don't have an account?",
      signUp: 'Sign up',
      secure: '🔒 Secure connection via Supabase Auth',
      success: '✅ Login successful!',
      error: '❌ Incorrect email or password',
      back: '← Back to home',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
    },
    es: {
      title: '🔐 Inicio de sesión',
      subtitle: 'Inicia sesión en tu cuenta',
      email: 'Correo electrónico',
      emailPlaceholder: 'juan.perez@email.com',
      password: 'Contraseña',
      passwordPlaceholder: '••••••••',
      login: '🚀 Iniciar sesión',
      loading: '⏳ Iniciando sesión...',
      noAccount: '¿No tienes cuenta?',
      signUp: 'Registrarse',
      secure: '🔒 Conexión segura mediante Supabase Auth',
      success: '✅ ¡Sesión iniciada!',
      error: '❌ Correo o contraseña incorrectos',
      back: '← Volver al inicio',
      rememberMe: 'Recordarme',
      forgotPassword: '¿Olvidaste tu contraseña?',
    },
  };

  const t = texts[lang] || texts.fr;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await signIn(email, password);

    if (error) {
      setError(t.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        if (onNavigateToDashboard) {
          onNavigateToDashboard();
        }
      }, 1500);
    }
  };

  const handleGoBack = () => {
    onClose();
  };

  return (
    <div className="min-h-screen py-4 sm:py-6 px-3 sm:px-4 lg:px-8 relative flex items-center justify-center">
      {/* Fond amélioré */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-subtle" />
        <div className="absolute inset-0 bg-pattern-dots" />
      </div>

      {/* 👇 Bouton Retour - responsive */}
      <button
        onClick={handleGoBack}
        className="absolute top-3 sm:top-4 md:top-6 left-3 sm:left-4 md:left-6 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 glass-effect rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-gray-700 hover:text-gray-900 z-10 group"
        aria-label="Retour à l'accueil"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="hidden xs:inline font-medium text-sm sm:text-base">Retour à l'accueil</span>
        <span className="xs:hidden font-medium text-sm">Retour</span>
      </button>

      {/* Bouton Fermer - responsive */}
      <button
        onClick={onClose}
        className="absolute top-3 sm:top-4 md:top-6 right-3 sm:right-4 md:right-6 w-8 h-8 sm:w-10 sm:h-10 glass-effect rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 transition z-10 group"
        aria-label="Fermer"
      >
        <span className="text-lg sm:text-xl group-hover:scale-110 transition">✕</span>
      </button>

      <div className="max-w-md w-full px-2 sm:px-0">
        <div className="glass-effect rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl border border-white/50 animate-fadeIn">
          {/* Logo/Icon - responsive */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#6b2737] to-[#4e1d29] rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t.title}</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">{t.subtitle}</p>
          </div>

          {/* Messages - responsive */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-2.5 sm:p-3 mb-3 sm:mb-4 flex items-center gap-2 text-green-700 text-xs sm:text-sm animate-fadeIn">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span>{t.success}</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-2.5 sm:p-3 mb-3 sm:mb-4 flex items-center gap-2 text-red-700 text-xs sm:text-sm animate-fadeIn">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                {t.email}
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder={t.emailPlaceholder}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-11 bg-white/80 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition shadow-sm placeholder-gray-500 text-gray-800 text-sm sm:text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                {t.password}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t.passwordPlaceholder}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-11 pr-9 sm:pr-11 bg-white/80 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition shadow-sm placeholder-gray-500 text-gray-800 text-sm sm:text-base"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-0">
              <label className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#6b2737] rounded border-gray-300 focus:ring-[#6b2737] bg-white/80"
                />
                {t.rememberMe}
              </label>
              <button
                type="button"
                className="text-xs sm:text-sm text-[#6b2737] hover:text-[#4e1d29] hover:underline font-medium"
              >
                {t.forgotPassword}
              </button>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3.5 bg-gradient-to-r from-[#6b2737] to-[#4e1d29] hover:from-[#4e1d29] hover:to-[#3a1620] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t.loading}
                </>
              ) : (
                t.login
              )}
            </button>

            {/* Register link */}
            <p className="text-center text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4">
              {t.noAccount}{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-[#6b2737] hover:text-[#4e1d29] font-semibold hover:underline"
              >
                {t.signUp}
              </button>
            </p>

            {/* Sécurité */}
            <p className="text-center text-gray-400 text-[10px] sm:text-xs mt-4 sm:mt-6 flex items-center justify-center gap-2">
              <span>🔒</span> {t.secure}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;