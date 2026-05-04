import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import BookingHeader from '../components/BookingHeader';


const STEPS = {
  1: 'Vaccine Info & Consent',
  2: 'Medical Screening',
  3: 'Personal Details',
  4: 'Contact & Submit',
};

const STEP_TITLES = {
  1: 'Step 1 of 4: Vaccine Information & Consent',
  2: 'Step 2 of 4: Medical Screening Questionnaire',
  3: 'Step 3 of 4: Personal Information',
  4: 'Step 4 of 4: Contact Preferences & Submit',
};

export default function CovidBooster() {
  const navigate = useNavigate();
  const { state } = useApp();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    consentRead: false,
    consentNoQuestions: false,
    consentVaccine: false,
    consentData: false,
    consentResearch: false,
    seriousReaction: null,
    allergies: null,
    epipen: null,
    bloodThinner: null,
    firstName: '',
    lastName: '',
    dob: '',
    countryCode: '+353',
    phoneNumber: '',
    address: '',
    email: '',
    medicalCard: '',
    contactSms: true,
    contactEmail: false,
    contactPhone: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    if (currentStep === 1) return formData.consentRead && formData.consentNoQuestions && formData.consentVaccine;
    if (currentStep === 2) return formData.seriousReaction && formData.allergies && formData.epipen && formData.bloodThinner;
    if (currentStep === 3) return formData.firstName && formData.lastName && formData.dob && formData.phoneNumber && formData.address;
    if (currentStep === 4) return formData.consentData;
    return false;
  };

  const handleNext = () => {
    if (!canProceed()) {
      if (currentStep === 1 && window.showToast) window.showToast('Please complete all required consent checkboxes', 'warning');
      else if (currentStep === 2 && window.showToast) window.showToast('Please answer all screening questions', 'warning');
      else if (currentStep === 3 && window.showToast) window.showToast('Please complete all required personal information fields', 'warning');
      return;
    }
    if (currentStep === 4) {
      handleSubmit();
      return;
    }
    setCurrentStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    if (!formData.consentData) {
      if (window.showToast) window.showToast('Please confirm the data processing agreement', 'warning');
      return;
    }
    setIsSubmitting(true);
    const submission = {
      requestId: 'VAC-' + Date.now().toString().slice(-8) + '-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
      type: 'COVID_BOOSTER',
      submittedAt: new Date().toISOString(),
      formData,
    };
    setTimeout(() => {
      setIsSubmitting(false);
      if (window.showToast) window.showToast(`✅ Vaccination registration submitted successfully! Reference: ${submission.requestId}`, 'success');
      setTimeout(() => navigate('/'), 2000);
    }, 1500);
  };

  const renderStep1 = () => (
    <>
      <div className="eligibility-card">
        <i className="fas fa-clipboard-list" style={{ fontSize: 32, color: 'var(--covid-blue)' }}></i>
        <p style={{ marginTop: 12, fontSize: 14 }}>Before proceeding, please check if you are eligible for the COVID-19 booster vaccine.</p>
        <a href="#" className="eligibility-link" target="_blank" rel="noopener noreferrer">
          <i className="fas fa-external-link-alt"></i> Check Eligibility Criteria
        </a>
      </div>

      <div className="info-card">
        <h3><i className="fas fa-info-circle"></i> Vaccine Information</h3>
        <p><strong>Vaccine purpose:</strong> This is to reduce your risk of being infected with coronavirus and to reduce your risk of becoming seriously unwell with coronavirus.</p>
        <p><strong>Most side effects are mild and should not last longer than a week, such as:</strong></p>
        <div className="side-effects-grid">
          <div className="side-effect-item"><i className="fas fa-hand-peace"></i> Sore arm at injection site</div>
          <div className="side-effect-item"><i className="fas fa-bed"></i> Feeling tired or fatigued</div>
          <div className="side-effect-item"><i className="fas fa-head-side-medical"></i> Headache</div>
          <div className="side-effect-item"><i className="fas fa-bone"></i> Muscle aches / joint pain</div>
          <div className="side-effect-item"><i className="fas fa-temperature-high"></i> Mild fever</div>
          <div className="side-effect-item"><i className="fas fa-stomach"></i> Nausea</div>
        </div>
        <p><small><i className="fas fa-info-circle"></i> You can take painkillers, such as paracetamol, if you need to manage side effects.</small></p>
        <div className="warning-alert">
          <i className="fas fa-exclamation-triangle"></i> <strong>Important:</strong> It's very rare for anyone to have a serious reaction to the vaccine (e.g. anaphylaxis). If this does happen, it usually happens within minutes - Staff giving the vaccine are trained to deal with allergic reactions and treat them immediately.
        </div>
        <div className="warning-alert alert-orange" style={{ marginTop: 12 }}>
          <i className="fas fa-heartbeat"></i> <strong>Medical Note:</strong> You must not have had myocarditis or pericarditis (heart inflammation) deemed secondary to a previous COVID-19 vaccination.
        </div>
        <p style={{ marginTop: 16 }}>
          For a full list of possible side effects please <a href="#" style={{ color: 'var(--covid-blue)', textDecoration: 'none', fontWeight: 600 }}><i className="fas fa-link"></i> click here</a> to read the complete information sheet.
        </p>
      </div>

      <div className="consent-section">
        <h3 style={{ marginBottom: 20 }}><i className="fas fa-file-signature"></i> Informed Consent</h3>
        <p style={{ marginBottom: 20, fontSize: 14, color: 'var(--gray-400)' }}>
          Please confirm that you have read and understood the above information, have no more questions to ask and are consenting to receiving your COVID-19 booster vaccine.
        </p>
        <label className="consent-checkbox">
          <input type="checkbox" checked={formData.consentRead} onChange={(e) => updateField('consentRead', e.target.checked)} />
          <span className="consent-text"><strong>✓ I confirm that I have read and understood the vaccine information and potential side effects</strong></span>
        </label>
        <label className="consent-checkbox">
          <input type="checkbox" checked={formData.consentNoQuestions} onChange={(e) => updateField('consentNoQuestions', e.target.checked)} />
          <span className="consent-text"><strong>✓ I have no further questions to ask about the vaccine at this time</strong></span>
        </label>
        <label className="consent-checkbox">
          <input type="checkbox" checked={formData.consentVaccine} onChange={(e) => updateField('consentVaccine', e.target.checked)} />
          <span className="consent-text"><strong>✓ I freely consent to receiving the COVID-19 booster vaccine</strong></span>
        </label>
        <label className="consent-checkbox">
          <input type="checkbox" checked={formData.consentData} onChange={(e) => updateField('consentData', e.target.checked)} />
          <span className="consent-text"><strong>✓ I consent to my data being used for vaccination records and follow-up care</strong></span>
        </label>
        <label className="consent-checkbox">
          <input type="checkbox" checked={formData.consentResearch} onChange={(e) => updateField('consentResearch', e.target.checked)} />
          <span className="consent-text"><i className="fas fa-flask"></i> I consent to my anonymised data being used for vaccine research purposes (Optional)</span>
        </label>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="info-card" style={{ marginBottom: 24, background: 'rgba(59,130,246,0.05)' }}>
        <h3><i className="fas fa-stethoscope"></i> Pre-Vaccination Screening</h3>
        <p>Please answer the following questions honestly. This information helps our clinical team ensure the vaccine is safe for you.</p>
      </div>

      {[
        { id: 'seriousReaction', icon: 'fa-ambulance', label: 'Have you ever had any serious reaction to a vaccination in the past where you needed to go to hospital?' },
        { id: 'allergies', icon: 'fa-allergies', label: 'Have you ever had any allergies or anaphylaxis reaction to any medicines, food, or an allergic reaction that has resulted in hospitalisation?' },
        { id: 'epipen', icon: 'fa-syringe', label: 'Do you carry an EpiPen or equivalent emergency allergy medication?' },
        { id: 'bloodThinner', icon: 'fa-capsules', label: 'Are you currently taking any blood thinning medication (anticoagulant)? Examples: Warfarin, Apixaban, Rivaroxaban, Clopidogrel.' },
      ].map((q) => (
        <div className="question-card" key={q.id}>
          <div className="question-title"><i className={`fas ${q.icon}`}></i> {q.label}</div>
          <div className="radio-group">
            <div
              className={`radio-option ${formData[q.id] === 'yes' ? 'selected' : ''}`}
              onClick={() => updateField(q.id, 'yes')}
            >
              <div className="radio-custom"></div>
              <span>✅ Yes</span>
            </div>
            <div
              className={`radio-option ${formData[q.id] === 'no' ? 'selected' : ''}`}
              onClick={() => updateField(q.id, 'no')}
            >
              <div className="radio-custom"></div>
              <span>❌ No</span>
            </div>
          </div>
        </div>
      ))}

      <div className="info-card" style={{ marginTop: 16, background: 'rgba(245,158,11,0.05)' }}>
        <i className="fas fa-info-circle"></i> <strong>Note:</strong> If you answered YES to any of the above questions, our clinical team will review your responses. You may receive a call from a nurse before your vaccination appointment.
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <div className="info-card" style={{ marginBottom: 24 }}>
        <h3><i className="fas fa-user-circle"></i> Patient Information</h3>
        <p>Please provide your accurate personal details. This information is required for vaccination registration and will be kept confidential.</p>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label><i className="fas fa-user"></i> First Name <span className="required-star">*</span></label>
          <input type="text" value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} placeholder="Enter your first name" />
        </div>
        <div className="form-group">
          <label><i className="fas fa-user"></i> Last Name <span className="required-star">*</span></label>
          <input type="text" value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} placeholder="Enter your last name" />
        </div>
        <div className="form-group">
          <label><i className="fas fa-calendar-alt"></i> Date of Birth <span className="required-star">*</span></label>
          <input type="date" value={formData.dob} onChange={(e) => updateField('dob', e.target.value)} />
        </div>
        <div className="form-group">
          <label><i className="fas fa-phone-alt"></i> Mobile Phone Number <span className="required-star">*</span></label>
          <div className="phone-input-group">
            <select className="country-code" value={formData.countryCode} onChange={(e) => updateField('countryCode', e.target.value)}>
              <option value="+353">🇮🇪 +353 (Ireland)</option>
              <option value="+44">🇬🇧 +44 (UK)</option>
              <option value="+1">🇺🇸 +1 (US/Canada)</option>
              <option value="+61">🇦🇺 +61 (Australia)</option>
              <option value="+49">🇩🇪 +49 (Germany)</option>
              <option value="+33">🇫🇷 +33 (France)</option>
              <option value="+34">🇪🇸 +34 (Spain)</option>
              <option value="+39">🇮🇹 +39 (Italy)</option>
            </select>
            <input type="tel" value={formData.phoneNumber} onChange={(e) => updateField('phoneNumber', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="86123456" />
          </div>
          <small style={{ color: 'var(--gray-500)', fontSize: 11 }}><i className="fas fa-info-circle"></i> Example: 086123456 should be entered as 86123456</small>
        </div>
        <div className="form-group full-width">
          <label><i className="fas fa-home"></i> Street Address <span className="required-star">*</span></label>
          <input type="text" value={formData.address} onChange={(e) => updateField('address', e.target.value)} placeholder="Enter your full street address" />
        </div>
        <div className="form-group full-width">
          <label><i className="fas fa-envelope"></i> Email Address <span className="optional-badge">Optional but recommended</span></label>
          <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="youremail@example.com" />
        </div>
        <div className="form-group">
          <label><i className="fas fa-id-card"></i> Medical Card Status</label>
          <select value={formData.medicalCard} onChange={(e) => updateField('medicalCard', e.target.value)}>
            <option value="">Select one</option>
            <option value="yes">✅ Yes, I have a valid medical card</option>
            <option value="no">❌ No, I do not have a medical card</option>
            <option value="applied">⏳ Applied, waiting for approval</option>
          </select>
        </div>
      </div>
    </>
  );

  const renderStep4 = () => (
    <>
      <div className="info-card" style={{ marginBottom: 24 }}>
        <h3><i className="fas fa-envelope"></i> Communication Preferences</h3>
        <p>Please let us know how you would like to be contacted regarding your vaccination appointment.</p>
      </div>

      <div className="form-group">
        <label><i className="fas fa-bell"></i> Please contact me via:</label>
        <div className="contact-group">
          <label className="contact-option">
            <input type="checkbox" checked={formData.contactSms} onChange={(e) => updateField('contactSms', e.target.checked)} />
            <i className="fas fa-sms fa-lg"></i> SMS Text Message
          </label>
          <label className="contact-option">
            <input type="checkbox" checked={formData.contactEmail} onChange={(e) => updateField('contactEmail', e.target.checked)} />
            <i className="fas fa-envelope fa-lg"></i> Email
          </label>
          <label className="contact-option">
            <input type="checkbox" checked={formData.contactPhone} onChange={(e) => updateField('contactPhone', e.target.checked)} />
            <i className="fas fa-phone fa-lg"></i> Phone Call
          </label>
        </div>
      </div>

      <div className="info-card" style={{ background: 'rgba(59,130,246,0.05)', margin: '20px 0' }}>
        <i className="fas fa-clock"></i> <strong>Response Time Information</strong>
        <p style={{ marginTop: 8, fontSize: 13 }}>We aim to deal with all urgent requests and appointment requests submitted before 4 pm on the same working day and all other routine queries within 48 working hours.</p>
        <p style={{ marginTop: 10, fontSize: 13 }}>Your request will be assessed by a member of our team. This may result in a receptionist calling you to arrange an appointment, or the GP may call you to discuss your medical issue.</p>
        <p style={{ marginTop: 10, fontSize: 13, color: 'var(--warning)' }}><i className="fas fa-exclamation-triangle"></i> Our primary means of contacting you is via SMS or phone call. If you provided your email address, you will receive an automatic confirmation.</p>
      </div>

      <div className="consent-section" style={{ marginTop: 20 }}>
        <h3 style={{ marginBottom: 16 }}><i className="fas fa-database"></i> Data Processing Agreement</h3>
        <p style={{ fontSize: 13, marginBottom: 16 }}>
          The basis on which we provide you with our services and the associated use of your personal data are set out in our terms of use and privacy notice. We do not rely upon your consent in order to undertake the automated healthcare assessment.
        </p>
        <label className="consent-checkbox">
          <input type="checkbox" checked={formData.consentData} onChange={(e) => updateField('consentData', e.target.checked)} />
          <span className="consent-text"><strong>I confirm that I have read and agree to the data processing terms</strong></span>
        </label>
      </div>
    </>
  );

  return (
    <div className="app-wrapper">
      <div className="main-container">
                <BookingHeader
          icon="fa-syringe"
          subtitle={<><i className="fas fa-shield-virus"></i> COVID-19 Vaccination Programme</>}
          badgeText="Booster Dose Registration"
          badgeColor="#3b82f6"
          badgeIcon="fa-virus"
        />



        <main className="content-section">
          <div className="page-title">
            <h2>COVID Booster Vaccine Registration</h2>
            <p>Please complete the registration form to schedule your COVID-19 booster vaccination</p>
          </div>
          <div className="progress-tracker">
            <div className="progress-bar">
              <div className="progress-step active"><div className="progress-circle">1</div><div className="progress-label">Vaccine Info & Consent</div></div>
              <div className="progress-line"></div>
              <div className="progress-step"><div className="progress-circle">2</div><div className="progress-label">Medical Screening</div></div>
              <div className="progress-line"></div>
              <div className="progress-step"><div className="progress-circle">3</div><div className="progress-label">Personal Details</div></div>
              <div className="progress-line"></div>
              <div className="progress-step"><div className="progress-circle">4</div><div className="progress-label">Contact & Submit</div></div>
            </div>
            <div className="progress-title">
              <i className="fas fa-info-circle"></i> Step 1 of 4: Vaccine Information & Consent
            </div>
          </div>
          <div className="form-card animate-fadeUp">
            <div className="form-header">
              <h2><i className="fas fa-notes-medical"></i> COVID Booster Registration</h2>
              <p>Please complete all steps to register for your COVID-19 booster vaccine</p>
            </div>
            <div className="form-body">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
            </div>
            <div className="button-container">
              <button className="btn btn-secondary" onClick={handlePrev} disabled={currentStep === 1}>
                <i className="fas fa-arrow-left"></i> Previous
              </button>
              <button className="btn btn-primary" onClick={handleNext} disabled={!canProceed() || isSubmitting}>
                {isSubmitting ? 'Submitting...' : currentStep === 4 ? 'Submit Registration' : 'Next'} <i className={`fas ${currentStep === 4 ? 'fa-paper-plane' : 'fa-arrow-right'}`}></i>
              </button>
            </div>
          </div>
        </main>

        <footer className="footer-section">
          <div className="footer-links">
            <a href="#"><i className="fas fa-file-contract"></i> Terms of Use</a>
            <a href="#"><i className="fas fa-lock"></i> Privacy Policy</a>
            <a href="#"><i className="fas fa-universal-access"></i> Accessibility Statement</a>
            <a href="#"><i className="fas fa-database"></i> GDPR Compliant</a>
          </div>
          <div className="copyright">
            <p>© 2026 Collins Medical Practice. All rights reserved. | COVID-19 Vaccination Programme</p>
            <p style={{ marginTop: 6 }}>© 2026 Klinik Healthcare Solutions UK Ltd | Secure Online Registration</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
