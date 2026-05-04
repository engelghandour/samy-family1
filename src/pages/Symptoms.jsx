import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import BookingHeader from '../components/BookingHeader';


const localSymptomsDB = {
  head: [
    "Headache", "Dizziness", "Facial pain", "Ear pain", "Eye pain",
    "Blurred vision", "Ringing in ears", "Nosebleed", "Scalp tenderness",
    "Facial swelling", "Jaw pain", "Tooth pain", "Hair loss",
  ],
  chest: [
    "Chest pain", "Shortness of breath", "Palpitations", "Cough",
    "Wheezing", "Heartburn", "Tightness", "Pain when breathing",
    "Crackling sound", "Sweating", "Anxiety",
  ],
  abdomen: [
    "Abdominal pain", "Nausea", "Bloating", "Cramping", "Heartburn",
    "Indigestion", "Gas", "Tenderness", "Swelling", "Pain after eating",
  ],
  pelvis: [
    "Pelvic pain", "Lower back pain", "Hip pain", "Groin pain",
    "Pain during intercourse", "Urinary frequency", "Constipation",
  ],
  left_arm: [
    "Arm pain", "Weakness", "Numbness", "Swelling", "Redness",
    "Limited movement", "Pain radiating", "Muscle ache",
  ],
  right_arm: [
    "Arm pain", "Weakness", "Numbness", "Swelling", "Redness",
    "Limited movement", "Pain radiating", "Muscle ache",
  ],
  left_leg: [
    "Leg pain", "Swelling", "Numbness", "Weakness", "Cramping",
    "Varicose veins", "Restless legs", "Pain when walking",
  ],
  right_leg: [
    "Leg pain", "Swelling", "Numbness", "Weakness", "Cramping",
    "Varicose veins", "Restless legs", "Pain when walking",
  ],
  neck: [
    "Neck pain", "Stiffness", "Limited movement", "Swollen glands",
    "Tenderness", "Clicking sound", "Pain radiating to arm",
  ],
  genitals: [
    "Pain", "Itching", "Discharge", "Bleeding", "Swelling",
    "Lump", "Burning sensation", "Rash", "Ulceration",
  ],
  default: [
    "Pain", "Swelling", "Redness", "Itching", "Burning",
    "Numbness", "Tingling", "Stiffness", "Weakness",
  ],
};

const generalSymptomsDB = [
  "Fever", "Fatigue", "Weight loss", "Weight gain", "Night sweats",
  "Chills", "Loss of appetite", "Sleep problems", "Mood changes",
  "Anxiety", "Depression", "Memory problems", "Confusion",
  "Thirst", "Dry mouth", "Muscle aches", "Joint pain",
];

const differentLocationSymptomsDB = [
  "Confusion", "Constipation", "Diarrhoea", "Difficulty seeing",
  "Difficulty walking", "Dry mouth", "Headache", "Heartburn",
  "Limited movement", "Muscle ache", "Muscle weakness", "Nausea",
  "Numbness", "Poo leak (incontinence)", "Sore throat", "Stiffness",
  "Symptoms worsen with exertion", "Vomiting", "Warmth",
];

function getDurationText(duration) {
  const map = {
    less_than_24h: '< 24 hours',
    '1_to_3_days': '1-3 days',
    '4_to_7_days': '4-7 days',
    '8_to_14_days': '8-14 days',
    '2_to_4_weeks': '2-4 weeks',
    '1_to_3_months': '1-3 months',
    more_than_3_months: '> 3 months',
  };
  return map[duration] || '-';
}

export default function Symptoms() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const [selectedSymptoms, setSelectedSymptoms] = useState(state.selectedSymptoms || []);

  const bodyPartName = state.bodyPartName || 'selected location';
  const localSymptoms = state.bodyPart && localSymptomsDB[state.bodyPart]
    ? localSymptomsDB[state.bodyPart]
    : localSymptomsDB.default;

  const toggleSymptom = useCallback((name, category) => {
    setSelectedSymptoms((prev) => {
      const existingIndex = prev.findIndex((s) => s.name === name && s.category === category);
      if (existingIndex !== -1) {
        const removed = prev[existingIndex];
        const updated = prev.filter((_, i) => i !== existingIndex);
        if (window.showToast) window.showToast(`Removed: ${removed.name}`, 'info');
        return updated;
      }
      if (window.showToast) window.showToast(`Added: ${name}`, 'success');
      return [...prev, { name, category }];
    });
  }, []);

  const removeSymptom = useCallback((index) => {
    setSelectedSymptoms((prev) => {
      const removed = prev[index];
      const updated = prev.filter((_, i) => i !== index);
      if (window.showToast) window.showToast(`Removed: ${removed.name}`, 'info');
      return updated;
    });
  }, []);

  const clearAllSymptoms = useCallback(() => {
    if (selectedSymptoms.length === 0) {
      if (window.showToast) window.showToast('No symptoms to clear', 'warning');
      return;
    }
    setSelectedSymptoms([]);
    if (window.showToast) window.showToast('All symptoms cleared', 'success');
  }, [selectedSymptoms]);

  const handleNext = () => {
    if (selectedSymptoms.length === 0) {
      if (window.showToast) window.showToast('Please select at least one symptom', 'warning');
      return;
    }
    dispatch({ type: 'CLEAR_SYMPTOMS' });
    selectedSymptoms.forEach((s) => dispatch({ type: 'TOGGLE_SYMPTOM', payload: s }));
    navigate('/emergency');
  };

  const handlePrev = () => {
    navigate('/body-map');
  };

  const localCount = selectedSymptoms.filter((s) => s.category === 'local').length;
  const generalCount = selectedSymptoms.filter((s) => s.category === 'general').length;
  const differentCount = selectedSymptoms.filter((s) => s.category === 'different').length;
  const totalCount = selectedSymptoms.length;

  const SymptomCard = ({ name, category }) => {
    const isSelected = selectedSymptoms.some((s) => s.name === name && s.category === category);
    return (
      <div
        className={`symptom-card ${isSelected ? 'selected' : ''}`}
        onClick={() => toggleSymptom(name, category)}
        data-symptom={name}
        data-category={category}
      >
        <div className="symptom-icon">
          <i className={`fas ${category === 'local' ? 'fa-dot-circle' : category === 'general' ? 'fa-heartbeat' : 'fa-exchange-alt'}`}></i>
        </div>
        <span className="symptom-name">{name}</span>
        <div className="symptom-check"></div>
      </div>
    );
  };

  return (
    <div className="app-wrapper">
      <div className="main-container">
                <BookingHeader
          icon="fa-notes-medical"
          subtitle={<><i className="fas fa-stethoscope"></i> Symptom Assessment System</>}
        >
          <div className="patient-summary" id="patientSummary">
            <span><i className="fas fa-venus-mars"></i> {state.sex ? state.sex.charAt(0).toUpperCase() + state.sex.slice(1) : '-'}</span>
            <span><i className="fas fa-birthday-cake"></i> {state.age || '-'} years</span>
            <span><i className="fas fa-map-marker-alt"></i> {bodyPartName}</span>
            <span><i className="fas fa-calendar"></i> {getDurationText(state.duration)}</span>
          </div>
        </BookingHeader>


        <main className="content-section">
          <div className="progress-tracker">
            <div className="progress-bar">
              <div className="progress-step completed"><div className="progress-circle">1</div><div className="progress-label">Visit Type</div></div>
              <div className="progress-line filled"></div>
              <div className="progress-step completed"><div className="progress-circle">2</div><div className="progress-label">Body Map</div></div>
              <div className="progress-line filled"></div>
              <div className="progress-step active"><div className="progress-circle">3</div><div className="progress-label">Symptoms</div></div>
              <div className="progress-line"></div>
              <div className="progress-step"><div className="progress-circle">4</div><div className="progress-label">Emergency</div></div>
              <div className="progress-line"></div>
              <div className="progress-step"><div className="progress-circle">5</div><div className="progress-label">Details</div></div>
            </div>
            <div className="progress-title">
              <i className="fas fa-list-ul"></i> Step 3 of 5: Select your primary symptoms
            </div>
          </div>
          <div className="symptoms-container">
            {/* Local Symptoms */}
            <div className="symptom-section animate-fadeUp">
              <div className="section-header">
                <div className="section-icon">
                  <i className="fas fa-map-pin"></i>
                </div>
                <h2>Symptoms in <span id="locationName">{bodyPartName}</span></h2>
                <p><span className="badge">{localCount}</span> selected</p>
              </div>
              <div className="symptoms-grid">
                {localSymptoms.map((symptom) => (
                  <SymptomCard key={`local-${symptom}`} name={symptom} category="local" />
                ))}
              </div>
            </div>

            {/* General Symptoms */}
            <div className="symptom-section animate-fadeUp">
              <div className="section-header">
                <div className="section-icon">
                  <i className="fas fa-heartbeat"></i>
                </div>
                <h2>General Symptoms</h2>
                <p><span className="badge">{generalCount}</span> selected</p>
              </div>
              <div className="symptoms-grid">
                {generalSymptomsDB.map((symptom) => (
                  <SymptomCard key={`general-${symptom}`} name={symptom} category="general" />
                ))}
              </div>
            </div>

            {/* Different Location Symptoms */}
            <div className="symptom-section animate-fadeUp">
              <div className="section-header">
                <div className="section-icon">
                  <i className="fas fa-exchange-alt"></i>
                </div>
                <h2>Symptoms in a Different Location</h2>
                <p><span className="badge">{differentCount}</span> selected</p>
              </div>
              <div className="symptoms-grid">
                {differentLocationSymptomsDB.map((symptom) => (
                  <SymptomCard key={`different-${symptom}`} name={symptom} category="different" />
                ))}
              </div>
            </div>

            {/* Selected Summary */}
            <div className="selected-summary">
              <h4><i className="fas fa-check-circle"></i> Selected Symptoms (<span id="totalSelectedCount">{totalCount}</span>)</h4>
              <div className="selected-tags">
                {totalCount === 0 ? (
                  <span style={{ color: 'var(--gray-500)' }}>No symptoms selected yet</span>
                ) : (
                  selectedSymptoms.map((symptom, index) => (
                    <div className="selected-tag" key={`tag-${symptom.name}-${index}`}>
                      <i className="fas fa-tag"></i> {symptom.name}
                      <button onClick={() => removeSymptom(index)}><i className="fas fa-times"></i></button>
                    </div>
                  ))
                )}
              </div>
              <button className="clear-all-btn" onClick={clearAllSymptoms}>
                <i className="fas fa-trash-alt"></i> Clear All
              </button>
            </div>
          </div>

          <div className="button-container">
            <button className="btn btn-secondary" onClick={handlePrev}>
              <i className="fas fa-arrow-left"></i> Previous
            </button>
            <button className="btn btn-primary" onClick={handleNext} disabled={totalCount === 0}>
              Next <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </main>

        <footer className="footer-section">
          <div className="footer-links">
            <a href="#"><i className="fas fa-file-contract"></i> Terms of Use</a>
            <a href="#"><i className="fas fa-lock"></i> Privacy Policy</a>
            <a href="#"><i className="fas fa-universal-access"></i> Accessibility Statement</a>
          </div>
          <div className="copyright">
            <p>© 2026 Collins Medical Practice. All rights reserved. | Symptom Assessment System</p>
            <p style={{ marginTop: 6 }}>© 2026 Klinik Healthcare Solutions UK Ltd</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
