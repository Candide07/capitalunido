import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lang } from '../data/translations';

interface RegisterProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
  lang?: Lang;
  referralCode?: string;
}

const Register = ({ 
  onClose, 
  onSwitchToLogin, 
  lang = 'fr',
  referralCode
}: RegisterProps) => {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [referralInput, setReferralInput] = useState(''); // 👈 NOUVEAU
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ phone?: string; email?: string }>({});

  // 👈 Validation stricte : évite les numéros/emails mal saisis ou incomplets
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE_REGEX = /^\+?[0-9\s-]{8,15}$/;

  const validatePhone = (value: string) => PHONE_REGEX.test(value.trim());
  const validateEmail = (value: string) => EMAIL_REGEX.test(value.trim());

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
      phoneInvalid: 'Numéro invalide (ex: +51 9XX XXX XXX)',
      emailInvalid: 'Email invalide (ex: nom@domaine.com)',
      back: '← Retour à l\'accueil',
      close: '✕',
      referralPlaceholder: 'Code de parrainage (optionnel)',
      referralInfo: 'Si vous avez un code, saisissez-le ici pour bénéficier d\'avantages',
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
      phoneInvalid: 'Invalid number (ex: +51 9XX XXX XXX)',
      emailInvalid: 'Invalid email (ex: name@domain.com)',
      back: '← Back to home',
      close: '✕',
      referralPlaceholder: 'Referral code (optional)',
      referralInfo: 'If you have a code, enter it here to get benefits',
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
      phoneInvalid: 'Número inválido (ej: +51 9XX XXX XXX)',
      emailInvalid: 'Email inválido (ej: nombre@dominio.com)',
      back: '← Volver al inicio',
      close: '✕',
      referralPlaceholder: 'Código de referido (opcional)',
      referralInfo: 'Si tienes un código, ingrésalo aquí para obtener beneficios',
    },
  };

  const t = texts[lang] || texts.fr;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    const newFieldErrors: { phone?: string; email?: string } = {};
    if (!validatePhone(cleanPhone)) {
      newFieldErrors.phone = t.phoneInvalid;
    }
    if (!validateEmail(cleanEmail)) {
      newFieldErrors.email = t.emailInvalid;
    }
    setFieldErrors(newFieldErrors);

    if (Object.keys(newFieldErrors).length > 0) {
      return; // 👈 On bloque l'envoi tant que phone/email ne sont pas valides
    }

    if (password !== confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }

    setLoading(true);
    setError(null);

    // 👈 Si l'utilisateur a saisi un code, il prime sur le code de l'URL
    const finalReferralCode = referralInput || referralCode;

    const { error } = await signUp(cleanEmail, password, fullName.trim(), cleanPhone, finalReferralCode);

    if (error) {
      console.error('Erreur inscription:', error);
      setError(t.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f4ef] flex items-center justify-center p-3 sm:p-4 relative">
      {/* Fond amélioré */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-subtle" />
        <div className="absolute inset-0 bg-pattern-dots" />
      </div>

      <div className="max-w-md w-full bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl animate-fadeIn">
        {/* Boutons */}
        <div className="flex justify-between items-start mb-4">
          <button 
            onClick={onClose} 
            className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1"
          >
            <span className="hidden xs:inline">{t.back}</span>
            <span className="xs:hidden">←</span>
          </button>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            {t.close}
          </button>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-center mb-1 sm:mb-2 text-[#1c2321] font-display">{t.title}</h2>
        <p className="text-center text-gray-500 text-sm sm:text-base mb-6 sm:mb-8">{t.subtitle}</p>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl mb-3 sm:mb-4 text-sm sm:text-base">
            {t.success}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl mb-3 sm:mb-4 text-sm sm:text-base">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <input
              type="text"
              placeholder={t.fullName}
              className="w-full p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl text-gray-800 placeholder-gray-400 border-2 border-gray-200 focus:border-[#6b2737] outline-none transition-all text-sm sm:text-base"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div>
            <input
              type="tel"
              placeholder={t.phone}
              className={`w-full p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl text-gray-800 placeholder-gray-400 border-2 ${fieldErrors.phone ? 'border-red-500' : 'border-gray-200'} focus:border-[#6b2737] outline-none transition-all text-sm sm:text-base`}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={() => setFieldErrors((prev) => ({ ...prev, phone: phone.trim() && !validatePhone(phone) ? t.phoneInvalid : undefined }))}
              required
            />
            {fieldErrors.phone && <p className="text-red-500 text-xs sm:text-sm mt-1.5">⚠️ {fieldErrors.phone}</p>}
          </div>

          <div>
            <input
              type="email"
              placeholder={t.email}
              className={`w-full p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl text-gray-800 placeholder-gray-400 border-2 ${fieldErrors.email ? 'border-red-500' : 'border-gray-200'} focus:border-[#6b2737] outline-none transition-all text-sm sm:text-base`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setFieldErrors((prev) => ({ ...prev, email: email.trim() && !validateEmail(email) ? t.emailInvalid : undefined }))}
              required
            />
            {fieldErrors.email && <p className="text-red-500 text-xs sm:text-sm mt-1.5">⚠️ {fieldErrors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder={t.password}
              className="w-full p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl text-gray-800 placeholder-gray-400 border-2 border-gray-200 focus:border-[#6b2737] outline-none transition-all text-sm sm:text-base"
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
              className="w-full p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl text-gray-800 placeholder-gray-400 border-2 border-gray-200 focus:border-[#6b2737] outline-none transition-all text-sm sm:text-base"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* 👈 NOUVEAU CHAMP : Code de parrainage */}
          <div>
            <input
              type="text"
              placeholder={t.referralPlaceholder}
              className="w-full p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl text-gray-800 placeholder-gray-400 border-2 border-gray-200 focus:border-[#6b2737] outline-none transition-all text-sm sm:text-base uppercase"
              value={referralInput}
              onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
              maxLength={10}
            />
            <p className="text-xs text-gray-400 mt-1">
              {t.referralInfo}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6b2737] hover:bg-[#6b2737]/80 text-white font-bold py-3 sm:py-4 rounded-xl sm:rounded-2xl disabled:opacity-50 transition-all text-sm sm:text-base shadow-lg hover:shadow-xl"
          >
            {loading ? t.loading : t.register}
          </button>
        </form>

        <div className="text-center mt-4 sm:mt-6">
          <p className="text-gray-500 text-sm sm:text-base">
            {t.haveAccount}{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-[#6b2737] font-semibold hover:underline"
            >
              {t.signIn}
            </button>
          </p>
        </div>

        <p className="text-center text-gray-400 text-[10px] sm:text-xs mt-4 sm:mt-6 flex items-center justify-center gap-2">
          <span>🔒</span> {t.secure}
        </p>
      </div>
    </div>
  );
};

export default Register;