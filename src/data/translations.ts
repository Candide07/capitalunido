import { CountryConfig, BRAND_NAME } from './countries';

export type Lang = 'fr' | 'en' | 'es';

export interface Translation {
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    titleSuffix: string;
    subtitle: string;
    oldPrice: string;
    newPrice: string;
    spotsLeft: string;
    ctaButton: string;
    guarantee: string;
    imageAlt: string;
    imageBadgeAmount: string;
    imageBadgeSub: string;
    trustLocal: string;
    trustRegulator: string;
  };
  stats: {
    members: string;
    paid: string;
    satisfaction: string;
    withdrawals: string;
  };
  features: {
    title: string;
    titleHighlight: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  testimonials: {
    title: string;
    titleHighlight: string;
    items: Array<{
      name: string;
      location: string;
      text: string;
      img: string;
    }>;
  };
  urgency: {
    title: string;
    subtitle: string;
    spotsPrefix: string;
    spotsText: string;
    ctaButton: string;
  };
  ctaFinal: {
    title: string;
    subtitle: string;
    button: string;
  };
  footer: {
    badge: string;
    line1: string;
    line2: string;
    line3: string;
    tagline: string;
    copyright: string;
    compliance: string;
  };
}

export function getTranslations(lang: Lang, country: CountryConfig): Translation {
  const a = country.amounts;
  const [city1, city2, city3] = country.cities;
  const [name1, name2, name3] = country.testimonialNames;
  const regulatorNames = country.regulators.map((r) => r.name).join(' / ');
  const membersFormatted = a.membersThisWeek.toLocaleString(
    lang === 'es' ? 'es-419' : lang === 'fr' ? 'fr-FR' : 'en-US'
  );
  const demonym =
    lang === 'fr'
      ? country.label === 'PERÚ' ? 'Péruvien' : 'Mexicain'
      : lang === 'en'
      ? country.label === 'PERÚ' ? 'Peruvian' : 'Mexican'
      : country.label === 'PERÚ' ? 'Peruano' : 'Mexicano';

  const table: Record<Lang, Translation> = {
    fr: {
      hero: {
        badge: `🔥 ${membersFormatted} personnes nous ont rejointes cette semaine 🔥`,
        title: 'Gagnez',
        titleHighlight: `jusqu'à ${a.monthlyIncome} par mois`,
        titleSuffix: 'en investissant intelligemment',
        subtitle: `CapitalUnido est une plateforme d'investissement innovante qui permet à ses membres de générer des revenus quotidiens. Capital 100% garanti. Paiement quotidien.`,
        oldPrice: `Prix habituel : ${a.oldPrice}`,
        newPrice: `Offre spéciale : ${a.newPrice} seulement !`,
        spotsLeft: `Plus que ${a.spotsLeft} places à ce prix !`,
        ctaButton: "💎 COMMENCER MAINTENANT",
        guarantee: '✅ Paiement sécurisé • Annulation gratuite 14 jours',
        imageAlt: 'Réussite financière',
        imageBadgeAmount: `+${a.monthlyIncome}`,
        imageBadgeSub: 'de revenu mensuel',
        trustLocal: `100% ${demonym}`,
        trustRegulator: regulatorNames,
      },
      stats: {
        members: 'Membres actifs',
        paid: `Millions ${country.currencyCode} versés`,
        satisfaction: '% de satisfaction',
        withdrawals: 'Retraits quotidiens',
      },
      features: {
        title: 'Pourquoi des milliers de personnes',
        titleHighlight: 'nous font confiance',
        items: [
          {
            icon: '💰',
            title: `+${a.monthlyIncome}/mois`,
            description: 'En moyenne, nos membres augmentent significativement leurs revenus',
          },
          {
            icon: '⚡',
            title: 'Paiement quotidien',
            description: `Recevez ${a.dailyMin}-${a.dailyMax} tous les matins à 8h`,
          },
          {
            icon: '🔒',
            title: 'Capital 100% garanti',
            description: 'Votre investissement est protégé par notre fonds de réserve',
          },
          {
            icon: country.flagEmoji,
            title: `100% ${demonym}`,
            description: 'Une plateforme développée par des experts financiers locaux',
          },
        ],
      },
      testimonials: {
        title: 'Ils ont',
        titleHighlight: 'déjà réussi',
        items: [
          {
            name: name1,
            location: city1,
            text: "Moins d'un mois après mon inscription, j'avais déjà récupéré mon investissement. Maintenant c'est que du bénéfice !",
            img: 'https://randomuser.me/api/portraits/women/44.jpg',
          },
          {
            name: name2,
            location: city2,
            text: `Je suis chauffeur de taxi. Avec ${BRAND_NAME}, j'arrondis mes fins de mois sans aucun effort. Les paiements tombent tous les jours.`,
            img: 'https://randomuser.me/api/portraits/men/32.jpg',
          },
          {
            name: name3,
            location: city3,
            text: "Au début j'étais sceptique. Ma fille m'a inscrite. 3 mois après, j'avais retiré 3 fois ma mise. Incroyable !",
            img: 'https://randomuser.me/api/portraits/women/68.jpg',
          },
        ],
      },
      urgency: {
        title: '⏰ OFFRE EXCEPTIONNELLE – DERNIÈRES HEURES ⏰',
        subtitle: 'L\'offre spéciale "Revenu Garanti" ferme dans :',
        spotsPrefix: 'Plus que',
        spotsText: `places disponibles à ${a.newPrice}`,
        ctaButton: '🚀 RÉSERVER MA PLACE MAINTENANT',
      },
      ctaFinal: {
        title: 'Ne laissez pas passer cette chance',
        subtitle: 'Des milliers de personnes ont déjà transformé leur vie financière. À votre tour !',
        button: "💎 REJOINDRE MAINTENANT",
      },
      footer: {
        badge: 'Site Officiel',
        line1: "CapitalUnido est une plateforme d'investissement innovante qui permet à ses membres de générer des revenus quotidiens.",
        line2: `📞 Support client : ${country.regulators[0]?.phone || 'Contacter le support'}`,
        line3: `${country.flagEmoji} Rejoignez une communauté de plus de 50 000 investisseurs ${country.flagEmoji}`,
        tagline: `Rejoignez des milliers de personnes qui ont transformé leur vie financière grâce à ${BRAND_NAME}.`,
        copyright: `© 2026 ${BRAND_NAME} — Tous droits réservés`,
        compliance: `🔒 Site sécurisé | 🛡️ Protection des données | 📱 Support 24/7`,
      },
    },
    en: {
      hero: {
        badge: `🔥 ${membersFormatted} people joined us this week 🔥`,
        title: 'Earn',
        titleHighlight: `up to ${a.monthlyIncome} a month`,
        titleSuffix: 'by investing smartly',
        subtitle: `CapitalUnido is an innovative investment platform that allows its members to generate daily income. 100% capital guaranteed. Daily payment.`,
        oldPrice: `Regular price: ${a.oldPrice}`,
        newPrice: `Special offer: ${a.newPrice}!`,
        spotsLeft: `Only ${a.spotsLeft} spots left at this price!`,
        ctaButton: '💎 GET STARTED NOW',
        guarantee: '✅ Secure payment • Free 14-day cancellation',
        imageAlt: 'Financial success',
        imageBadgeAmount: `+${a.monthlyIncome}`,
        imageBadgeSub: 'in monthly income',
        trustLocal: `100% ${demonym}`,
        trustRegulator: regulatorNames,
      },
      stats: {
        members: 'Active members',
        paid: `Million ${country.currencyCode} paid`,
        satisfaction: 'Satisfaction %',
        withdrawals: 'Daily withdrawals',
      },
      features: {
        title: 'Why thousands of people',
        titleHighlight: 'trust us',
        items: [
          {
            icon: '💰',
            title: `+${a.monthlyIncome}/month`,
            description: 'On average, members significantly increase their income',
          },
          {
            icon: '⚡',
            title: 'Daily payment',
            description: `${a.dailyMin}-${a.dailyMax} every morning at 8am`,
          },
          {
            icon: '🔒',
            title: '100% guaranteed capital',
            description: 'Your investment is protected by our reserve fund',
          },
          {
            icon: country.flagEmoji,
            title: `100% ${demonym}`,
            description: 'A platform developed by local financial experts',
          },
        ],
      },
      testimonials: {
        title: 'They have',
        titleHighlight: 'already succeeded',
        items: [
          {
            name: name1,
            location: city1,
            text: "Less than a month after joining, I had already recovered my investment. Now it's pure profit!",
            img: 'https://randomuser.me/api/portraits/women/44.jpg',
          },
          {
            name: name2,
            location: city2,
            text: `I'm a taxi driver. With ${BRAND_NAME}, I supplement my income with zero effort. Payments come every day.`,
            img: 'https://randomuser.me/api/portraits/men/32.jpg',
          },
          {
            name: name3,
            location: city3,
            text: 'At first I was skeptical. My daughter signed me up. 3 months later, I had withdrawn 3 times my investment. Unbelievable!',
            img: 'https://randomuser.me/api/portraits/women/68.jpg',
          },
        ],
      },
      urgency: {
        title: '⏰ SPECIAL OFFER – LAST HOURS ⏰',
        subtitle: '"Guaranteed Income" special offer closes in:',
        spotsPrefix: 'Only',
        spotsText: `spots available at ${a.newPrice}`,
        ctaButton: '🚀 RESERVE MY SPOT NOW',
      },
      ctaFinal: {
        title: "Don't miss this opportunity",
        subtitle: 'Thousands of people have already transformed their financial lives. Your turn!',
        button: '💎 JOIN NOW',
      },
      footer: {
        badge: 'Official Site',
        line1: "CapitalUnido is an innovative investment platform that allows its members to generate daily income.",
        line2: `📞 Customer support: ${country.regulators[0]?.phone || 'Contact support'}`,
        line3: `${country.flagEmoji} Join a community of over 50,000 investors ${country.flagEmoji}`,
        tagline: `Join thousands of people who have transformed their financial lives with ${BRAND_NAME}.`,
        copyright: `© 2026 ${BRAND_NAME} — All rights reserved`,
        compliance: `🔒 Secure site | 🛡️ Data protection | 📱 24/7 Support`,
      },
    },
    es: {
      hero: {
        badge: `🔥 ${membersFormatted} personas se unieron esta semana 🔥`,
        title: 'Gana',
        titleHighlight: `hasta ${a.monthlyIncome} al mes`,
        titleSuffix: 'invirtiendo de forma inteligente',
        subtitle: `CapitalUnido es una plataforma de inversión innovadora que permite a sus miembros generar ingresos diarios. Capital 100% garantizado. Pago diario.`,
        oldPrice: `Precio habitual: ${a.oldPrice}`,
        newPrice: `Oferta especial: ${a.newPrice}!`,
        spotsLeft: `¡Solo quedan ${a.spotsLeft} lugares a este precio!`,
        ctaButton: '💎 EMPEZAR AHORA',
        guarantee: '✅ Pago seguro • Cancelación gratuita en 14 días',
        imageAlt: 'Éxito financiero',
        imageBadgeAmount: `+${a.monthlyIncome}`,
        imageBadgeSub: 'de ingreso mensual',
        trustLocal: `100% ${demonym}`,
        trustRegulator: regulatorNames,
      },
      stats: {
        members: 'Miembros activos',
        paid: `Millones ${country.currencyCode} pagados`,
        satisfaction: '% de satisfacción',
        withdrawals: 'Retiros diarios',
      },
      features: {
        title: 'Por qué miles de personas',
        titleHighlight: 'confían en nosotros',
        items: [
          {
            icon: '💰',
            title: `+${a.monthlyIncome}/mes`,
            description: 'En promedio, nuestros miembros aumentan significativamente sus ingresos',
          },
          {
            icon: '⚡',
            title: 'Pago diario',
            description: `Recibe ${a.dailyMin}-${a.dailyMax} cada mañana a las 8am`,
          },
          {
            icon: '🔒',
            title: 'Capital 100% garantizado',
            description: 'Tu inversión está protegida por nuestro fondo de reserva',
          },
          {
            icon: country.flagEmoji,
            title: `100% ${demonym}`,
            description: 'Una plataforma desarrollada por expertos financieros locales',
          },
        ],
      },
      testimonials: {
        title: 'Ya',
        titleHighlight: 'lo lograron',
        items: [
          {
            name: name1,
            location: city1,
            text: '¡En menos de un mes después de inscribirme, ya había recuperado mi inversión. Ahora es pura ganancia!',
            img: 'https://randomuser.me/api/portraits/women/44.jpg',
          },
          {
            name: name2,
            location: city2,
            text: `Soy taxista. Con ${BRAND_NAME}, mejoro mis ingresos sin ningún esfuerzo. Los pagos llegan todos los días.`,
            img: 'https://randomuser.me/api/portraits/men/32.jpg',
          },
          {
            name: name3,
            location: city3,
            text: 'Al principio era escéptica. Mi hija me inscribió. 3 meses después, ya había retirado 3 veces mi inversión. ¡Increíble!',
            img: 'https://randomuser.me/api/portraits/women/68.jpg',
          },
        ],
      },
      urgency: {
        title: '⏰ OFERTA ESPECIAL – ÚLTIMAS HORAS ⏰',
        subtitle: 'La oferta especial "Ingreso Garantizado" cierra en:',
        spotsPrefix: 'Solo quedan',
        spotsText: `lugares disponibles a ${a.newPrice}`,
        ctaButton: '🚀 RESERVAR MI LUGAR AHORA',
      },
      ctaFinal: {
        title: 'No dejes pasar esta oportunidad',
        subtitle: 'Miles de personas ya transformaron su vida financiera. ¡Es tu turno!',
        button: '💎 UNIRME AHORA',
      },
      footer: {
        badge: 'Sitio Oficial',
        line1: "CapitalUnido es una plataforma de inversión innovadora que permite a sus miembros generar ingresos diarios.",
        line2: `📞 Soporte al cliente: ${country.regulators[0]?.phone || 'Contactar al soporte'}`,
        line3: `${country.flagEmoji} Únete a una comunidad de más de 50,000 inversores ${country.flagEmoji}`,
        tagline: `Únete a miles de personas que han transformado su vida financiera con ${BRAND_NAME}.`,
        copyright: `© 2026 ${BRAND_NAME} — Todos los derechos reservados`,
        compliance: `🔒 Sitio seguro | 🛡️ Protección de datos | 📱 Soporte 24/7`,
      },
    },
  };

  return table[lang];
}