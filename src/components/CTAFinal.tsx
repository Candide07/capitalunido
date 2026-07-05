import { Translation } from '../data/translations';
import { CountryConfig } from '../data/countries';

interface CTAFinalProps {
  t: Translation;
  country: CountryConfig;
  onCTA: () => void;
}

const CTAFinal = ({ t, country, onCTA }: CTAFinalProps) => {
  // Couleurs personnalisées selon le pays
  const getColors = () => {
    switch (country.code) {
      case 'pe':
        return {
          bgFrom: 'from-[#D91023]',
          bgTo: 'to-[#8B0000]',
          btnFrom: 'from-[#D91023]',
          btnTo: 'to-[#fcd116]',
          textColor: 'text-white',
          shadowColor: 'shadow-[#D91023]/50',
        };
      case 'mx':
        return {
          bgFrom: 'from-[#006341]',
          bgTo: 'to-[#003d2b]',
          btnFrom: 'from-[#CE1126]',
          btnTo: 'to-[#006341]',
          textColor: 'text-white',
          shadowColor: 'shadow-[#006341]/50',
        };
      default:
        return {
          bgFrom: 'from-[#1a3c6e]',
          bgTo: 'to-[#0e2a4f]',
          btnFrom: 'from-[#fcd116]',
          btnTo: 'to-[#ef2b2d]',
          textColor: 'text-white',
          shadowColor: 'shadow-[#1a3c6e]/50',
        };
    }
  };

  const colors = getColors();

  return (
    <div className={`bg-gradient-to-br ${colors.bgFrom} ${colors.bgTo} rounded-3xl p-8 md:p-12 text-center mb-16 card-hover shadow-2xl ${colors.shadowColor}`}>
      <h2 className={`text-3xl md:text-4xl font-bold mb-6 animate-fade-in-up ${colors.textColor}`}>
        {t.ctaFinal.title}
      </h2>
      
      <p className={`text-lg md:text-xl ${colors.textColor}/90 mb-8 max-w-2xl mx-auto`}>
        {t.ctaFinal.subtitle}
      </p>
      
      <button
        onClick={onCTA}
        className={`bg-gradient-to-r ${colors.btnFrom} ${colors.btnTo} text-white font-extrabold text-xl px-12 py-5 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 animate-glow relative overflow-hidden`}
      >
        <span className="relative z-10 flex items-center gap-3 justify-center">
          <span className="text-2xl">💎</span>
          {t.ctaFinal.button}
        </span>
      </button>

      {/* Message de confiance avec icône adaptée */}
      <p className={`${colors.textColor}/50 text-sm mt-6 flex items-center justify-center gap-2`}>
        <span>🔒</span> Transaction sécurisée • 14 jours de garantie
      </p>
    </div>
  );
};

export default CTAFinal;