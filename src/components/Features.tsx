import { Translation } from '../data/translations';
import { CountryConfig } from '../data/countries';

interface FeaturesProps {
  t: Translation;
  country: CountryConfig;
}

const Features = ({ t, country }: FeaturesProps) => {
  // Couleurs personnalisées selon le pays
  const getColors = () => {
    switch (country.code) {
      case 'pe':
        return {
          titleGradient: 'from-[#D91023] to-[#fcd116]',
          featureGradients: [
            'from-[#D91023]/20 to-[#8B0000]/10',
            'from-[#1a3c6e]/20 to-[#0e2a4f]/10',
            'from-[#fcd116]/20 to-[#f39c12]/10',
            'from-[#D91023]/20 to-[#fcd116]/10',
          ],
          borderColors: [
            'border-[#D91023]/30',
            'border-[#1a3c6e]/30',
            'border-[#fcd116]/30',
            'border-[#D91023]/30',
          ],
          hoverBorder: 'hover:border-[#D91023]',
          hoverText: 'group-hover:text-[#D91023]',
          lineGradient: 'from-[#D91023] to-[#fcd116]',
          glowColor: 'from-[#D91023]/30',
          shadowColor: 'shadow-[#D91023]/20',
        };
      case 'mx':
        return {
          titleGradient: 'from-[#006341] to-[#CE1126]',
          featureGradients: [
            'from-[#006341]/20 to-[#003d2b]/10',
            'from-[#1a3c6e]/20 to-[#0e2a4f]/10',
            'from-[#CE1126]/20 to-[#8B0000]/10',
            'from-[#006341]/20 to-[#CE1126]/10',
          ],
          borderColors: [
            'border-[#006341]/30',
            'border-[#1a3c6e]/30',
            'border-[#CE1126]/30',
            'border-[#006341]/30',
          ],
          hoverBorder: 'hover:border-[#006341]',
          hoverText: 'group-hover:text-[#006341]',
          lineGradient: 'from-[#006341] to-[#CE1126]',
          glowColor: 'from-[#006341]/30',
          shadowColor: 'shadow-[#006341]/20',
        };
      default:
        return {
          titleGradient: 'from-[#fcd116] to-[#ef2b2d]',
          featureGradients: [
            'from-[#ef2b2d]/20 to-[#c0392b]/10',
            'from-[#1a3c6e]/20 to-[#0e2a4f]/10',
            'from-[#fcd116]/20 to-[#f39c12]/10',
            'from-[#009e49]/20 to-[#27ae60]/10',
          ],
          borderColors: [
            'border-[#ef2b2d]/30',
            'border-[#1a3c6e]/30',
            'border-[#fcd116]/30',
            'border-[#009e49]/30',
          ],
          hoverBorder: 'hover:border-[#fcd116]',
          hoverText: 'group-hover:text-[#fcd116]',
          lineGradient: 'from-[#fcd116] to-[#ef2b2d]',
          glowColor: 'from-[#fcd116]/30',
          shadowColor: 'shadow-[#fcd116]/20',
        };
    }
  };

  const colors = getColors();

  return (
    <div className="mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-in-up text-gray-900">
        {t.features.title}{' '}
        <span className={`bg-gradient-to-r ${colors.titleGradient} bg-clip-text text-transparent`}>
          {t.features.titleHighlight}
        </span>
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {t.features.items.map((feature, index) => {
          const gradient = colors.featureGradients[index % colors.featureGradients.length];
          const borderColor = colors.borderColors[index % colors.borderColors.length];
          
          return (
            <div
              key={index}
              className={`relative bg-gradient-to-br ${gradient} backdrop-blur-lg border-2 ${borderColor} rounded-3xl p-8 text-center hover:shadow-2xl ${colors.shadowColor} ${colors.hoverBorder} card-hover group overflow-hidden animate-fade-in-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${colors.glowColor} to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-2xl`}></div>

              <div className="relative">
                <div className="text-5xl mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 inline-block">
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-bold mb-3 text-gray-800 ${colors.hoverText} transition-colors`}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>

                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r ${colors.lineGradient} group-hover:w-16 transition-all duration-300 rounded-full`}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Features;