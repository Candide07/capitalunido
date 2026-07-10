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
import { supabase } from './lib/supabase';

// Couleurs par défaut pour le FlagStrip
const DEFAULT_FLAG_COLORS = ['#fcd116', '#ef2b2d', '#009e49', '#1a3c6e'];

function AppContent() {
  const [currentLang, setCurrentLang] = useState<Lang>('es');
  const [currentCountry, setCurrentCountry] = useState<CountryCode>('pe');
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const { user } = useAuth();

  const country = countries[currentCountry];
  const t = country ? getTranslations(currentLang, country) : null;

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
    
    const refCode = urlParams.get('ref');
    if (refCode && currentPage === 'home') {
      navigateTo('register');
    }
  }, []);

  useEffect(() => {
    if (user && (currentPage === 'login' || currentPage === 'register')) {
      navigateTo('dashboard');
    }
  }, [user, currentPage]);

  const getRegulatorText = (lang: Lang, country: CountryConfig) => {
    if (!country || !country.regulators) return 'Confiance et transparence au service de vos investissements';
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
    return <AdminDashboard onClose={() => { supabase.auth.signOut(); setCurrentPage('home'); setIsAdminAuthenticated(false); }} />;
  }

  if (currentPage === 'register') {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref') || undefined;
    
    return <Register 
      onClose={() => navigateTo('home')} 
      onSwitchToLogin={() => navigateTo('login')}
      lang={currentLang}
      referralCode={refCode}
    />;
  }

  if (currentPage === 'login') {
    return <Login 
      onClose={() => navigateTo('home')} 
      onSwitchToRegister={() => navigateTo('register')}
      lang={currentLang}
      onNavigateToDashboard={() => navigateTo('dashboard')}
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

  // 👈 Vérification de sécurité : si country est undefined, on utilise des valeurs par défaut
  const safeCountry = country || {
    flagColors: DEFAULT_FLAG_COLORS,
    regulators: [],
    label: 'Pérou',
    code: 'pe'
  };

  const safeT = t || {
    hero: { title: 'CapitalUnido', subtitle: 'Investissez ensemble' },
    stats: { title: 'Nos statistiques' },
    features: { title: 'Nos fonctionnalités' },
    testimonials: { title: 'Témoignages', titleHighlight: 'nos membres' },
    footer: { copyright: 'Tous droits réservés' },
    cta: { title: 'Commencez maintenant' }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} text-gray-800 overflow-x-hidden relative`}>
      <ParticleBackground />
      {safeCountry && <FlagStrip colors={safeCountry.flagColors} />}
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
        <Hero t={safeT} country={safeCountry} lang={currentLang} onCTA={() => navigateTo('register')} />
        
        <section className="py-16 bg-white/70 backdrop-blur-lg rounded-3xl mb-16 shadow-xl animate-fade-in-up">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {BRAND_NAME} — Une plateforme d'investissement innovante
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {safeCountry.regulators && safeCountry.regulators.length > 0 
                ? getRegulatorText(currentLang, safeCountry)
                : 'Confiance et transparence au service de vos investissements'}
            </p>
          </div>
        </section>

        <Stats t={safeT} country={safeCountry} />
        <SocialProof lang={currentLang} country={safeCountry} />
        <Features t={safeT} country={safeCountry} />
        <Testimonials t={safeT} country={safeCountry} lang={currentLang} />
        <PriceComparison lang={currentLang} country={safeCountry} />
        <FAQ lang={currentLang} country={safeCountry} />
        <UrgencyCounter t={safeT} country={safeCountry} onCTA={() => navigateTo('register')} />
        <CTAFinal t={safeT} country={safeCountry} onCTA={() => navigateTo('register')} />
        <Footer t={safeT} country={safeCountry} />
      </main>

      <NotificationToast country={safeCountry} lang={currentLang} />
      <TrustBadge lang={currentLang} country={safeCountry} />
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