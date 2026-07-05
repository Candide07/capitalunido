import { Translation } from '../data/translations';
import { CountryConfig, BRAND_NAME } from '../data/countries';

interface TestimonialsProps {
  t: Translation;
  country: CountryConfig;
}

const Testimonials = ({ t, country }: TestimonialsProps) => {
  // Couleurs personnalisées selon le pays
  const getColors = () => {
    switch (country.code) {
      case 'pe':
        return {
          titleGradient: 'from-[#D91023] to-[#fcd116]',
          cardBg: 'from-white/10 to-white/5',
          cardBorder: 'border-[#D91023]/30',
          cardHoverBorder: 'hover:border-[#D91023]',
          cardShadow: 'hover:shadow-[#D91023]/30',
          glowBg: 'from-[#D91023]/10',
          starsColor: 'text-[#D91023]',
          checkBg: 'from-[#D91023]/20 to-[#D91023]/10',
          checkBorder: 'border-[#D91023]/30',
          checkColor: 'text-[#D91023]',
          imgGlow: 'from-[#D91023] via-[#fcd116] to-[#D91023]',
          imgBorder: 'border-[#D91023]/50',
          imgHoverBorder: 'group-hover:border-[#D91023]',
          locationColor: 'text-[#D91023]/80',
          textColor: 'text-white/90',
          nameColor: 'text-white',
        };
      case 'mx':
        return {
          titleGradient: 'from-[#006341] to-[#CE1126]',
          cardBg: 'from-white/10 to-white/5',
          cardBorder: 'border-[#006341]/30',
          cardHoverBorder: 'hover:border-[#006341]',
          cardShadow: 'hover:shadow-[#006341]/30',
          glowBg: 'from-[#006341]/10',
          starsColor: 'text-[#006341]',
          checkBg: 'from-[#006341]/20 to-[#006341]/10',
          checkBorder: 'border-[#006341]/30',
          checkColor: 'text-[#006341]',
          imgGlow: 'from-[#006341] via-[#CE1126] to-[#006341]',
          imgBorder: 'border-[#006341]/50',
          imgHoverBorder: 'group-hover:border-[#006341]',
          locationColor: 'text-[#006341]/80',
          textColor: 'text-white/90',
          nameColor: 'text-white',
        };
      default:
        return {
          titleGradient: 'from-[#fcd116] to-[#ef2b2d]',
          cardBg: 'from-white/10 to-white/5',
          cardBorder: 'border-[#1a3c6e]/30',
          cardHoverBorder: 'hover:border-[#fcd116]',
          cardShadow: 'hover:shadow-[#fcd116]/30',
          glowBg: 'from-[#fcd116]/10',
          starsColor: 'text-[#fcd116]',
          checkBg: 'from-[#009e49]/20 to-[#009e49]/10',
          checkBorder: 'border-[#009e49]/30',
          checkColor: 'text-[#009e49]',
          imgGlow: 'from-[#ef2b2d] via-[#fcd116] to-[#009e49]',
          imgBorder: 'border-[#fcd116]/50',
          imgHoverBorder: 'group-hover:border-[#fcd116]',
          locationColor: 'text-[#fcd116]/80',
          textColor: 'text-white/90',
          nameColor: 'text-white',
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

    // Choisir les témoignages selon le pays
    const testimonialData = country.code === 'pe' ? peTestimonials : mxTestimonials;
    
    // Récupérer les témoignages dans la langue actuelle
    const langMap: Record<string, 'fr' | 'en' | 'es'> = {
      fr: 'fr',
      en: 'en',
      es: 'es',
    };
    const langKey = langMap[t.lang as string] || 'fr';
    
    return testimonialData[langKey] || testimonialData.fr;
  };

  const testimonials = getTestimonials();

  return (
    <div className="mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-in-up text-white">
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
            className={`group bg-gradient-to-br ${colors.cardBg} backdrop-blur-lg border-2 ${colors.cardBorder} rounded-3xl p-6 ${colors.cardHoverBorder} ${colors.cardShadow} transition-all duration-300 card-hover relative overflow-hidden animate-fade-in-up`}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${colors.glowBg} to-transparent rounded-bl-full`}></div>

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`${colors.starsColor} text-xl group-hover:scale-110 transition-transform duration-300`}>
                  ★★★★★
                </div>
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colors.checkBg} flex items-center justify-center border ${colors.checkBorder}`}>
                  <span className={`text-lg ${colors.checkColor}`}>✓</span>
                </div>
              </div>

              <p className={`${colors.textColor} mb-6 leading-relaxed text-[15px]`}>
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${colors.imgGlow} rounded-full blur opacity-0 group-hover:opacity-70 transition-opacity`}></div>
                  <img
                    src={testimonial.img}
                    alt={testimonial.name}
                    className={`relative w-12 h-12 rounded-full object-cover border-2 ${colors.imgBorder} ${colors.imgHoverBorder} transition-all shadow-lg`}
                  />
                </div>
                <div>
                  <div className={`font-bold ${colors.nameColor}`}>{testimonial.name}</div>
                  <div className={`text-xs ${colors.locationColor} flex items-center gap-1`}>
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