import { Translation } from '../data/translations';
import { CountryConfig, BRAND_NAME } from '../data/countries';

interface TestimonialsProps {
  t: Translation;
  country: CountryConfig;
  lang: 'fr' | 'en' | 'es'; // 👈 NOUVEAU
}

const Testimonials = ({ t, country, lang }: TestimonialsProps) => {
  // Couleurs personnalisées selon le pays - VERSION CLAIRE
  const getColors = () => {
    switch (country.code) {
      case 'pe':
        return {
          titleGradient: 'from-[#6b2737] to-[#c9a227]',
          cardBg: 'bg-white/95 backdrop-blur-sm',
          cardBorder: 'border-[#6b2737]/20',
          cardHoverBorder: 'hover:border-[#6b2737]',
          cardShadow: 'shadow-lg hover:shadow-xl',
          glowBg: 'from-[#6b2737]/5',
          starsColor: 'text-[#6b2737]',
          checkBg: 'from-[#6b2737]/10 to-[#6b2737]/5',
          checkBorder: 'border-[#6b2737]/20',
          checkColor: 'text-[#6b2737]',
          imgGlow: 'from-[#6b2737] via-[#c9a227] to-[#6b2737]',
          imgBorder: 'border-[#6b2737]/30',
          imgHoverBorder: 'group-hover:border-[#6b2737]',
          locationColor: 'text-gray-500',
          textColor: 'text-gray-700',
          nameColor: 'text-gray-900',
          bgGradient: 'from-[#fdf6f0] via-[#fff5eb] to-[#fdf0e6]',
        };
      case 'mx':
        return {
          titleGradient: 'from-[#2f6f4e] to-[#CE1126]',
          cardBg: 'bg-white/95 backdrop-blur-sm',
          cardBorder: 'border-[#2f6f4e]/20',
          cardHoverBorder: 'hover:border-[#2f6f4e]',
          cardShadow: 'shadow-lg hover:shadow-xl',
          glowBg: 'from-[#2f6f4e]/5',
          starsColor: 'text-[#2f6f4e]',
          checkBg: 'from-[#2f6f4e]/10 to-[#2f6f4e]/5',
          checkBorder: 'border-[#2f6f4e]/20',
          checkColor: 'text-[#2f6f4e]',
          imgGlow: 'from-[#2f6f4e] via-[#CE1126] to-[#2f6f4e]',
          imgBorder: 'border-[#2f6f4e]/30',
          imgHoverBorder: 'group-hover:border-[#2f6f4e]',
          locationColor: 'text-gray-500',
          textColor: 'text-gray-700',
          nameColor: 'text-gray-900',
          bgGradient: 'from-[#f0f7f0] via-[#f5faf5] to-[#e8f5e8]',
        };
      default:
        return {
          titleGradient: 'from-[#c9a227] to-[#ef2b2d]',
          cardBg: 'bg-white/95 backdrop-blur-sm',
          cardBorder: 'border-[#6b2737]/20',
          cardHoverBorder: 'hover:border-[#c9a227]',
          cardShadow: 'shadow-lg hover:shadow-xl',
          glowBg: 'from-[#c9a227]/5',
          starsColor: 'text-[#c9a227]',
          checkBg: 'from-[#009e49]/10 to-[#009e49]/5',
          checkBorder: 'border-[#009e49]/20',
          checkColor: 'text-[#009e49]',
          imgGlow: 'from-[#ef2b2d] via-[#c9a227] to-[#009e49]',
          imgBorder: 'border-[#c9a227]/30',
          imgHoverBorder: 'group-hover:border-[#c9a227]',
          locationColor: 'text-gray-500',
          textColor: 'text-gray-700',
          nameColor: 'text-gray-900',
          bgGradient: 'from-[#f8fafc] via-[#e6f0fa] to-[#f0f9ff]',
        };
    }
  };

  const colors = getColors();

  // Témoignages personnalisés selon le pays et la langue
  const getTestimonials = () => {
    const peTestimonials = {
      fr: [
        {
          name: 'Rosa M.',
          location: 'Miraflores, Lima',
          text: "Moins d'un mois après mon inscription, j'avais déjà récupéré mon investissement. Maintenant c'est que du bénéfice !",
          img: 'https://randomuser.me/api/portraits/women/44.jpg',
        },
        {
          name: 'Carlos H.',
          location: 'Arequipa',
          text: `Je suis chauffeur de taxi. Avec ${BRAND_NAME}, j'arrondis mes fins de mois sans aucun effort. Les paiements tombent tous les jours.`,
          img: 'https://randomuser.me/api/portraits/men/32.jpg',
        },
        {
          name: 'Fiorella T.',
          location: 'Trujillo',
          text: "Au début j'étais sceptique. Ma fille m'a inscrite. 3 mois après, j'avais retiré 3 fois ma mise. Incroyable !",
          img: 'https://randomuser.me/api/portraits/women/68.jpg',
        },
      ],
      en: [
        {
          name: 'Rosa M.',
          location: 'Miraflores, Lima',
          text: "Less than a month after joining, I had already recovered my investment. Now it's pure profit!",
          img: 'https://randomuser.me/api/portraits/women/44.jpg',
        },
        {
          name: 'Carlos H.',
          location: 'Arequipa',
          text: `I'm a taxi driver. With ${BRAND_NAME}, I supplement my income with zero effort. Payments come every day.`,
          img: 'https://randomuser.me/api/portraits/men/32.jpg',
        },
        {
          name: 'Fiorella T.',
          location: 'Trujillo',
          text: 'At first I was skeptical. My daughter signed me up. 3 months later, I had withdrawn 3 times my investment. Unbelievable!',
          img: 'https://randomuser.me/api/portraits/women/68.jpg',
        },
      ],
      es: [
        {
          name: 'Rosa M.',
          location: 'Miraflores, Lima',
          text: '¡En menos de un mes después de inscribirme, ya había recuperado mi inversión. Ahora es pura ganancia!',
          img: 'https://randomuser.me/api/portraits/women/44.jpg',
        },
        {
          name: 'Carlos H.',
          location: 'Arequipa',
          text: `Soy taxista. Con ${BRAND_NAME}, mejoro mis ingresos sin ningún esfuerzo. Los pagos llegan todos los días.`,
          img: 'https://randomuser.me/api/portraits/men/32.jpg',
        },
        {
          name: 'Fiorella T.',
          location: 'Trujillo',
          text: 'Al principio era escéptica. Mi hija me inscribió. 3 meses después, ya había retirado 3 veces mi inversión. ¡Increíble!',
          img: 'https://randomuser.me/api/portraits/women/68.jpg',
        },
      ],
    };

    const mxTestimonials = {
      fr: [
        {
          name: 'Alejandra R.',
          location: 'Polanco, CDMX',
          text: "J'ai commencé avec un petit investissement et en 2 mois j'avais déjà doublé ma mise. Le meilleur placement que j'ai jamais fait !",
          img: 'https://randomuser.me/api/portraits/women/33.jpg',
        },
        {
          name: 'Miguel Á.',
          location: 'Guadalajara',
          text: `Je travaille dans le commerce et ${BRAND_NAME} m'a permis de diversifier mes revenus. Les paiements sont ponctuels et le service client est excellent.`,
          img: 'https://randomuser.me/api/portraits/men/45.jpg',
        },
        {
          name: 'Daniela G.',
          location: 'Monterrey',
          text: "Je ne connaissais rien aux investissements. L'équipe m'a guidée pas à pas et aujourd'hui je gagne plus qu'avec mon travail à temps plein !",
          img: 'https://randomuser.me/api/portraits/women/55.jpg',
        },
      ],
      en: [
        {
          name: 'Alejandra R.',
          location: 'Polanco, CDMX',
          text: "I started with a small investment and in 2 months I had already doubled my money. The best investment I've ever made!",
          img: 'https://randomuser.me/api/portraits/women/33.jpg',
        },
        {
          name: 'Miguel Á.',
          location: 'Guadalajara',
          text: `I work in retail and ${BRAND_NAME} has allowed me to diversify my income. Payments are punctual and customer service is excellent.`,
          img: 'https://randomuser.me/api/portraits/men/45.jpg',
        },
        {
          name: 'Daniela G.',
          location: 'Monterrey',
          text: "I knew nothing about investments. The team guided me step by step and today I earn more than with my full-time job!",
          img: 'https://randomuser.me/api/portraits/women/55.jpg',
        },
      ],
      es: [
        {
          name: 'Alejandra R.',
          location: 'Polanco, CDMX',
          text: 'Empecé con una inversión pequeña y en 2 meses ya había duplicado mi dinero. ¡La mejor inversión que he hecho!',
          img: 'https://randomuser.me/api/portraits/women/33.jpg',
        },
        {
          name: 'Miguel Á.',
          location: 'Guadalajara',
          text: `Trabajo en el comercio y ${BRAND_NAME} me ha permitido diversificar mis ingresos. Los pagos son puntuales y el servicio al cliente es excelente.`,
          img: 'https://randomuser.me/api/portraits/men/45.jpg',
        },
        {
          name: 'Daniela G.',
          location: 'Monterrey',
          text: 'No sabía nada de inversiones. El equipo me guió paso a paso y hoy gano más que con mi trabajo de tiempo completo. ¡Increíble!',
          img: 'https://randomuser.me/api/portraits/women/55.jpg',
        },
      ],
    };

    const testimonialData = country.code === 'pe' ? peTestimonials : mxTestimonials;
    
    // 👈 Utiliser la prop lang directement
    return testimonialData[lang] || testimonialData.fr;
  };

  const testimonials = getTestimonials();

  return (
    <div className="mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-in-up text-gray-900">
        {t.testimonials.title}{' '}
        <span className={`bg-gradient-to-r ${colors.titleGradient} bg-clip-text text-transparent`}>
          {t.testimonials.titleHighlight}
        </span>
        {' '}{BRAND_NAME}
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className={`group ${colors.cardBg} border ${colors.cardBorder} rounded-2xl p-6 ${colors.cardShadow} transition-all duration-300 hover:scale-[1.02] relative overflow-hidden animate-fade-in-up`}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${colors.glowBg} to-transparent rounded-bl-full opacity-50`}></div>

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`${colors.starsColor} text-xl`}>
                  ★★★★★
                </div>
                <div className={`w-8 h-8 rounded-full ${colors.checkBg} flex items-center justify-center border ${colors.checkBorder}`}>
                  <span className={`text-sm ${colors.checkColor}`}>✓</span>
                </div>
              </div>

              <p className={`${colors.textColor} mb-6 leading-relaxed text-[15px] italic`}>
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="relative flex-shrink-0">
                  <div className={`absolute inset-0 bg-gradient-to-r ${colors.imgGlow} rounded-full blur opacity-0 group-hover:opacity-40 transition-opacity`}></div>
                  <img
                    src={testimonial.img}
                    alt={testimonial.name}
                    className={`relative w-12 h-12 rounded-full object-cover border-2 ${colors.imgBorder} ${colors.imgHoverBorder} transition-all shadow-md`}
                    loading="lazy"
                  />
                </div>
                <div>
                  <div className={`font-semibold ${colors.nameColor}`}>{testimonial.name}</div>
                  <div className={`text-sm ${colors.locationColor} flex items-center gap-1`}>
                    <span>📍</span>
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;