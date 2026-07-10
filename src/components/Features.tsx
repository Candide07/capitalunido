import { Translation } from '../data/translations';
import { CountryConfig } from '../data/countries';

interface FeaturesProps {
  t: Translation;
  country: CountryConfig;
}

const Features = ({ t, country }: FeaturesProps) => {
  // 👈 Vérification de sécurité : si country est undefined, utiliser des valeurs par défaut
  if (!country) {
    return (
      <div className="mb-16 text-center py-12">
        <p className="text-gray-500">Chargement des fonctionnalités...</p>
      </div>
    );
  }

  // Couleurs personnalisées selon le pays
  const getColors = () => {
    switch (country.code) {
      case 'pe':
        return {
          titleGradient: 'from-[#6b2737] to-[#c9a227]',
          featureGradients: [
            'from-[#6b2737]/20 to-[#8B0000]/10',
            'from-[#6b2737]/20 to-[#0e2a4f]/10',
            'from-[#c9a227]/20 to-[#f39c12]/10',
            'from-[#6b2737]/20 to-[#c9a227]/10',
          ],
          borderColors: [
            'border-[#6b2737]/30',
            'border-[#6b2737]/30',
            'border-[#c9a227]/30',
            'border-[#6b2737]/30',
          ],
          hoverBorder: 'hover:border-[#6b2737]',
          hoverText: 'group-hover:text-[#6b2737]',
          lineGradient: 'from-[#6b2737] to-[#c9a227]',
          glowColor: 'from-[#6b2737]/30',
          shadowColor: 'shadow-[#6b2737]/20',
        };
      case 'mx':
        return {
          titleGradient: 'from-[#2f6f4e] to-[#CE1126]',
          featureGradients: [
            'from-[#2f6f4e]/20 to-[#003d2b]/10',
            'from-[#6b2737]/20 to-[#0e2a4f]/10',
            'from-[#CE1126]/20 to-[#8B0000]/10',
            'from-[#2f6f4e]/20 to-[#CE1126]/10',
          ],
          borderColors: [
            'border-[#2f6f4e]/30',
            'border-[#6b2737]/30',
            'border-[#CE1126]/30',
            'border-[#2f6f4e]/30',
          ],
          hoverBorder: 'hover:border-[#2f6f4e]',
          hoverText: 'group-hover:text-[#2f6f4e]',
          lineGradient: 'from-[#2f6f4e] to-[#CE1126]',
          glowColor: 'from-[#2f6f4e]/30',
          shadowColor: 'shadow-[#2f6f4e]/20',
        };
      default:
        return {
          titleGradient: 'from-[#c9a227] to-[#ef2b2d]',
          featureGradients: [
            'from-[#ef2b2d]/20 to-[#c0392b]/10',
            'from-[#6b2737]/20 to-[#0e2a4f]/10',
            'from-[#c9a227]/20 to-[#f39c12]/10',
            'from-[#009e49]/20 to-[#27ae60]/10',
          ],
          borderColors: [
            'border-[#ef2b2d]/30',
            'border-[#6b2737]/30',
            'border-[#c9a227]/30',
            'border-[#009e49]/30',
          ],
          hoverBorder: 'hover:border-[#c9a227]',
          hoverText: 'group-hover:text-[#c9a227]',
          lineGradient: 'from-[#c9a227] to-[#ef2b2d]',
          glowColor: 'from-[#c9a227]/30',
          shadowColor: 'shadow-[#c9a227]/20',
        };
    }
  };

  const colors = getColors();

  // 👈 Vérification supplémentaire pour t.features
  if (!t || !t.features || !t.features.items) {
    return (
      <div className="mb-16 text-center py-12">
        <p className="text-gray-500">Chargement des fonctionnalités...</p>
      </div>
    );
  }

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