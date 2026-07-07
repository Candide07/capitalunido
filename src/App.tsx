import { useState, useEffect } from 'react';
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
import Login from './components/Login';
import Register from './components/Register';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import { getTranslations, Lang } from './data/translations';
import { countries, CountryCode, CountryConfig, BRAND_NAME } from './data/countries';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const [currentLang, setCurrentLang] = useState<Lang>('es');
  const [currentCountry, setCurrentCountry] = useState<CountryCode>('pe');
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const { user } = useAuth();

  const country = countries[currentCountry];
  const t = getTranslations(currentLang, country);

  const getBackground = () => {
    switch (currentCountry) {
      case 'pe': return 'from-[#fdf6f0] via-[#fff5eb] to-[#fdf0e6]';
      case 'mx': return 'from-[#f0f7f0] via-[#f5faf5] to-[#e8f5e8]';
      default: return 'from-[#f8fafc] via-[#e6f0fa] to-[#f0f9ff]';
    }
  };

  const bgGradient = getBackground();

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.history.pushState(null, '', `/${page}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
      setShowAdminLogin(true);
    }
  }, []);

  // ✅ REDIRECTION UNIQUEMENT DEPUIS LOGIN / REGISTER
  useEffect(() => {
    if (user && (currentPage === 'login' || currentPage === 'register')) {
      navigateTo('dashboard');
    }
  }, [user, currentPage]);

  // 📝 Traduction du texte "Certifié et régulé par"
  const getRegulatorText = (lang: Lang, country: CountryConfig) => {
    const names = country.regulators.map(r => r.name);
    const texts = {
      fr: `Certifié et régulé par ${names.join(' et ')}`,
      en: `Certified and regulated by ${names.join(' and ')}`,
      es: `Certificado y regulado por ${names.join(' y ')}`,
    };
    return texts[lang] || texts.fr;
  };

  if (showAdminLogin) {
    return <AdminLogin onLogin={() => { setShowAdminLogin(false); setIsAdminAuthenticated(true); setCurrentPage('admin'); }} onClose={() => setShowAdminLogin(false)} />;
  }

  if (currentPage === 'admin') {
    if (!isAdminAuthenticated) {
      setShowAdminLogin(true);
      return null;
    }
    return <AdminDashboard onClose={() => { setCurrentPage('home'); setIsAdminAuthenticated(false); }} />;
  }

  if (currentPage === 'login') {
    return <Login 
      onClose={() => navigateTo('home')} 
      onSwitchToRegister={() => navigateTo('register')}
      lang={currentLang}
    />;
  }

  if (currentPage === 'register') {
    return <Register 
      onClose={() => navigateTo('home')} 
      onSwitchToLogin={() => navigateTo('login')}
      lang={currentLang}
    />;
  }

  if (currentPage === 'dashboard') {
    if (!user) {
      navigateTo('login');
      return null;
    }
    return <UserDashboard 
      onClose={() => navigateTo('home')} 
      lang={currentLang}
    />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} text-gray-800 overflow-x-hidden relative`}>
      <ParticleBackground />
      <FlagStrip colors={country.flagColors} />
      <Header 
        currentLang={currentLang} 
        onLangChange={setCurrentLang} 
        currentCountry={currentCountry} 
        onCountryChange={setCurrentCountry}
        onLoginClick={() => navigateTo('login')}
        onRegisterClick={() => navigateTo('register')}
        onDashboardClick={user ? () => navigateTo('dashboard') : undefined}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 relative z-10">
        <Hero t={t} country={country} lang={currentLang} onCTA={() => {}} />
        
        <section className="py-16 bg-white/70 backdrop-blur-lg rounded-3xl mb-16 shadow-xl animate-fade-in-up">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {BRAND_NAME} — Une plateforme d'investissement innovante
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {country.regulators.length > 0 
                ? getRegulatorText(currentLang, country)
                : 'Confiance et transparence au service de vos investissements'}
            </p>
          </div>
        </section>

        <Stats t={t} country={country} />
        <SocialProof lang={currentLang} country={country} />
        <Features t={t} country={country} />
        <Testimonials t={t} country={country} lang={currentLang} /> {/* 👈 AJOUTÉ */}
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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;