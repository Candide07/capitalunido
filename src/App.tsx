import { useState } from 'react';
import Header from './components/Header';
import FlagStrip from './components/FlagStrip';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import UrgencyCounter from './components/UrgencyCounter';
import CTAFinal from './components/CTAFinal';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import NotificationToast from './components/NotificationToast';
import TrustBadge from './components/TrustBadge';
import FAQ from './components/FAQ';
import PriceComparison from './components/PriceComparison';
import ScrollToTop from './components/ScrollToTop';
import SocialProof from './components/SocialProof';
import { getTranslations, Lang } from './data/translations';
import { countries, CountryCode, BRAND_NAME } from './data/countries';

function App() {
  const [currentLang, setCurrentLang] = useState<Lang>('es');
  const [currentCountry, setCurrentCountry] = useState<CountryCode>('pe');

  const country = countries[currentCountry];
  const t = getTranslations(currentLang, country);

  // 🎨 Fond personnalisé selon le pays
  const getBackground = () => {
    switch (currentCountry) {
      case 'pe':
        return 'from-[#fdf6f0] via-[#fff5eb] to-[#fdf0e6]';
      case 'mx':
        return 'from-[#f0f7f0] via-[#f5faf5] to-[#e8f5e8]';
      default:
        return 'from-[#f8fafc] via-[#e6f0fa] to-[#f0f9ff]';
    }
  };

  // 🎨 Couleur du texte selon le pays
  const getTextColor = () => {
    switch (currentCountry) {
      case 'pe':
        return 'text-gray-800';
      case 'mx':
        return 'text-gray-800';
      default:
        return 'text-gray-900';
    }
  };

  const bgGradient = getBackground();
  const textColor = getTextColor();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} ${textColor} overflow-x-hidden relative`}>
      <ParticleBackground />
      <FlagStrip colors={country.flagColors} />
      <Header 
        currentLang={currentLang} 
        onLangChange={setCurrentLang} 
        currentCountry={currentCountry} 
        onCountryChange={setCurrentCountry} 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 relative z-10">
        <Hero t={t} country={country} lang={currentLang} onCTA={() => {}} />
        
        {/* Section "Lancement Officiel" - Version professionnelle */}
        <section className="py-16 bg-white/70 backdrop-blur-lg rounded-3xl mb-16 shadow-xl animate-fade-in-up">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {BRAND_NAME} — Une plateforme d'investissement innovante
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {country.regulators.length > 0 
                ? `Certifié et régulé par ${country.regulators.map(r => r.name).join(' et ')}` 
                : 'Confiance et transparence au service de vos investissements'
              }
            </p>
          </div>
        </section>

        {/* Composants avec props country ajoutées */}
        <Stats t={t} country={country} />
        <SocialProof lang={currentLang} country={country} />
        <Features t={t} country={country} />
        <Testimonials t={t} country={country} />
        <PriceComparison lang={currentLang} country={country} />
        <FAQ lang={currentLang} country={country} />
        <UrgencyCounter t={t} country={country} onCTA={() => {}} />
        <CTAFinal t={t} country={country} onCTA={() => {}} />
        <Footer t={t} country={country} />
      </main>

      <NotificationToast country={country} lang={currentLang} />
      <TrustBadge lang={currentLang} country={country} />
      <ScrollToTop />
    </div>
  );
}

export default App;