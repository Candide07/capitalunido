import { Lang } from '../data/translations';
import { CountryConfig } from '../data/countries';

interface TrustBadgeProps {
  lang: Lang;
  country: CountryConfig;
}

const labels: Record<Lang, { verified: string; secure: string; protected: string }> = {
  fr: { 
    verified: 'Site vérifié', 
    secure: 'Transactions sécurisées', 
    protected: 'Protégé SSL' 
  },
  en: { 
    verified: 'Verified site', 
    secure: 'Secure transactions', 
    protected: 'SSL protected' 
  },
  es: { 
    verified: 'Sitio verificado', 
    secure: 'Transacciones seguras', 
    protected: 'Protegido SSL' 
  },
};

const TrustBadge = ({ lang, country }: TrustBadgeProps) => {
  const l = labels[lang];

  // Couleurs personnalisées selon le pays
  const getColors = () => {
    switch (country.code) {
      case 'pe':
        return {
          iconBg: 'bg-[#6b2737]',
          iconColor: 'text-white',
          shadowColor: 'shadow-[#6b2737]/20',
          borderColor: 'border-[#6b2737]/20',
          accentText: 'text-[#6b2737]',
          countryColor: 'text-[#6b2737]',
        };
      case 'mx':
        return {
          iconBg: 'bg-[#2f6f4e]',
          iconColor: 'text-white',
          shadowColor: 'shadow-[#2f6f4e]/20',
          borderColor: 'border-[#2f6f4e]/20',
          accentText: 'text-[#2f6f4e]',
          countryColor: 'text-[#2f6f4e]',
        };
      default:
        return {
          iconBg: 'bg-green-500',
          iconColor: 'text-white',
          shadowColor: 'shadow-green-500/20',
          borderColor: 'border-green-500/20',
          accentText: 'text-green-600',
          countryColor: 'text-gray-700',
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed bottom-6 right-6 z-[998] animate-fade-in-up hidden sm:block">
      <div className={`bg-white rounded-2xl shadow-2xl p-4 max-w-xs card-hover border ${colors.borderColor} ${colors.shadowColor}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 ${colors.iconBg} rounded-full flex items-center justify-center ${colors.iconColor} text-xl animate-pulse`}>
            ✓
          </div>
          <div className="flex-1">
            <div className="font-bold text-gray-900 text-sm">{l.verified}</div>
            <div className={`text-xs ${colors.accentText} font-medium`}>{l.secure}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-700">
          <span>🛡️ {l.protected}</span>
          <span>•</span>
          <span className={colors.countryColor}>{country.flagEmoji} {country.label}</span>
        </div>
      </div>
    </div>
  );
};

export default TrustBadge;