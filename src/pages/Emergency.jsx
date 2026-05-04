import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import BookingHeader from '../components/BookingHeader';


const emergencyOptions = [
  { value: 'none', name: 'None of these', description: 'I am not experiencing any emergency symptoms', emergency: false, critical: false, icon: 'fa-check-circle', cardClass: 'none-card' },
  { value: 'bleeding_unstoppable', name: '🩸 Bleeding that will not stop', description: 'Severe bleeding that continues despite pressure', emergency: true, critical: true, icon: 'fa-tint', cardClass: 'critical-card' },
  { value: 'bleeding_no_cause', name: '🩸 Bleeding without obvious cause', description: 'Unexplained bleeding from any body part', emergency: true, critical: true, icon: 'fa-tint', cardClass: 'critical-card' },
  { value: 'blood_thinner', name: '💊 Blood-thinning medication', description: 'Taking Warfarin, Apixaban, Rivaroxaban, etc.', emergency: true, critical: false, icon: 'fa-capsules', cardClass: '' },
  { value: 'bruises_no_cause', name: '💜 Multiple bruises without a cause', description: 'Unexplained bruising appearing frequently', emergency: true, critical: false, icon: 'fa-hand-holding-heart', cardClass: '' },
  { value: 'self_care_not_helping', name: '🏥 Self-care is not helping', description: 'Symptoms persist despite home treatment', emergency: true, critical: false, icon: 'fa-band-aid', cardClass: '' },
  { value: 'severe_ongoing_bleeding', name: '⚠️ Severe, ongoing bleeding', description: 'Heavy bleeding that won\'t stop with pressure', emergency: true, critical: true, icon: 'fa-tint', cardClass: 'critical-card' },
  { value: 'sudden_rash', name: '🌡️ Sudden widespread rash', description: 'Rash spreading rapidly across body', emergency: true, critical: false, icon: 'fa-allergies', cardClass: '' },
];

export default function Emergency() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const [selectedValue, setSelectedValue] = useState(state.emergencySymptom || null);
  const [showModal, setShowModal] = useState(false);

  const selectedOption = emergencyOptions.find((o) => o.value === selectedValue);
  const isEmergency = selectedOption?.emergency || false;
  const isCritical = selectedOption?.critical || false;

  const handleSelect = (value) => {
    setSelectedValue(value);
    const option = emergencyOptions.find((o) => o.value === value);
    if (option) {
      dispatch({ type: 'SET_EMERGENCY', payload: { value: option.value, isEmergency: option.emergency, isCritical: option.critical } });
      if (option.emergency) {
        if (window.showToast) window.showToast(`⚠️ Emergency symptom selected: ${option.name}`, 'error');
      } else {
        if (window.showToast) window.showToast(`✅ ${option.name} - Continuing with standard booking`, 'success');
      }
    }
  };

  const handleNext = () => {
    if (!selectedValue) {
      if (window.showToast) window.showToast('Please select an option', 'warning');
      return;
    }
    if (isEmergency) {
      setShowModal(true);
      return;
    }
    navigate('/details');
  };

  const handlePrev = () => {
    navigate('/symptoms');
  };

  const continueWithBooking = () => {
    setShowModal(false);
    navigate('/details');
  };

  return (
    <div className="app-wrapper">
      <div className="main-container">

       <BookingHeader
          icon="fa-ambulance"
          subtitle={<><i className="fas fa-exclamation-triangle"></i> Emergency Symptom Assessment</>}
          badgeText="Urgent Care Check"
          badgeColor="#ef4444"
          badgeIcon="fa-circle"
        />
        <main className="content-section">
          {/* Emergency Warning Banner */}
          <div className="progress-tracker">
            <div className="progress-bar">
              <div className="progress-step completed"><div className="progress-circle">1</div><div className="progress-label">Visit Type</div></div>
              <div className="progress-line filled"></div>
              <div className="progress-step completed"><div className="progress-circle">2</div><div className="progress-label">Body Map</div></div>
              <div className="progress-line filled"></div>
              <div className="progress-step completed"><div className="progress-circle">3</div><div className="progress-label">Symptoms</div></div>
              <div className="progress-line filled"></div>
              <div className="progress-step active"><div className="progress-circle">4</div><div className="progress-label">Emergency</div></div>
              <div className="progress-line"></div>
              <div className="progress-step"><div className="progress-circle">5</div><div className="progress-label">Details</div></div>
            </div>
            <div className="progress-title">
              <i className="fas fa-exclamation-triangle"></i> Step 4 of 5: Emergency Symptom Check
            </div>
            </div>
          <div className="emergency-warning animate-fadeUp">
            <div className="warning-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="warning-text">
              <h3>⚠️ EMERGENCY WARNING</h3>
              <p>The symptoms below may suggest that you need emergency attention. If you have any of these and are submitting your query when the surgery is closed you may not be able to complete your request and may be directed to 999 or NEDOC.</p>
            </div>
            <div className="emergency-contact">
              <a href="tel:999" className="emergency-btn"><i className="fas fa-phone"></i> 999</a>
              <a href="tel:1850777911" className="emergency-btn"><i className="fas fa-phone-alt"></i> NEDOC 1850 777 911</a>
            </div>
          </div>

          {/* Section Header */}
          <div className="section-header animate-fadeUp">
            <h2><i className="fas fa-list-ul"></i> Select any emergency symptoms you are experiencing</h2>
            <p>Please be honest - this helps us prioritize your care appropriately</p>
          </div>

          {/* Emergency Grid */}
          <div className="emergency-grid animate-fadeUp">
            {emergencyOptions.map((option) => (
              <div
                key={option.value}
                className={`emergency-card ${option.cardClass} ${selectedValue === option.value ? 'selected' : ''}`}
                onClick={() => handleSelect(option.value)}
                data-value={option.value}
              >
                <div className="card-icon"><i className={`fas ${option.icon}`}></i></div>
                <div className="card-content">
                  <div className="card-title">{option.name}</div>
                  <div className="card-description">{option.description}</div>
                </div>
                <div className="check-indicator"></div>
              </div>
            ))}
          </div>

          {/* Emergency Action Buttons (shown when emergency selected) */}
          {isEmergency && (
            <div className="action-buttons animate-fadeUp">
              <a href="tel:999" className="btn btn-danger"><i className="fas fa-phone"></i> Call 999 NOW</a>
              <a href="tel:1850777911" className="btn btn-warning"><i className="fas fa-phone-alt"></i> Call NEDOC 1850 777 911</a>
              <button className="btn btn-secondary" onClick={continueWithBooking}><i className="fas fa-arrow-right"></i> Continue with booking</button>
            </div>
          )}

          {/* Regular Navigation Buttons */}
          <div className="button-group" style={{ display: isEmergency ? 'none' : 'flex' }}>
            <button className="btn btn-secondary" onClick={handlePrev}>
              <i className="fas fa-arrow-left"></i> Previous
            </button>
            <button className="btn btn-primary" onClick={handleNext} disabled={!selectedValue}>
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
            <p>© 2026 Collins Medical Practice. All rights reserved. | Emergency Assessment System</p>
            <p style={{ marginTop: 6 }}>If life-threatening, call 999 immediately</p>
          </div>
        </footer>
      </div>

      {/* Redirect Modal */}
      <div className={`redirect-modal ${showModal ? 'active' : ''}`}>
        <div className="modal-content">
          <div className="modal-icon">
            <i className="fas fa-ambulance"></i>
          </div>
          <h3>Emergency Symptoms Detected</h3>
          <p>Based on your selected symptoms, we strongly recommend seeking immediate medical attention. The surgery is currently closed.</p>
          <div className="modal-buttons">
            <a href="tel:999" className="btn btn-danger"><i className="fas fa-phone"></i> Call 999</a>
            <a href="tel:1850777911" className="btn btn-warning"><i className="fas fa-phone-alt"></i> NEDOC</a>
            <button className="btn btn-secondary" onClick={continueWithBooking}>Continue with booking</button>
          </div>
        </div>
      </div>
    </div>
  );
}
