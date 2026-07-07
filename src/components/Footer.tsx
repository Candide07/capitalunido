import { Translation } from '../data/translations';
import { CountryConfig, BRAND_NAME } from '../data/countries';

interface FooterProps {
  t: Translation;
  country: CountryConfig;
}

const Footer = ({ t, country }: FooterProps) => {
  // Couleurs personnalisées selon le pays
  const getColors = () => {
    switch (country.code) {
      case 'pe':
        return {
          logoGradient: 'from-[#D91023] to-[#fcd116]',
          textGradient: 'from-white to-[#fcd116]',
          badgeBorder: 'border-[#D91023]/40',
          badgeText: 'text-[#D91023]',
          badgeBg: 'bg-[#D91023]/10',
          dividerBorder: 'border-white/10',
        };
      case 'mx':
        return {
          logoGradient: 'from-[#006341] to-[#CE1126]',
          textGradient: 'from-white to-[#CE1126]',
          badgeBorder: 'border-[#006341]/40',
          badgeText: 'text-[#006341]',
          badgeBg: 'bg-[#006341]/10',
          dividerBorder: 'border-white/10',
        };
      default:
        return {
          logoGradient: 'from-[#fcd116] to-[#ef2b2d]',
          textGradient: 'from-white to-[#fcd116]',
          badgeBorder: 'border-[#fcd116]/40',
          badgeText: 'text-[#fcd116]',
          badgeBg: 'bg-[#fcd116]/10',
          dividerBorder: 'border-white/10',
        };
    }
  };

  const colors = getColors();

  return (
    <footer className="bg-black/40 backdrop-blur-lg rounded-3xl p-8 text-center mt-16 card-hover">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className={`w-10 h-10 bg-gradient-to-br ${colors.logoGradient} rounded-xl flex items-center justify-center text-xl animate-float text-white`}>
          ⚡
        </div>
        <div className={`text-2xl font-extrabold bg-gradient-to-r ${colors.textGradient} bg-clip-text text-transparent`}>
          {BRAND_NAME}
        </div>
      </div>

      <div className={`inline-block ${colors.badgeBg} border ${colors.badgeBorder} rounded-full px-4 py-1 text-xs font-bold ${colors.badgeText} mb-4`}>
        {t.footer.badge}
      </div>

      <p className="text-white/80 mb-2 max-w-2xl mx-auto">
        {t.footer.line1}
      </p>
      <p className="text-white/60 mb-6 max-w-2xl mx-auto text-sm">
        {t.footer.line2}
      </p>

      <div className={`border-t ${colors.dividerBorder} pt-6`}>
        <p className="text-xs text-white/40">
          {t.footer.copyright}
        </p>
        <p className="text-xs text-white/30 mt-2">
          {t.footer.compliance}
        </p>
        <p className="text-xs text-white/40 mt-3">
          {t.footer.line3}
        </p>

        {country.regulators.length > 0 && (
          <p className="text-xs text-white/20 mt-4">
            {country.label} • {country.regulators.map(r => `${r.name}: ${r.phone}`).join(' • ')}
          </p>
        )}
      </div>
    </footer>
  );
};

export default Footer;