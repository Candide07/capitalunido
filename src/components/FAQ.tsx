import { useState } from 'react';
import { Lang } from '../data/translations';
import { CountryConfig, BRAND_NAME } from '../data/countries';

interface FAQProps {
  lang: Lang;
  country: CountryConfig;
}

const FAQ = ({ lang, country }: FAQProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const a = country.amounts;
  const regulatorNames = country.regulators.map((r) => r.name).join(' / ');

  // Couleurs personnalisées selon le pays
  const getColors = () => {
    switch (country.code) {
      case 'pe':
        return {
          gradientFrom: 'from-[#6b2737]',
          gradientTo: 'to-[#c9a227]',
          borderColor: 'border-[#6b2737]/30',
          hoverBorder: 'hover:border-[#6b2737]/50',
          iconColor: 'text-[#6b2737]',
          bgGradient: 'from-[#6b2737]/10',
        };
      case 'mx':
        return {
          gradientFrom: 'from-[#2f6f4e]',
          gradientTo: 'to-[#CE1126]',
          borderColor: 'border-[#2f6f4e]/30',
          hoverBorder: 'hover:border-[#2f6f4e]/50',
          iconColor: 'text-[#2f6f4e]',
          bgGradient: 'from-[#2f6f4e]/10',
        };
      default:
        return {
          gradientFrom: 'from-[#c9a227]',
          gradientTo: 'to-[#ef2b2d]',
          borderColor: 'border-[#c9a227]/30',
          hoverBorder: 'hover:border-[#c9a227]/50',
          iconColor: 'text-[#c9a227]',
          bgGradient: 'from-[#c9a227]/10',
        };
    }
  };

  const colors = getColors();

  const faqData: Record<Lang, { question: string; answer: string }[]> = {
    fr: [
      {
        question: `Comment fonctionne le programme ${BRAND_NAME} ?`,
        answer: `${BRAND_NAME} utilise un système d'investissement intelligent qui génère des rendements quotidiens. Une fois votre compte activé, nos algorithmes travaillent automatiquement pour maximiser vos gains. Vous recevez vos paiements directement sur votre compte bancaire chaque jour à 8h du matin.`,
      },
      {
        question: 'Mes informations bancaires sont-elles en sécurité ?',
        answer: "Absolument ! Nous utilisons le cryptage SSL 256-bit, le même niveau de sécurité que les grandes banques internationales. Vos données sont protégées selon les normes PCI-DSS et ne sont jamais partagées avec des tiers.",
      },
      {
        question: 'Combien de temps pour recevoir mon premier paiement ?',
        answer: "Votre premier paiement est généralement traité dans les 24 heures suivant l'activation de votre compte. Plus de 98% de nos membres reçoivent leur premier versement en moins de 12 heures.",
      },
      {
        question: 'Puis-je retirer mon argent à tout moment ?',
        answer: "Oui, vous avez un accès illimité à vos fonds. Les retraits sont traités sous 24-48 heures ouvrables. Il n'y a aucun frais caché et aucune période de blocage.",
      },
      {
        question: 'Y a-t-il des frais cachés ou des conditions particulières ?',
        answer: `Non, aucun frais caché ! Le prix affiché (${a.newPrice}) est le seul paiement requis pour démarrer. Il n'y a pas d'abonnement mensuel, pas de frais de maintenance, et pas de commission sur vos gains.`,
      },
      {
        question: 'Que se passe-t-il si je ne suis pas satisfait ?',
        answer: "Nous offrons une garantie satisfait ou remboursé de 14 jours. Contactez notre service client et nous vous rembourserons intégralement, sans poser de questions.",
      },
      {
        question: `Le programme est-il légal au ${country.label === 'PERÚ' ? 'Pérou' : 'Mexique'} ?`,
        answer: `Oui, ${BRAND_NAME} est enregistré et opère en conformité avec la réglementation de ${regulatorNames}. Nous respectons toutes les lois locales en matière de services financiers et de protection des consommateurs.`,
      },
      {
        question: 'Pourquoi avez-vous besoin de mes informations de carte bancaire ?',
        answer: "Vos informations de carte bancaire nous permettent de verser vos gains quotidiens directement sur votre compte. Toutes ces informations sont cryptées et stockées de manière ultra-sécurisée.",
      },
    ],
    en: [
      {
        question: `How does the ${BRAND_NAME} program work?`,
        answer: `${BRAND_NAME} uses a smart investment system that generates daily returns. Once your account is activated, our algorithms work automatically to maximize your earnings. You receive payments directly to your bank account every day at 8am.`,
      },
      {
        question: 'Is my banking information secure?',
        answer: 'Absolutely! We use 256-bit SSL encryption, the same security level as major international banks. Your data is protected according to PCI-DSS standards and never shared with third parties.',
      },
      {
        question: 'How long until my first payment?',
        answer: 'Your first payment is usually processed within 24 hours of account activation. Over 98% of our members receive their first payment in less than 12 hours.',
      },
      {
        question: 'Can I withdraw my money anytime?',
        answer: 'Yes, you have unlimited access to your funds. Withdrawals are processed within 24-48 business hours. No hidden fees and no lock-in period.',
      },
      {
        question: 'Are there hidden fees or special conditions?',
        answer: `No hidden fees! The displayed price (${a.newPrice}) is the only payment required to start. No monthly subscription, no maintenance fees, and no commission on your earnings.`,
      },
      {
        question: "What if I'm not satisfied?",
        answer: "We offer a 14-day money-back guarantee. Contact our customer service and we'll refund you in full, no questions asked.",
      },
      {
        question: `Is the program legal in ${country.label === 'PERÚ' ? 'Peru' : 'Mexico'}?`,
        answer: `Yes, ${BRAND_NAME} is registered and operates in compliance with ${regulatorNames} regulations. We comply with all local laws regarding financial services and consumer protection.`,
      },
      {
        question: 'Why do you need my bank card information?',
        answer: "Your bank card information allows us to deposit your daily earnings directly into your account. All this information is encrypted and stored ultra-securely.",
      },
    ],
    es: [
      {
        question: `¿Cómo funciona el programa ${BRAND_NAME}?`,
        answer: `${BRAND_NAME} utiliza un sistema de inversión inteligente que genera rendimientos diarios. Una vez activada tu cuenta, nuestros algoritmos trabajan automáticamente para maximizar tus ganancias. Recibes tus pagos directamente en tu cuenta bancaria cada día a las 8am.`,
      },
      {
        question: '¿Mi información bancaria está segura?',
        answer: '¡Por supuesto! Usamos cifrado SSL de 256 bits, el mismo nivel de seguridad que los grandes bancos internacionales. Tus datos están protegidos según los estándares PCI-DSS y nunca se comparten con terceros.',
      },
      {
        question: '¿Cuánto tiempo tarda mi primer pago?',
        answer: 'Tu primer pago generalmente se procesa dentro de las 24 horas posteriores a la activación de tu cuenta. Más del 98% de nuestros miembros reciben su primer pago en menos de 12 horas.',
      },
      {
        question: '¿Puedo retirar mi dinero en cualquier momento?',
        answer: 'Sí, tienes acceso ilimitado a tus fondos. Los retiros se procesan en 24-48 horas hábiles. No hay comisiones ocultas ni periodo de bloqueo.',
      },
      {
        question: '¿Hay comisiones ocultas o condiciones especiales?',
        answer: `¡No hay comisiones ocultas! El precio mostrado (${a.newPrice}) es el único pago requerido para empezar. Sin suscripción mensual, sin costos de mantenimiento y sin comisión sobre tus ganancias.`,
      },
      {
        question: '¿Qué pasa si no estoy satisfecho?',
        answer: 'Ofrecemos una garantía de devolución de 14 días. Contacta a nuestro servicio al cliente y te reembolsaremos por completo, sin hacer preguntas.',
      },
      {
        question: `¿El programa es legal en ${country.label === 'PERÚ' ? 'Perú' : 'México'}?`,
        answer: `Sí, ${BRAND_NAME} está registrado y opera de conformidad con la normativa de ${regulatorNames}. Cumplimos con todas las leyes locales en materia de servicios financieros y protección al consumidor.`,
      },
      {
        question: '¿Por qué necesitan mi información de tarjeta bancaria?',
        answer: 'Tu información de tarjeta bancaria nos permite depositar tus ganancias diarias directamente en tu cuenta. Toda esta información se cifra y almacena de forma ultra segura.',
      },
    ],
  };

  const faqs = faqData[lang];
  const heading = { fr: ['Questions', 'fréquentes'], en: ['Frequently', 'asked questions'], es: ['Preguntas', 'frecuentes'] }[lang];

  return (
    <div className="mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-in-up">
        {heading[0]}{' '}
        <span className={`bg-gradient-to-r ${colors.gradientFrom} ${colors.gradientTo} bg-clip-text text-transparent`}>
          {heading[1]}
        </span>
      </h2>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`bg-white/5 backdrop-blur-lg border ${colors.borderColor} rounded-2xl overflow-hidden ${colors.hoverBorder} transition-all duration-300 card-hover`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
            >
              <span className="font-semibold text-lg pr-4 text-gray-900">{faq.question}</span>
              <span
                className={`text-2xl ${colors.iconColor} transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              >
                ↓
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className={`px-6 pb-5 text-gray-700 leading-relaxed bg-gradient-to-b ${colors.bgGradient} to-transparent`}>
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;