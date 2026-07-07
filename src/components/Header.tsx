import { Lang } from '../data/translations';
import { CountryCode, countries, BRAND_NAME } from '../data/countries';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentLang: Lang;
  onLangChange: (lang: Lang) => void;
  currentCountry: CountryCode;
  onCountryChange: (country: CountryCode) => void;
  onLoginClick: () => void;
  onDashboardClick?: () => void;
  onRegisterClick?: () => void;
}

const Header = ({ 
  currentLang, 
  onLangChange, 
  currentCountry, 
  onCountryChange,
  onLoginClick,
  onDashboardClick,
  onRegisterClick
}: HeaderProps) => {
  const { user, signOut } = useAuth();

  // 📝 Traductions du header - UNIFIÉES
  const headerTexts = {
    fr: { 
      login: 'Connexion',
      register: "S'inscrire",
      loginShort: 'Se connecter',
      dashboard: 'Tableau de bord', 
      logout: 'Déconnexion',
    },
    en: { 
      login: 'Login',
      register: 'Sign up',
      loginShort: 'Log in',
      dashboard: 'Dashboard', 
      logout: 'Logout',
    },
    es: { 
      login: 'Iniciar sesión',
      register: 'Registrarse',
      loginShort: 'Iniciar sesión',
      dashboard: 'Panel', 
      logout: 'Cerrar sesión',
    },
  };

  const t = headerTexts[currentLang] || headerTexts.fr;

  // Couleurs personnalisées selon le pays
  const getColors = () => {
    switch (currentCountry) {
      case 'pe':
        return {
          logoGradient: 'from-[#D91023] via-[#fcd116] to-[#D91023]',
          iconBg: 'from-[#D91023] via-[#fcd116] to-[#D91023]',
          headerBg: 'from-[rgba(217,16,35,0.98)] via-[rgba(10,15,28,0.98)] to-[rgba(217,16,35,0.98)]',
          borderColor: 'border-[#D91023]/30',
          shadowColor: 'shadow-[#D91023]/50',
          langActive: 'from-[#D91023] to-[#fcd116]',
          langActiveShadow: 'shadow-[#D91023]/50',
          countryActive: 'bg-[#D91023] text-white',
          btnBg: 'bg-[#D91023] hover:bg-[#b8121e]',
          btnBorder: 'border-[#D91023]',
        };
      case 'mx':
        return {
          logoGradient: 'from-[#006341] via-[#CE1126] to-[#006341]',
          iconBg: 'from-[#006341] via-[#CE1126] to-[#006341]',
          headerBg: 'from-[rgba(0,99,65,0.98)] via-[rgba(10,15,28,0.98)] to-[rgba(0,99,65,0.98)]',
          borderColor: 'border-[#006341]/30',
          shadowColor: 'shadow-[#006341]/50',
          langActive: 'from-[#006341] to-[#CE1126]',
          langActiveShadow: 'shadow-[#006341]/50',
          countryActive: 'bg-[#006341] text-white',
          btnBg: 'bg-[#006341] hover:bg-[#004d32]',
          btnBorder: 'border-[#006341]',
        };
      default:
        return {
          logoGradient: 'from-[#fcd116] via-white to-[#fcd116]',
          iconBg: 'from-[#ef2b2d] via-[#fcd116] to-[#009e49]',
          headerBg: 'from-[rgba(26,60,110,0.98)] via-[rgba(10,15,28,0.98)] to-[rgba(26,60,110,0.98)]',
          borderColor: 'border-[#fcd116]/20',
          shadowColor: 'shadow-[#1a3c6e]/50',
          langActive: 'from-[#fcd116] to-[#ef2b2d]',
          langActiveShadow: 'shadow-[#fcd116]/50',
          countryActive: 'bg-white text-[#0a0f1c]',
          btnBg: 'bg-[#1a3c6e] hover:bg-[#152f55]',
          btnBorder: 'border-[#1a3c6e]',
        };
    }
  };

  const colors = getColors();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  const handleRegisterLogin = () => {
    if (user) {
      if (onDashboardClick) {
        onDashboardClick();
      }
    } else {
      if (onRegisterClick) {
        onRegisterClick();
      }
    }
  };

  return (
    <header className={`fixed top-1.5 left-0 right-0 bg-gradient-to-r ${colors.headerBg} backdrop-blur-xl z-[1000] border-b-2 ${colors.borderColor} shadow-lg ${colors.shadowColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap justify-between items-center gap-2">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className={`w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br ${colors.iconBg} rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-lg relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            <span className="relative z-10 filter drop-shadow-lg">💎</span>
          </div>
          <div className={`text-lg sm:text-2xl font-black bg-gradient-to-r ${colors.logoGradient} bg-clip-text text-transparent tracking-tight`}>
            {BRAND_NAME}
          </div>
        </a>

        <div className="flex flex-wrap gap-1 sm:gap-2 items-center">
          {/* Sélecteur pays */}
          <div className="flex gap-1 mr-2">
            {(Object.keys(countries) as CountryCode[]).map((code) => (
              <button
                key={code}
                onClick={() => onCountryChange(code)}
                className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  currentCountry === code
                    ? colors.countryActive + ' shadow-lg scale-105'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                {countries[code].flagEmoji} {countries[code].label}
              </button>
            ))}
          </div>

          {/* Sélecteur langue */}
          <div className="flex gap-1 sm:gap-2">
            {(['fr', 'en', 'es'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => onLangChange(lang)}
                className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-bold transition-all ${
                  currentLang === lang
                    ? `bg-gradient-to-r ${colors.langActive} text-[#0a0f1c] shadow-xl ${colors.langActiveShadow} scale-105`
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                {lang === 'fr' ? '🇫🇷 FR' : lang === 'en' ? '🇬🇧 EN' : '🇪🇸 ES'}
              </button>
            ))}
          </div>

          {/* Bouton "S'inscrire/Se connecter" */}
          {user ? (
            <>
              <button
                onClick={onDashboardClick}
                className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-bold bg-white/20 text-white hover:bg-white/30 border border-white/30 transition-all"
              >
                {t.dashboard}
              </button>
              <button
                onClick={handleSignOut}
                className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-bold bg-red-500/20 text-white hover:bg-red-500/30 border border-red-500/30 transition-all"
              >
                {t.logout}
              </button>
            </>
          ) : (
            <button
              onClick={handleRegisterLogin}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-bold text-white ${colors.btnBg} border-2 ${colors.btnBorder} shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2`}
            >
              <span className="text-base">👤</span>
              <span className="hidden xs:inline">{t.register}</span>
              <span className="hidden xs:inline text-white/50">/</span>
              <span className="hidden sm:inline">{t.loginShort}</span>
              <span className="xs:hidden">{t.register}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;