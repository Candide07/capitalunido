import { useState } from 'react';
import { Translation } from '../data/translations';
import { CountryConfig } from '../data/countries';
import { Lang } from '../data/translations';
import RegistrationForm from './RegistrationForm';

interface HeroProps {
  t: Translation;
  country: CountryConfig;
  lang: Lang;
  onCTA: () => void;
}

const Hero = ({ t, country, lang, onCTA }: HeroProps) => {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return <RegistrationForm 
      lang={lang}
      country={country}
      onSuccess={() => setShowForm(false)} 
      onClose={() => setShowForm(false)} 
    />;
  }

  // Couleurs personnalisées selon le pays
  const getColors = () => {
    switch (country.code) {
      case 'pe':
        return {
          badgeGradient: 'from-[#6b2737]/10 to-[#c9a227]/10',
          badgeBorder: 'border-[#6b2737]/30',
          badgeText: 'text-gray-800',
          titleGlow: 'from-[#6b2737] via-[#c9a227] to-[#6b2737]',
          titleGradient: 'from-[#6b2737] to-[#c9a227]',
          titleText: 'text-gray-900',
          priceGradient: 'from-[#c9a227] to-[#6b2737]',
          priceText: 'text-[#6b2737]',
          buttonGradient: 'from-[#6b2737] via-[#c9a227] to-[#6b2737]',
          buttonShadow: 'shadow-[#6b2737]/40 hover:shadow-[#6b2737]/60',
          imageGlow: 'from-[#6b2737] via-[#c9a227] to-[#6b2737]',
          badgeBg: 'from-[#6b2737] to-[#8B0000]',
          badgeBorderColor: 'border-[#c9a227]',
          trustBadgeBg: 'from-[#6b2737] to-[#6b2737]',
          subtitleText: 'text-gray-700',
          guaranteeText: 'text-gray-500',
          priceBg: 'bg-white/80',
          oldPriceText: 'text-gray-400',
          spotsText: 'text-gray-700',
        };
      case 'mx':
        return {
          badgeGradient: 'from-[#2f6f4e]/10 to-[#CE1126]/10',
          badgeBorder: 'border-[#2f6f4e]/30',
          badgeText: 'text-gray-800',
          titleGlow: 'from-[#2f6f4e] via-[#CE1126] to-[#2f6f4e]',
          titleGradient: 'from-[#2f6f4e] to-[#CE1126]',
          titleText: 'text-gray-900',
          priceGradient: 'from-[#CE1126] to-[#2f6f4e]',
          priceText: 'text-[#2f6f4e]',
          buttonGradient: 'from-[#2f6f4e] via-[#CE1126] to-[#2f6f4e]',
          buttonShadow: 'shadow-[#2f6f4e]/40 hover:shadow-[#2f6f4e]/60',
          imageGlow: 'from-[#2f6f4e] via-[#CE1126] to-[#2f6f4e]',
          badgeBg: 'from-[#2f6f4e] to-[#003d2b]',
          badgeBorderColor: 'border-[#CE1126]',
          trustBadgeBg: 'from-[#6b2737] to-[#2f6f4e]',
          subtitleText: 'text-gray-700',
          guaranteeText: 'text-gray-500',
          priceBg: 'bg-white/80',
          oldPriceText: 'text-gray-400',
          spotsText: 'text-gray-700',
        };
      default:
        return {
          badgeGradient: 'from-[#ef2b2d]/20 to-[#009e49]/20',
          badgeBorder: 'border-[#c9a227]/40',
          badgeText: 'text-gray-800',
          titleGlow: 'from-[#ef2b2d] via-[#c9a227] to-[#009e49]',
          titleGradient: 'from-[#c9a227] via-[#ef2b2d] to-[#c9a227]',
          titleText: 'text-gray-900',
          priceGradient: 'from-[#c9a227] to-[#ef2b2d]',
          priceText: 'text-[#c9a227]',
          buttonGradient: 'from-[#c9a227] via-[#ef2b2d] to-[#009e49]',
          buttonShadow: 'shadow-[#c9a227]/40 hover:shadow-[#c9a227]/60',
          imageGlow: 'from-[#ef2b2d] via-[#6b2737] to-[#009e49]',
          badgeBg: 'from-[#009e49] to-[#6b2737]',
          badgeBorderColor: 'border-[#c9a227]',
          trustBadgeBg: 'from-[#6b2737] to-[#ef2b2d]',
          subtitleText: 'text-gray-700',
          guaranteeText: 'text-gray-500',
          priceBg: 'bg-white/80',
          oldPriceText: 'text-gray-400',
          spotsText: 'text-gray-700',
        };
    }
  };

  const colors = getColors();

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center mb-16 pt-8">
      {/* Colonne gauche - Texte */}
      <div className="space-y-8 animate-fade-in-up">
        {/* Badge */}
        <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${colors.badgeGradient} backdrop-blur-lg px-5 py-2 rounded-full text-sm border-2 ${colors.badgeBorder} animate-fadeIn shadow-lg`}>
          <span className="text-lg">🔥</span>
          <span className={`font-bold ${colors.badgeText}`}>{t.hero.badge}</span>
        </div>

        {/* Titre */}
        <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight ${colors.titleText}`}>
          {t.hero.title}{' '}
          <span className="relative inline-block">
            <span className={`absolute inset-0 bg-gradient-to-r ${colors.titleGlow} blur-xl opacity-30`}></span>
            <span className={`relative bg-gradient-to-r ${colors.titleGradient} bg-clip-text text-transparent animate-shimmer`}>
              {t.hero.titleHighlight}
            </span>
          </span>
          {' '}{t.hero.titleSuffix}
        </h1>

        {/* Sous-titre */}
        <p className={`text-lg ${colors.subtitleText} leading-relaxed`}>
          {t.hero.subtitle}
        </p>

        {/* Prix */}
        <div className={`${colors.priceBg} rounded-3xl p-6 space-y-4 card-hover shadow-lg`}>
          <div className={`text-lg line-through ${colors.oldPriceText}`}>
            {t.hero.oldPrice}
          </div>
          <div className={`text-4xl font-extrabold ${colors.priceText}`}>
            {t.hero.newPrice}
          </div>
          <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
            <div className={`bg-gradient-to-r ${colors.priceGradient} h-full w-[78%] animate-shimmer rounded-full`} />
          </div>
          <div className={`text-center ${colors.spotsText}`}>
            🔥 <strong>{t.hero.spotsLeft}</strong>
          </div>
        </div>

        {/* Bouton CTA */}
        <button
          onClick={() => setShowForm(true)}
          className={`group w-full sm:w-auto bg-gradient-to-r ${colors.buttonGradient} text-white font-black text-xl px-12 py-6 rounded-full shadow-2xl ${colors.buttonShadow} hover:scale-105 transition-all duration-300 animate-pulse-slow relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          <span className="relative flex items-center justify-center gap-2">
            <span className="text-2xl">💎</span>
            {t.hero.ctaButton}
            <span className="text-2xl">→</span>
          </span>
        </button>

        <p className={`text-sm ${colors.guaranteeText}`}>{t.hero.guarantee}</p>
      </div>

      {/* Colonne droite - Image avec badges */}
      <div className="relative group animate-fade-in-up" style={{animationDelay: '300ms'}}>
        <div className={`absolute -inset-1 bg-gradient-to-r ${colors.imageGlow} rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition duration-1000`}></div>
        <img
          src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop"
          alt={t.hero.imageAlt}
          className="relative w-full rounded-3xl shadow-2xl animate-float object-cover"
        />
        
        <div className={`absolute -bottom-6 -right-6 bg-gradient-to-br ${colors.badgeBg} rounded-3xl p-6 shadow-2xl animate-fadeIn hover:scale-110 transition-transform duration-300 border-2 ${colors.badgeBorderColor}`}>
          <div className="text-4xl font-black text-white">{t.hero.imageBadgeAmount}</div>
          <div className="text-sm font-bold text-[#c9a227]">
            {t.hero.imageBadgeSub}
          </div>
        </div>

        <div className="absolute -top-4 -left-4 bg-white rounded-2xl p-3 shadow-2xl animate-fadeIn border-2 border-[#009e49]">
          <div className="flex items-center gap-2">
            <div className="text-2xl">{country.flagEmoji}</div>
            <div className="text-xs font-bold text-gray-800 whitespace-pre-line">{t.hero.trustLocal}</div>
          </div>
        </div>

        <div className={`absolute -top-4 -right-4 bg-gradient-to-br ${colors.trustBadgeBg} rounded-2xl p-3 shadow-2xl animate-fadeIn max-w-[110px]`}>
          <div className="text-xs font-bold text-white text-center">
            <div className="text-lg">🛡️</div>
            <div className="text-[10px] leading-tight">{t.hero.trustRegulator}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;