import { useEffect, useState } from 'react';
import { Translation } from '../data/translations';
import { CountryConfig } from '../data/countries';

interface UrgencyCounterProps {
  t: Translation;
  country: CountryConfig;
  onCTA: () => void;
}

const UrgencyCounter = ({ t, country, onCTA }: UrgencyCounterProps) => {
  const [timeLeft, setTimeLeft] = useState(23 * 3600 + 59 * 60 + 17);
  const [spots, setSpots] = useState(country.amounts.spotsLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) return prev - 1;
        setSpots((s) => (s > 0 ? s - 1 : 0));
        return 3600;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;
  const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Couleurs personnalisées selon le pays
  const getColors = () => {
    switch (country.code) {
      case 'pe':
        return {
          bgGradient: 'from-[#D91023]/30 via-[#1a3c6e]/30 to-[#fcd116]/30',
          borderColor: 'border-[#D91023]/50',
          badgeGradient: 'from-[#D91023] to-[#fcd116]',
          badgeText: 'text-white',
          timerBg: 'from-[#0a0f1c] to-[#1a3c6e]',
          timerBorder: 'border-[#D91023]/30',
          timerGradient: 'from-[#fcd116] via-[#D91023] to-[#fcd116]',
          spotsBg: 'from-[#D91023]/20 to-[#fcd116]/20',
          spotsBorder: 'border-[#D91023]/50',
          spotsText: 'text-[#D91023]',
          progressGradient: 'from-[#fcd116] to-[#D91023]',
          buttonGradient: 'from-[#D91023] via-[#fcd116] to-[#D91023]',
          buttonText: 'text-white',
          shadowColor: 'shadow-[#D91023]/40',
        };
      case 'mx':
        return {
          bgGradient: 'from-[#006341]/30 via-[#1a3c6e]/30 to-[#CE1126]/30',
          borderColor: 'border-[#006341]/50',
          badgeGradient: 'from-[#006341] to-[#CE1126]',
          badgeText: 'text-white',
          timerBg: 'from-[#0a0f1c] to-[#1a3c6e]',
          timerBorder: 'border-[#006341]/30',
          timerGradient: 'from-[#CE1126] via-[#006341] to-[#CE1126]',
          spotsBg: 'from-[#006341]/20 to-[#CE1126]/20',
          spotsBorder: 'border-[#006341]/50',
          spotsText: 'text-[#006341]',
          progressGradient: 'from-[#CE1126] to-[#006341]',
          buttonGradient: 'from-[#006341] via-[#CE1126] to-[#006341]',
          buttonText: 'text-white',
          shadowColor: 'shadow-[#006341]/40',
        };
      default:
        return {
          bgGradient: 'from-[#ef2b2d]/30 via-[#1a3c6e]/30 to-[#009e49]/30',
          borderColor: 'border-[#fcd116]/50',
          badgeGradient: 'from-[#ef2b2d] to-[#fcd116]',
          badgeText: 'text-white',
          timerBg: 'from-[#0a0f1c] to-[#1a3c6e]',
          timerBorder: 'border-[#fcd116]/30',
          timerGradient: 'from-[#fcd116] via-[#ef2b2d] to-[#fcd116]',
          spotsBg: 'from-[#fcd116]/20 to-[#ef2b2d]/20',
          spotsBorder: 'border-[#fcd116]/50',
          spotsText: 'text-[#fcd116]',
          progressGradient: 'from-[#fcd116] to-[#ef2b2d]',
          buttonGradient: 'from-[#009e49] via-[#fcd116] to-[#ef2b2d]',
          buttonText: 'text-white',
          shadowColor: 'shadow-[#fcd116]/40',
        };
    }
  };

  const colors = getColors();

  return (
    <div className={`relative bg-gradient-to-br ${colors.bgGradient} border-4 ${colors.borderColor} rounded-3xl p-8 md:p-12 text-center mb-16 shadow-2xl overflow-hidden card-hover`}>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImRvdHMiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjUyLCAyMDksIDIyLCAwLjEpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2RvdHMpIi8+PC9zdmc+')] opacity-30"></div>

      <div className="relative">
        <div className={`inline-flex items-center gap-3 bg-gradient-to-r ${colors.badgeGradient} ${colors.badgeText} font-black text-xl px-8 py-3 rounded-full mb-6 shadow-xl animate-pulse-slow`}>
          <span className="text-3xl">⏰</span>
          <span>{t.urgency.title}</span>
        </div>

        <p className="text-xl mb-6 font-semibold text-white">{t.urgency.subtitle}</p>

        <div className={`inline-block bg-gradient-to-br ${colors.timerBg} rounded-3xl px-8 md:px-16 py-8 mb-6 border-4 ${colors.timerBorder} shadow-2xl`}>
          <div className={`text-5xl md:text-7xl font-black font-mono tracking-widest bg-gradient-to-r ${colors.timerGradient} bg-clip-text text-transparent`}>
            {timeStr}
          </div>
        </div>

        <div className={`bg-gradient-to-r ${colors.spotsBg} border-2 ${colors.spotsBorder} rounded-2xl p-4 mb-6 max-w-md mx-auto`}>
          <p className="text-xl mb-2 text-white">
            {t.urgency.spotsPrefix} <strong className={`${colors.spotsText} text-3xl font-black`}>{spots}</strong> {t.urgency.spotsText}
          </p>
          <div className="bg-white/10 rounded-full h-3 overflow-hidden">
            <div
              className={`bg-gradient-to-r ${colors.progressGradient} h-full transition-all duration-500 animate-shimmer`}
              style={{ width: `${Math.min((spots / 100) * 100, 100)}%` }}
            />
          </div>
        </div>

        <button
          onClick={onCTA}
          className={`group bg-gradient-to-r ${colors.buttonGradient} ${colors.buttonText} font-black text-xl px-12 py-6 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 relative overflow-hidden ${colors.shadowColor}`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          <span className="relative flex items-center justify-center gap-3">
            <span className="text-2xl">🚀</span>
            {t.urgency.ctaButton}
            <span className="text-2xl">→</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default UrgencyCounter;