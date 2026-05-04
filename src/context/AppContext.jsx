import { createContext, useContext, useReducer, useEffect } from 'react';

const STORAGE_KEY = 'collins_appointment_data';

const initialState = {
  // Visit type / nature of visit
  visitNature: null,
  selectedPage: 'nature-of-visit',
  step: 1,

  // Body map
  bodyPart: null,
  bodyPartName: null,
  duration: '',
  sex: '',
  age: '',
  onsetDate: '',

  // Symptoms
  selectedSymptoms: [],

  // Emergency
  emergencySymptom: null,
  isEmergency: false,
  isCriticalEmergency: false,

  // Details
  symptomDetails: '',

  // Treatment / medication
  medicationUsed: 'no',
  medicationText: '',
  examinedBefore: 'no',
  examText: '',

  // Personal info
  personalInfo: {
    onBehalf: false,
    firstName: '',
    lastName: '',
    dob: '',
    countryCode: '+353',
    phoneNumber: '',
    address: '',
    email: '',
    landline: '',
    postalCode: '',
    medicalCard: '',
    contactSms: true,
    contactEmail: false,
    contactPhone: true,
    consentGiven: false,
    signature: null,
  },

  // COVID booster specific
  covidData: null,

  // Submission tracking
  currentStep: 1,
  lastUpdated: null,
  completionProgress: '',
  submittedAt: null,
  submissionId: null,
};

function loadFromStorage() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      return { ...initialState, ...data, personalInfo: { ...initialState.personalInfo, ...(data.personalInfo || {}) } };
    }
  } catch (e) {
    console.error('Error loading from sessionStorage:', e);
  }
  return { ...initialState };
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_VISIT_NATURE':
      return { ...state, visitNature: action.payload, step: 1, selectedPage: 'nature-of-visit' };

    case 'SET_BODY_PART':
      return { ...state, bodyPart: action.payload.id, bodyPartName: action.payload.name };

    case 'SET_DURATION':
      return { ...state, duration: action.payload };

    case 'SET_SEX':
      return { ...state, sex: action.payload };

    case 'SET_AGE':
      return { ...state, age: action.payload };

    case 'SET_ONSET_DATE':
      return { ...state, onsetDate: action.payload };

    case 'TOGGLE_SYMPTOM': {
      const { name, category } = action.payload;
      const existing = state.selectedSymptoms.findIndex(s => s.name === name && s.category === category);
      if (existing !== -1) {
        return { ...state, selectedSymptoms: state.selectedSymptoms.filter((_, i) => i !== existing) };
      }
      return { ...state, selectedSymptoms: [...state.selectedSymptoms, { name, category }] };
    }

    case 'CLEAR_SYMPTOMS':
      return { ...state, selectedSymptoms: [] };

    case 'SET_SYMPTOM_DETAILS':
      return { ...state, symptomDetails: action.payload };

    case 'SET_EMERGENCY':
      return {
        ...state,
        emergencySymptom: action.payload.value,
        isEmergency: action.payload.isEmergency,
        isCriticalEmergency: action.payload.isCritical,
      };

    case 'SET_MEDICATION':
      return { ...state, medicationUsed: action.payload };

    case 'SET_MEDICATION_TEXT':
      return { ...state, medicationText: action.payload };

    case 'SET_EXAMINED':
      return { ...state, examinedBefore: action.payload };

    case 'SET_EXAM_TEXT':
      return { ...state, examText: action.payload };

    case 'SET_PERSONAL_INFO':
      return { ...state, personalInfo: { ...state.personalInfo, ...action.payload } };

    case 'SET_SIGNATURE':
      return { ...state, personalInfo: { ...state.personalInfo, signature: action.payload } };

    case 'SET_COVID_DATA':
      return { ...state, covidData: action.payload };

    case 'SET_STEP':
      return { ...state, currentStep: action.payload };

    case 'SUBMIT': {
      const submissionId = `CMP-${Date.now().toString().slice(8)}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
      return {
        ...state,
        submittedAt: new Date().toISOString(),
        submissionId,
        currentStep: 8,
      };
    }

    case 'RESET':
      return { ...initialState };

    case 'LOAD_STORAGE':
      return { ...action.payload };

    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState, loadFromStorage);

  // Save to sessionStorage on every state change
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving to sessionStorage:', e);
    }
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
