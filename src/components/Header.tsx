import { Lang } from '../data/translations';
import { CountryCode, countries, BRAND_NAME } from '../data/countries';

interface HeaderProps {
  currentLang: Lang;
  onLangChange: (lang: Lang) => void;
  currentCountry: CountryCode;
  onCountryChange: (country: CountryCode) => void;
}

const Header = ({ currentLang, onLangChange, currentCountry, onCountryChange }: HeaderProps) => {
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
        };
    }
  };

  const colors = getColors();

  return (
    <header className={`fixed top-1.5 left-0 right-0 bg-gradient-to-r ${colors.headerBg} backdrop-blur-xl z-[1000] border-b-2 ${colors.borderColor} shadow-lg ${colors.shadowColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap justify-between items-center gap-2">
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br ${colors.iconBg} rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-lg relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            <span className="relative z-10 filter drop-shadow-lg">💎</span>
          </div>
          <div className={`text-lg sm:text-2xl font-black bg-gradient-to-r ${colors.logoGradient} bg-clip-text text-transparent tracking-tight`}>
            {BRAND_NAME}
          </div>
        </div>

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
        </div>
      </div>
    </header>
  );
};

export default Header;