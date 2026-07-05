import { Lang } from '../data/translations';
import { CountryConfig } from '../data/countries';

interface SocialProofProps {
  lang: Lang;
  country: CountryConfig;
}

const labels: Record<Lang, { award: string; awardSub: string; secure: string; secureSub: (r: string) => string; stars: string; starsSub: string; ssl: string; gdpr: string; registered: (c: string) => string; payment: string }> = {
  fr: {
    award: "Prix d'Excellence 2025",
    awardSub: 'Meilleur programme financier',
    secure: '100% Sécurisé',
    secureSub: (r) => `Certifié ${r}`,
    stars: '4.9/5 Étoiles',
    starsSub: '15 847 avis vérifiés',
    ssl: 'SSL 256-bit',
    gdpr: 'Conformité protection des données',
    registered: (c) => `Enregistré ${c}`,
    payment: 'Paiement sécurisé',
  },
  en: {
    award: '2025 Excellence Award',
    awardSub: 'Best financial program',
    secure: '100% Secure',
    secureSub: (r) => `Certified by ${r}`,
    stars: '4.9/5 Stars',
    starsSub: '15,847 verified reviews',
    ssl: 'SSL 256-bit',
    gdpr: 'Data protection compliant',
    registered: (c) => `Registered in ${c}`,
    payment: 'Secure payment',
  },
  es: {
    award: 'Premio a la Excelencia 2025',
    awardSub: 'Mejor programa financiero',
    secure: '100% Seguro',
    secureSub: (r) => `Certificado por ${r}`,
    stars: '4.9/5 Estrellas',
    starsSub: '15,847 reseñas verificadas',
    ssl: 'SSL 256-bit',
    gdpr: 'Cumple protección de datos',
    registered: (c) => `Registrado en ${c}`,
    payment: 'Pago seguro',
  },
};

const SocialProof = ({ lang, country }: SocialProofProps) => {
  const l = labels[lang];
  const regulatorNames = country.regulators.map((r) => r.name).join(' / ');
  const countryName = country.label === 'PERÚ' ? { fr: 'au Pérou', en: 'in Peru', es: 'en Perú' }[lang] : { fr: 'au Mexique', en: 'in Mexico', es: 'en México' }[lang];

  // Couleurs personnalisées selon le pays
  const getColors = () => {
    switch (country.code) {
      case 'pe':
        return {
          badge1Bg: 'from-[#D91023]/30 to-[#fcd116]/10',
          badge1Border: 'border-[#D91023]/40',
          badge1Icon: 'from-[#D91023] to-[#fcd116]',
          badge2Bg: 'from-[#1a3c6e]/30 to-[#0e2a4f]/10',
          badge2Border: 'border-[#1a3c6e]/40',
          badge2Icon: 'from-[#1a3c6e] to-[#0e2a4f]',
          badge3Bg: 'from-[#fcd116]/30 to-[#f39c12]/10',
          badge3Border: 'border-[#fcd116]/40',
          badge3Icon: 'from-[#fcd116] to-[#f39c12]',
          footerBg: 'from-[#D91023]/20 via-[#1a3c6e]/20 to-[#fcd116]/20',
          footerBorder: 'border-[#D91023]/30',
          footerIcon1: 'bg-[#D91023]/30',
          footerIcon2: 'bg-[#1a3c6e]/30',
          footerIcon3: 'bg-[#D91023]/30',
          footerIcon4: 'bg-[#fcd116]/30',
          textGradient: 'from-[#fcd116] to-white',
          textColor: 'text-white',
          textMuted: 'text-white/80',
        };
      case 'mx':
        return {
          badge1Bg: 'from-[#006341]/30 to-[#CE1126]/10',
          badge1Border: 'border-[#006341]/40',
          badge1Icon: 'from-[#006341] to-[#CE1126]',
          badge2Bg: 'from-[#1a3c6e]/30 to-[#0e2a4f]/10',
          badge2Border: 'border-[#1a3c6e]/40',
          badge2Icon: 'from-[#1a3c6e] to-[#0e2a4f]',
          badge3Bg: 'from-[#CE1126]/30 to-[#006341]/10',
          badge3Border: 'border-[#CE1126]/40',
          badge3Icon: 'from-[#CE1126] to-[#006341]',
          footerBg: 'from-[#006341]/20 via-[#1a3c6e]/20 to-[#CE1126]/20',
          footerBorder: 'border-[#006341]/30',
          footerIcon1: 'bg-[#006341]/30',
          footerIcon2: 'bg-[#1a3c6e]/30',
          footerIcon3: 'bg-[#006341]/30',
          footerIcon4: 'bg-[#CE1126]/30',
          textGradient: 'from-[#CE1126] to-white',
          textColor: 'text-white',
          textMuted: 'text-white/80',
        };
      default:
        return {
          badge1Bg: 'from-[#009e49]/30 to-[#27ae60]/10',
          badge1Border: 'border-[#009e49]/40',
          badge1Icon: 'from-[#009e49] to-[#27ae60]',
          badge2Bg: 'from-[#1a3c6e]/30 to-[#0e2a4f]/10',
          badge2Border: 'border-[#1a3c6e]/40',
          badge2Icon: 'from-[#1a3c6e] to-[#0e2a4f]',
          badge3Bg: 'from-[#fcd116]/30 to-[#f39c12]/10',
          badge3Border: 'border-[#fcd116]/40',
          badge3Icon: 'from-[#fcd116] to-[#f39c12]',
          footerBg: 'from-[#ef2b2d]/20 via-[#1a3c6e]/20 to-[#009e49]/20',
          footerBorder: 'border-[#fcd116]/30',
          footerIcon1: 'bg-[#009e49]/30',
          footerIcon2: 'bg-[#1a3c6e]/30',
          footerIcon3: 'bg-[#ef2b2d]/30',
          footerIcon4: 'bg-[#fcd116]/30',
          textGradient: 'from-[#fcd116] to-white',
          textColor: 'text-white',
          textMuted: 'text-white/80',
        };
    }
  };

  const colors = getColors();

  return (
    <div className="mb-16">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Badge 1 - Award */}
        <div className={`bg-gradient-to-br ${colors.badge1Bg} backdrop-blur-lg border-2 ${colors.badge1Border} rounded-3xl p-8 text-center card-hover`}>
          <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${colors.badge1Icon} rounded-2xl flex items-center justify-center shadow-xl animate-float`}>
            <span className="text-4xl">🏆</span>
          </div>
          <div className={`text-2xl font-black mb-2 bg-gradient-to-r ${colors.textGradient} bg-clip-text text-transparent`}>{l.award}</div>
          <div className={`text-sm ${colors.textMuted} font-semibold`}>{l.awardSub}</div>
        </div>

        {/* Badge 2 - Secure */}
        <div className={`bg-gradient-to-br ${colors.badge2Bg} backdrop-blur-lg border-2 ${colors.badge2Border} rounded-3xl p-8 text-center card-hover`}>
          <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${colors.badge2Icon} rounded-2xl flex items-center justify-center shadow-xl animate-float`}>
            <span className="text-4xl">🛡️</span>
          </div>
          <div className={`text-2xl font-black mb-2 bg-gradient-to-r ${colors.textGradient} bg-clip-text text-transparent`}>{l.secure}</div>
          <div className={`text-sm ${colors.textMuted} font-semibold`}>{l.secureSub(regulatorNames)}</div>
        </div>

        {/* Badge 3 - Stars */}
        <div className={`bg-gradient-to-br ${colors.badge3Bg} backdrop-blur-lg border-2 ${colors.badge3Border} rounded-3xl p-8 text-center card-hover`}>
          <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${colors.badge3Icon} rounded-2xl flex items-center justify-center shadow-xl animate-float`}>
            <span className="text-4xl">⭐</span>
          </div>
          <div className={`text-2xl font-black mb-2 bg-gradient-to-r ${colors.textGradient} bg-clip-text text-transparent`}>{l.stars}</div>
          <div className={`text-sm ${colors.textMuted} font-semibold`}>{l.starsSub}</div>
        </div>
      </div>

      {/* Footer Badges */}
      <div className={`mt-8 bg-gradient-to-r ${colors.footerBg} backdrop-blur-lg border-2 ${colors.footerBorder} rounded-3xl p-6 shadow-xl card-hover`}>
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-semibold">
          <div className={`flex items-center gap-2 ${colors.textColor}`}>
            <div className={`w-8 h-8 rounded-full ${colors.footerIcon1} flex items-center justify-center`}>
              <span className="text-lg">🔒</span>
            </div>
            <span>{l.ssl}</span>
          </div>
          <div className={`flex items-center gap-2 ${colors.textColor}`}>
            <div className={`w-8 h-8 rounded-full ${colors.footerIcon2} flex items-center justify-center`}>
              <span className="text-lg">✓</span>
            </div>
            <span>{l.gdpr}</span>
          </div>
          <div className={`flex items-center gap-2 ${colors.textColor}`}>
            <div className={`w-8 h-8 rounded-full ${colors.footerIcon3} flex items-center justify-center`}>
              <span className="text-lg">{country.flagEmoji}</span>
            </div>
            <span>{l.registered(countryName)}</span>
          </div>
          <div className={`flex items-center gap-2 ${colors.textColor}`}>
            <div className={`w-8 h-8 rounded-full ${colors.footerIcon4} flex items-center justify-center`}>
              <span className="text-lg">💳</span>
            </div>
            <span>{l.payment}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProof;