import { useEffect, useState } from 'react';
import { CountryConfig } from '../data/countries';
import { Lang } from '../data/translations';

interface NotificationToastProps {
  country: CountryConfig;
  lang: Lang;
}

const NotificationToast = ({ country, lang = 'fr' }: NotificationToastProps) => {
  const [visible, setVisible] = useState(false);
  const names = country.cities.flatMap((city) =>
    country.testimonialNames.map((name) => ({ name, location: city }))
  );
  const [currentName, setCurrentName] = useState(names[0]);

  // 📝 Traductions
  const timeTexts = {
    fr: 'Vient de s\'inscrire • Il y a quelques instants',
    en: 'Just joined • A few moments ago',
    es: 'Acaba de inscribirse • Hace unos momentos',
  };

  const timeText = timeTexts[lang] || timeTexts.fr;

  // Couleurs personnalisées selon le pays
  const getColors = () => {
    switch (country.code) {
      case 'pe':
        return {
          iconGradient: 'from-[#6b2737] to-[#c9a227]',
          checkColor: 'text-[#6b2737]',
          textColor: 'text-gray-900',
          locationColor: 'text-gray-600',
          timeColor: 'text-[#6b2737]',
        };
      case 'mx':
        return {
          iconGradient: 'from-[#2f6f4e] to-[#CE1126]',
          checkColor: 'text-[#2f6f4e]',
          textColor: 'text-gray-900',
          locationColor: 'text-gray-600',
          timeColor: 'text-[#2f6f4e]',
        };
      default:
        return {
          iconGradient: 'from-[#c9a227] to-[#ef2b2d]',
          checkColor: 'text-[#c9a227]',
          textColor: 'text-gray-900',
          locationColor: 'text-gray-600',
          timeColor: 'text-green-600',
        };
    }
  };

  const colors = getColors();

  useEffect(() => {
    const showNotification = () => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      setCurrentName(randomName);
      setVisible(true);

      setTimeout(() => {
        setVisible(false);
      }, 4200);
    };

    const initialTimer = setTimeout(showNotification, 2500);

    const interval = setInterval(() => {
      showNotification();
    }, Math.random() * 5000 + 7000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country.code]);

  return (
    <div
      className={`fixed bottom-6 left-6 bg-white text-gray-900 rounded-2xl shadow-2xl p-4 max-w-sm z-[999] transition-all duration-500 hidden sm:block ${
        visible ? 'translate-x-0 opacity-100 scale-100' : '-translate-x-full opacity-0 scale-95'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 bg-gradient-to-br ${colors.iconGradient} rounded-full flex items-center justify-center text-2xl animate-pulse text-white`}>
          ✓
        </div>
        <div className="flex-1">
          <div className={`font-bold text-sm ${colors.textColor}`}>
            {currentName.name}
          </div>
          <div className={`text-xs ${colors.locationColor}`}>
            {currentName.location}
          </div>
          <div className={`text-xs ${colors.timeColor} mt-1 font-medium`}>
            {timeText}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;