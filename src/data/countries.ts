export type CountryCode = 'pe' | 'mx';

export interface Regulator {
  name: string;
  phone: string;
}

export interface CountryConfig {
  code: CountryCode;
  label: string;
  flagEmoji: string;
  flagColors: [string, string, string, string];
  currencySymbol: string;
  currencyCode: string;
  cities: [string, string, string];
  testimonialNames: [string, string, string];
  banks: string[];
  idLabel: { fr: string; en: string; es: string };
  idPlaceholder: string;
  phonePlaceholder: string;
  regulators: Regulator[];
  amounts: {
    monthlyIncome: string;
    oldPrice: string;
    newPrice: string;
    premiumPrice: string;
    dailyMin: string;
    dailyMax: string;
    savings: string;
    discountPercent: number;
    spotsLeft: number;
    membersThisWeek: number;
    statsMembers: number;
    statsPaidMillions: number;
    statsSatisfaction: number;
    statsWithdrawals: number;
  };
}

export const countries: Record<CountryCode, CountryConfig> = {
  pe: {
    code: 'pe',
    label: 'PERÚ',
    flagEmoji: '🇵🇪',
    flagColors: ['#D91023', '#FFFFFF', '#FFFFFF', '#D91023'],
    currencySymbol: 'S/',
    currencyCode: 'PEN',
    cities: ['Miraflores, Lima', 'Arequipa', 'Trujillo'],
    testimonialNames: ['Rosa M.', 'Carlos H.', 'Fiorella T.'],
    banks: [
      'BCP (Banco de Crédito del Perú)',
      'BBVA Perú',
      'Interbank',
      'Scotiabank Perú',
      'BanBif',
      'Banco Pichincha',
      'Caja Municipal',
      'Otro',
    ],
    idLabel: { fr: 'Numéro de DNI', en: 'DNI number', es: 'Número de DNI' },
    idPlaceholder: 'Ej: 12345678',
    phonePlaceholder: 'Ej: +51 9XX XXX XXX',
    regulators: [
      { name: 'INDECOPI', phone: '224-7777 (Lima) / 0-800-4-4040 (regiones)' },
      { name: 'SBS Perú', phone: '0-800-10840' },
    ],
    amounts: {
      monthlyIncome: 'S/ 2,500',
      oldPrice: 'S/ 500',
      newPrice: 'S/ 49',          // ~2.7% du salaire moyen (S/1,800)
      premiumPrice: 'S/ 199',      // ~11% du salaire moyen
      dailyMin: 'S/ 35',
      dailyMax: 'S/ 95',
      savings: 'S/ 451',
      discountPercent: 90,
      spotsLeft: 12,
      membersThisWeek: 6341,
      statsMembers: 42318,
      statsPaidMillions: 18,
      statsSatisfaction: 99,
      statsWithdrawals: 230,
    },
  },
  mx: {
    code: 'mx',
    label: 'MÉXICO',
    flagEmoji: '🇲🇽',
    flagColors: ['#006341', '#FFFFFF', '#FFFFFF', '#CE1126'],
    currencySymbol: '$',
    currencyCode: 'MXN',
    cities: ['Polanco, CDMX', 'Guadalajara', 'Monterrey'],
    testimonialNames: ['Alejandra R.', 'Miguel Á.', 'Daniela G.'],
    banks: [
      'BBVA México',
      'Banorte',
      'Santander México',
      'Citibanamex',
      'HSBC México',
      'Banco Azteca',
      'Nu México',
      'Otro',
    ],
    idLabel: { fr: 'Numéro CURP', en: 'CURP number', es: 'Número de CURP' },
    idPlaceholder: 'Ej: ABCD123456HDFXYZ01',
    phonePlaceholder: 'Ej: +52 55 XXXX XXXX',
    regulators: [
      { name: 'CONDUSEF', phone: '01 800 999 8080' },
      { name: 'CNBV', phone: '01 800 999 8080' },
    ],
    amounts: {
      monthlyIncome: '$12,500',
      oldPrice: '$1,000',
      newPrice: '$99',            // ~0.9% du salaire moyen ($10,500)
      premiumPrice: '$399',        // ~3.8% du salaire moyen
      dailyMin: '$200',
      dailyMax: '$550',
      savings: '$901',
      discountPercent: 90,
      spotsLeft: 8,
      membersThisWeek: 8452,
      statsMembers: 58206,
      statsPaidMillions: 72,
      statsSatisfaction: 99,
      statsWithdrawals: 230,
    },
  },
};

export const BRAND_NAME = 'CapitalUnido';