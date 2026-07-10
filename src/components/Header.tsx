import { Lang } from '../data/translations';
import { CountryCode, countries, BRAND_NAME } from '../data/countries';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          logoGradient: 'from-[#6b2737] via-[#c9a227] to-[#6b2737]',
          iconBg: 'from-[#6b2737] via-[#c9a227] to-[#6b2737]',
          headerBg: 'from-[rgba(217,16,35,0.98)] via-[rgba(10,15,28,0.98)] to-[rgba(217,16,35,0.98)]',
          borderColor: 'border-[#6b2737]/30',
          shadowColor: 'shadow-[#6b2737]/50',
          langActive: 'from-[#6b2737] to-[#c9a227]',
          langActiveShadow: 'shadow-[#6b2737]/50',
          countryActive: 'bg-[#6b2737] text-white',
          btnBg: 'bg-[#6b2737] hover:bg-[#4e1d29]',
          btnBorder: 'border-[#6b2737]',
          mobileBg: 'bg-[#6b2737]/95',
        };
      case 'mx':
        return {
          logoGradient: 'from-[#2f6f4e] via-[#CE1126] to-[#2f6f4e]',
          iconBg: 'from-[#2f6f4e] via-[#CE1126] to-[#2f6f4e]',
          headerBg: 'from-[rgba(0,99,65,0.98)] via-[rgba(10,15,28,0.98)] to-[rgba(0,99,65,0.98)]',
          borderColor: 'border-[#2f6f4e]/30',
          shadowColor: 'shadow-[#2f6f4e]/50',
          langActive: 'from-[#2f6f4e] to-[#CE1126]',
          langActiveShadow: 'shadow-[#2f6f4e]/50',
          countryActive: 'bg-[#2f6f4e] text-white',
          btnBg: 'bg-[#2f6f4e] hover:bg-[#004d32]',
          btnBorder: 'border-[#2f6f4e]',
          mobileBg: 'bg-[#2f6f4e]/95',
        };
      default:
        return {
          logoGradient: 'from-[#c9a227] via-white to-[#c9a227]',
          iconBg: 'from-[#ef2b2d] via-[#c9a227] to-[#009e49]',
          headerBg: 'from-[rgba(26,60,110,0.98)] via-[rgba(10,15,28,0.98)] to-[rgba(26,60,110,0.98)]',
          borderColor: 'border-[#c9a227]/20',
          shadowColor: 'shadow-[#6b2737]/50',
          langActive: 'from-[#c9a227] to-[#ef2b2d]',
          langActiveShadow: 'shadow-[#c9a227]/50',
          countryActive: 'bg-white text-[#0a0f1c]',
          btnBg: 'bg-[#6b2737] hover:bg-[#4e1d29]',
          btnBorder: 'border-[#6b2737]',
          mobileBg: 'bg-[#6b2737]/95',
        };
    }
  };

  const colors = getColors();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  // 👈 MODIFICATION ICI : Redirige vers Login (connexion) au lieu de Register
  const handleRegisterLogin = () => {
    if (user) {
      if (onDashboardClick) {
        onDashboardClick();
      }
    } else {
      // 👈 Maintenant on va vers Login (page de connexion)
      if (onLoginClick) {
        onLoginClick();
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className={`fixed top-1.5 left-0 right-0 bg-gradient-to-r ${colors.headerBg} backdrop-blur-xl z-[1000] border-b-2 ${colors.borderColor} shadow-lg ${colors.shadowColor}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-2 sm:py-3 flex flex-wrap justify-between items-center gap-2">
          
          {/* Logo - responsive */}
          <a href="/" className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <div className={`w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11 bg-gradient-to-br ${colors.iconBg} rounded-xl sm:rounded-2xl flex items-center justify-center text-sm sm:text-xl lg:text-2xl shadow-lg relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              <span className="relative z-10 filter drop-shadow-lg">💎</span>
            </div>
            <div className={`text-sm sm:text-lg lg:text-2xl font-black bg-gradient-to-r ${colors.logoGradient} bg-clip-text text-transparent tracking-tight`}>
              <span className="hidden xs:inline">{BRAND_NAME}</span>
              <span className="xs:hidden">CU</span>
            </div>
          </a>

          {/* Menu desktop */}
          <div className="hidden md:flex flex-wrap gap-1 sm:gap-2 items-center">
            {/* Sélecteur pays */}
            <div className="flex gap-1 mr-2">
              {(Object.keys(countries) as CountryCode[]).map((code) => (
                <button
                  key={code}
                  onClick={() => onCountryChange(code)}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs lg:text-sm font-bold transition-all ${
                    currentCountry === code
                      ? colors.countryActive + ' shadow-lg scale-105'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  <span className="hidden sm:inline">{countries[code].flagEmoji} {countries[code].label}</span>
                  <span className="sm:hidden">{countries[code].flagEmoji}</span>
                </button>
              ))}
            </div>

            {/* Sélecteur langue */}
            <div className="flex gap-0.5 sm:gap-1 lg:gap-2">
              {(['fr', 'en', 'es'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onLangChange(lang)}
                  className={`px-1.5 sm:px-3 lg:px-5 py-1 sm:py-1.5 lg:py-2 rounded-full text-[10px] sm:text-sm lg:text-base font-bold transition-all ${
                    currentLang === lang
                      ? `bg-gradient-to-r ${colors.langActive} text-[#0a0f1c] shadow-xl ${colors.langActiveShadow} scale-105`
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  <span className="sm:hidden">{lang.toUpperCase()}</span>
                  <span className="hidden sm:inline">{lang === 'fr' ? '🇫🇷 FR' : lang === 'en' ? '🇬🇧 EN' : '🇪🇸 ES'}</span>
                </button>
              ))}
            </div>

            {/* Bouton utilisateur */}
            {user ? (
              <>
                <button
                  onClick={onDashboardClick}
                  className="px-2 sm:px-3 lg:px-5 py-1 sm:py-1.5 lg:py-2 rounded-full text-[10px] sm:text-sm lg:text-base font-bold bg-white/20 text-white hover:bg-white/30 border border-white/30 transition-all"
                >
                  <span className="hidden sm:inline">{t.dashboard}</span>
                  <span className="sm:hidden">📊</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="px-2 sm:px-3 lg:px-5 py-1 sm:py-1.5 lg:py-2 rounded-full text-[10px] sm:text-sm lg:text-base font-bold bg-red-500/20 text-white hover:bg-red-500/30 border border-red-500/30 transition-all"
                >
                  <span className="hidden sm:inline">{t.logout}</span>
                  <span className="sm:hidden">🚪</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleRegisterLogin}
                className={`px-3 sm:px-4 lg:px-6 py-1 sm:py-1.5 lg:py-2 rounded-full text-[10px] sm:text-sm lg:text-base font-bold text-white ${colors.btnBg} border-2 ${colors.btnBorder} shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-1 sm:gap-2`}
              >
                <span className="text-sm sm:text-base">👤</span>
                <span className="hidden xs:inline">{t.register}</span>
                <span className="hidden xs:inline text-white/50">/</span>
                <span className="hidden sm:inline">{t.loginShort}</span>
                <span className="xs:hidden">{t.register}</span>
              </button>
            )}
          </div>

          {/* Menu mobile toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-1.5 sm:p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            {isMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </header>

      {/* Menu mobile déroulant */}
      {isMenuOpen && (
        <div className={`fixed top-[60px] sm:top-[68px] left-0 right-0 ${colors.mobileBg} backdrop-blur-xl z-[999] border-b ${colors.borderColor} shadow-xl animate-slideDown md:hidden`}>
          <div className="p-4 space-y-3">
            {/* Pays */}
            <div className="flex flex-wrap gap-2">
              {(Object.keys(countries) as CountryCode[]).map((code) => (
                <button
                  key={code}
                  onClick={() => {
                    onCountryChange(code);
                    setIsMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-full text-sm font-bold transition-all flex-1 min-w-[60px] ${
                    currentCountry === code
                      ? colors.countryActive + ' shadow-lg'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  {countries[code].flagEmoji} {countries[code].label}
                </button>
              ))}
            </div>

            {/* Langues */}
            <div className="flex gap-2">
              {(['fr', 'en', 'es'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    onLangChange(lang);
                    setIsMenuOpen(false);
                  }}
                  className={`flex-1 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    currentLang === lang
                      ? `bg-gradient-to-r ${colors.langActive} text-[#0a0f1c] shadow-xl ${colors.langActiveShadow}`
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  {lang === 'fr' ? '🇫🇷 FR' : lang === 'en' ? '🇬🇧 EN' : '🇪🇸 ES'}
                </button>
              ))}
            </div>

            {/* Boutons utilisateur mobile */}
            {user ? (
              <div className="flex gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => {
                    onDashboardClick?.();
                    setIsMenuOpen(false);
                  }}
                  className="flex-1 px-4 py-2 rounded-full text-sm font-bold bg-white/20 text-white hover:bg-white/30 border border-white/30 transition-all"
                >
                  📊 {t.dashboard}
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex-1 px-4 py-2 rounded-full text-sm font-bold bg-red-500/30 text-white hover:bg-red-500/50 border border-red-500/30 transition-all"
                >
                  🚪 {t.logout}
                </button>
              </div>
            ) : (
              <button
                onClick={handleRegisterLogin}
                className={`w-full px-4 py-2.5 rounded-full text-sm font-bold text-white ${colors.btnBg} border-2 ${colors.btnBorder} shadow-lg transition-all flex items-center justify-center gap-2`}
              >
                👤 {t.register} / {t.loginShort}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;