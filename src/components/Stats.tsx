import { useEffect, useState } from 'react';
import { Translation } from '../data/translations';
import { CountryConfig } from '../data/countries';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface StatsProps {
  t: Translation;
  country: CountryConfig;
}

const Stats = ({ t, country }: StatsProps) => {
  const { ref, isVisible } = useScrollReveal();
  const a = country.amounts;
  const [stats, setStats] = useState({ members: 0, paid: 0, satisfaction: 0 });

  useEffect(() => {
    if (!isVisible) return;

    const targets = { 
      members: a.statsMembers, 
      paid: a.statsPaidMillions, 
      satisfaction: a.statsSatisfaction 
    };
    const duration = 1800;
    const steps = 50;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      
      setStats({
        members: Math.floor(targets.members * progress),
        paid: Math.floor(targets.paid * progress),
        satisfaction: Math.floor(targets.satisfaction * progress),
      });

      if (step >= steps) {
        setStats(targets);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isVisible, a.statsMembers, a.statsPaidMillions, a.statsSatisfaction]);

  // Couleurs personnalisées selon le pays
  const getColors = () => {
    switch (country.code) {
      case 'pe':
        return {
          bg: 'from-[#6b2737]/5 via-white to-[#c9a227]/5',
          border: 'border-[#6b2737]/20',
          icon1Bg: 'from-[#6b2737] to-[#c9a227]',
          icon2Bg: 'from-[#6b2737] to-[#0e2a4f]',
          icon3Bg: 'from-[#c9a227] to-[#f39c12]',
          icon4Bg: 'from-[#6b2737] to-[#8B0000]',
          textGradient: 'from-[#6b2737] to-[#c9a227]',
          textMuted: 'text-gray-600',
          numberColor: 'text-gray-800',
        };
      case 'mx':
        return {
          bg: 'from-[#2f6f4e]/5 via-white to-[#CE1126]/5',
          border: 'border-[#2f6f4e]/20',
          icon1Bg: 'from-[#2f6f4e] to-[#CE1126]',
          icon2Bg: 'from-[#6b2737] to-[#0e2a4f]',
          icon3Bg: 'from-[#CE1126] to-[#2f6f4e]',
          icon4Bg: 'from-[#2f6f4e] to-[#003d2b]',
          textGradient: 'from-[#2f6f4e] to-[#CE1126]',
          textMuted: 'text-gray-600',
          numberColor: 'text-gray-800',
        };
      default:
        return {
          bg: 'from-[#6b2737]/5 via-white to-[#6b2737]/5',
          border: 'border-[#c9a227]/20',
          icon1Bg: 'from-[#ef2b2d] to-[#c0392b]',
          icon2Bg: 'from-[#6b2737] to-[#0e2a4f]',
          icon3Bg: 'from-[#c9a227] to-[#f39c12]',
          icon4Bg: 'from-[#009e49] to-[#27ae60]',
          textGradient: 'from-[#c9a227] to-[#ef2b2d]',
          textMuted: 'text-gray-600',
          numberColor: 'text-gray-800',
        };
    }
  };

  const colors = getColors();

  return (
    <div 
      ref={ref}
      className={`bg-gradient-to-r ${colors.bg} backdrop-blur-lg rounded-3xl p-8 mb-16 border-2 ${colors.border} shadow-2xl transition-all duration-700 card-hover ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Statistique 1 - Membres */}
        <div className="text-center group">
          <div className={`inline-flex items-center justify-center w-16 h-16 mb-3 rounded-full bg-gradient-to-br ${colors.icon1Bg} shadow-lg animate-float`}>
            <span className="text-2xl">👥</span>
          </div>
          <div className={`text-4xl md:text-5xl font-extrabold ${colors.numberColor} mb-2`}>
            {stats.members.toLocaleString()}
          </div>
          <div className={`text-sm ${colors.textMuted} font-semibold`}>{t.stats.members}</div>
        </div>
        
        {/* Statistique 2 - Paiements */}
        <div className="text-center group">
          <div className={`inline-flex items-center justify-center w-16 h-16 mb-3 rounded-full bg-gradient-to-br ${colors.icon2Bg} shadow-lg animate-float`}>
            <span className="text-2xl">💰</span>
          </div>
          <div className={`text-4xl md:text-5xl font-extrabold ${colors.numberColor} mb-2`}>
            {stats.paid}M
          </div>
          <div className={`text-sm ${colors.textMuted} font-semibold`}>{t.stats.paid}</div>
        </div>
        
        {/* Statistique 3 - Satisfaction */}
        <div className="text-center group">
          <div className={`inline-flex items-center justify-center w-16 h-16 mb-3 rounded-full bg-gradient-to-br ${colors.icon3Bg} shadow-lg animate-float`}>
            <span className="text-2xl">⭐</span>
          </div>
          <div className={`text-4xl md:text-5xl font-extrabold ${colors.numberColor} mb-2`}>
            {stats.satisfaction}%
          </div>
          <div className={`text-sm ${colors.textMuted} font-semibold`}>{t.stats.satisfaction}</div>
        </div>
        
        {/* Statistique 4 - Retraits */}
        <div className="text-center group">
          <div className={`inline-flex items-center justify-center w-16 h-16 mb-3 rounded-full bg-gradient-to-br ${colors.icon4Bg} shadow-lg animate-float`}>
            <span className="text-2xl">🏦</span>
          </div>
          <div className={`text-4xl md:text-5xl font-extrabold ${colors.numberColor} mb-2`}>
            {a.statsWithdrawals}+
          </div>
          <div className={`text-sm ${colors.textMuted} font-semibold`}>{t.stats.withdrawals}</div>
        </div>
      </div>
    </div>
  );
};

export default Stats;