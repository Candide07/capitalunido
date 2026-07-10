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
          bgFrom: 'from-[#6b2737]',
          bgTo: 'to-[#8B0000]',
          btnFrom: 'from-[#6b2737]',
          btnTo: 'to-[#c9a227]',
          textColor: 'text-white',
          shadowColor: 'shadow-[#6b2737]/50',
        };
      case 'mx':
        return {
          bgFrom: 'from-[#2f6f4e]',
          bgTo: 'to-[#003d2b]',
          btnFrom: 'from-[#CE1126]',
          btnTo: 'to-[#2f6f4e]',
          textColor: 'text-white',
          shadowColor: 'shadow-[#2f6f4e]/50',
        };
      default:
        return {
          bgFrom: 'from-[#6b2737]',
          bgTo: 'to-[#0e2a4f]',
          btnFrom: 'from-[#c9a227]',
          btnTo: 'to-[#ef2b2d]',
          textColor: 'text-white',
          shadowColor: 'shadow-[#6b2737]/50',
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