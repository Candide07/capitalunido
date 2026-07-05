import { Lang } from '../data/translations';
import { CountryConfig } from '../data/countries';

interface PriceComparisonProps {
  lang: Lang;
  country: CountryConfig;
}

const titles: Record<Lang, { title: string; highlight: string; limited: string; discountLabel: (p: number) => string; savingsLabel: (s: string) => string; basic: string; vip: string; premium: string; initialPrice: string; today: string; normalPrice: string; feats: [string, string, string, string]; basicFeats: [string, string, string] }> = {
  fr: {
    title: 'Offre',
    highlight: 'exceptionnelle',
    limited: '🔥 OFFRE LIMITÉE',
    discountLabel: (p) => `${p}% de réduction`,
    savingsLabel: (s) => `Économisez ${s}`,
    basic: 'BASIQUE',
    vip: 'VIP',
    premium: 'PREMIUM',
    initialPrice: 'Prix initial',
    today: "Aujourd'hui seulement",
    normalPrice: 'Tarif normal',
    feats: ['Support prioritaire 24/7', 'Formation vidéo complète', 'Garantie satisfait ou remboursé', 'Accès à vie aux mises à jour'],
    basicFeats: ['Support prioritaire', 'Formation vidéo', 'Garantie étendue'],
  },
  en: {
    title: 'Special',
    highlight: 'offer',
    limited: '🔥 LIMITED OFFER',
    discountLabel: (p) => `${p}% off`,
    savingsLabel: (s) => `Save ${s}`,
    basic: 'BASIC',
    vip: 'VIP',
    premium: 'PREMIUM',
    initialPrice: 'Original price',
    today: 'Today only',
    normalPrice: 'Regular price',
    feats: ['Priority 24/7 support', 'Full video training', 'Money-back guarantee', 'Lifetime access to updates'],
    basicFeats: ['Priority support', 'Video training', 'Extended guarantee'],
  },
  es: {
    title: 'Oferta',
    highlight: 'especial',
    limited: '🔥 OFERTA LIMITADA',
    discountLabel: (p) => `${p}% de descuento`,
    savingsLabel: (s) => `Ahorra ${s}`,
    basic: 'BÁSICO',
    vip: 'VIP',
    premium: 'PREMIUM',
    initialPrice: 'Precio inicial',
    today: 'Solo hoy',
    normalPrice: 'Precio normal',
    feats: ['Soporte prioritario 24/7', 'Formación en video completa', 'Garantía de satisfacción', 'Acceso de por vida a actualizaciones'],
    basicFeats: ['Soporte prioritario', 'Formación en video', 'Garantía extendida'],
  },
};

const PriceComparison = ({ lang, country }: PriceComparisonProps) => {
  const l = titles[lang];
  const a = country.amounts;

  // Couleurs personnalisées selon le pays
  const getColors = () => {
    switch (country.code) {
      case 'pe':
        return {
          titleGradient: 'from-[#D91023] to-[#fcd116]',
          vipBg: 'from-[#D91023]/20 to-[#fcd116]/20',
          vipBorder: 'border-[#D91023]',
          vipShadow: 'shadow-[#D91023]/30',
          vipBadge: 'from-[#D91023] to-[#fcd116]',
          vipPrice: 'text-[#D91023]',
          vipText: 'text-[#D91023]',
          vipCheck: 'text-[#D91023]',
          discountBg: 'bg-black/30',
          discountText: 'text-white',
        };
      case 'mx':
        return {
          titleGradient: 'from-[#006341] to-[#CE1126]',
          vipBg: 'from-[#006341]/20 to-[#CE1126]/20',
          vipBorder: 'border-[#006341]',
          vipShadow: 'shadow-[#006341]/30',
          vipBadge: 'from-[#006341] to-[#CE1126]',
          vipPrice: 'text-[#006341]',
          vipText: 'text-[#006341]',
          vipCheck: 'text-[#006341]',
          discountBg: 'bg-black/30',
          discountText: 'text-white',
        };
      default:
        return {
          titleGradient: 'from-[#fcd116] to-[#ef2b2d]',
          vipBg: 'from-[#fcd116]/20 to-[#ef2b2d]/20',
          vipBorder: 'border-[#fcd116]',
          vipShadow: 'shadow-[#fcd116]/30',
          vipBadge: 'from-[#fcd116] to-[#ef2b2d]',
          vipPrice: 'text-[#fcd116]',
          vipText: 'text-[#fcd116]',
          vipCheck: 'text-[#fcd116]',
          discountBg: 'bg-black/30',
          discountText: 'text-white',
        };
    }
  };

  const colors = getColors();

  return (
    <div className="mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-in-up text-gray-900">
        {l.title}{' '}
        <span className={`bg-gradient-to-r ${colors.titleGradient} bg-clip-text text-transparent`}>
          {l.highlight}
        </span>
      </h2>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Plan Basique */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 text-center card-hover">
          <div className="text-sm font-semibold text-gray-500 mb-2">{l.basic}</div>
          <div className="text-4xl font-black mb-4 line-through text-gray-400">
            {a.oldPrice}
          </div>
          <div className="text-sm text-gray-500 mb-6">{l.initialPrice}</div>
          <div className="space-y-3 mb-6">
            {l.basicFeats.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">✗</span>
                <span className="text-gray-500">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plan VIP - Featured */}
        <div className={`relative bg-gradient-to-br ${colors.vipBg} backdrop-blur-lg border-2 ${colors.vipBorder} rounded-3xl p-8 text-center transform scale-105 shadow-2xl ${colors.vipShadow} card-hover`}>
          <div className={`absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r ${colors.vipBadge} text-white font-black text-xs px-6 py-2 rounded-full`}>
            {l.limited}
          </div>

          <div className={`text-sm font-semibold ${colors.vipText} mb-2 mt-2`}>{l.vip}</div>
          <div className={`text-5xl font-black mb-2 ${colors.vipPrice}`}>
            {a.newPrice}
          </div>
          <div className="text-sm text-gray-400 mb-6">{l.today}</div>

          <div className={`${colors.discountBg} rounded-2xl p-4 mb-6`}>
            <div className={`text-2xl font-bold ${colors.discountText} mb-1`}>{l.discountLabel(a.discountPercent)}</div>
            <div className="text-xs text-gray-400">{l.savingsLabel(a.savings)}</div>
          </div>

          <div className="space-y-3 mb-6 text-left text-gray-800">
            {l.feats.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className={colors.vipCheck}>✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Premium */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 text-center card-hover">
          <div className="text-sm font-semibold text-gray-500 mb-2">{l.premium}</div>
          <div className="text-4xl font-black mb-4 text-gray-400">
            {a.premiumPrice}
          </div>
          <div className="text-sm text-gray-500 mb-6">{l.normalPrice}</div>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-400">✓</span>
              <span className="text-gray-700">{l.basicFeats[0]}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-400">✓</span>
              <span className="text-gray-700">{l.basicFeats[1]}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">✗</span>
              <span className="text-gray-500">{l.basicFeats[2]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceComparison;