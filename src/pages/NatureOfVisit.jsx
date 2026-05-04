import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import BookingHeader from '../components/BookingHeader';

const visitOptions = [
  { value: 'new_symptoms', icon: 'fa-notes-medical', title: 'Appointment for NEW SYMPTOMS', desc: 'First time experiencing these symptoms' },
  { value: 'existing_symptoms', icon: 'fa-history', title: 'Appointment for PRE-EXISTING SYMPTOMS', desc: 'Follow-up or recurring condition' },
  { value: 'covid_booster', icon: 'fa-syringe', title: 'COVID Booster Vaccine Registration', desc: 'Schedule your booster dose' },
  { value: 'children_flu', icon: 'fa-child', title: "Children's Nasal Flu Vaccine", desc: 'Registration & consent for children' },
  { value: 'nurse_appointment', icon: 'fa-user-nurse', title: 'Nurse Appointment Request', desc: 'Blood pressure, wound care, injections' },
  { value: 'flu_vaccine', icon: 'fa-shield-virus', title: 'Flu Vaccine Registration', desc: 'Annual influenza vaccination' },
  { value: 'test_results', icon: 'fa-flask', title: 'Test Results', desc: 'Blood tests, X-rays, scans follow-up' },
  { value: 'cancel_appointment', icon: 'fa-calendar-times', title: 'Cancelling an Appointment', desc: 'Reschedule or cancel existing booking' },
  { value: 'self_care', icon: 'fa-heartbeat', title: 'Self Care - NHS Health A-Z', desc: 'Health information & advice' },
  { value: 'work_certificate', icon: 'fa-briefcase', title: 'Work & Social Welfare Certificate', desc: 'Medical certificates & forms' },
  { value: 'general_enquiries', icon: 'fa-envelope', title: 'General Enquiries', desc: 'Administrative questions & feedback' },
];

export default function NatureOfVisit() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [selected, setSelected] = useState(state.visitNature || null);

  useEffect(() => {
    if (state.visitNature) {
      setSelected(state.visitNature);
    }
  }, [state.visitNature]);

  const handleSelect = (value) => {
    setSelected(value);
    dispatch({ type: 'SET_VISIT_NATURE', payload: value });
  };

  const handleNext = () => {
    if (!selected) return;

    if (selected === 'self_care') {
      window.open('https://www.nhs.uk/conditions/', '_blank');
      return;
    }

    if (selected === 'covid_booster') {
      navigate('/covid-booster');
      return;
    }

    if (selected === 'new_symptoms' || selected === 'existing_symptoms') {
      navigate('/body-map');
      return;
    }

    navigate('/personal');
  };

  return (
    <div className="app-wrapper">
      <div className="main-container">

          <BookingHeader
          icon="fa-clipboard-list"
          subtitle={<><i className="fas fa-hospital"></i> Online Registration System</>}
          badgeText="Open for Online Registration"
          badgeColor="#10b981"
          badgeIcon="fa-circle"
        />


      <main className="main-content">
        <div className="progress-tracker">
          <div className="progress-bar">
            <div className="progress-step active">
              <div className="progress-circle">1</div>
              <div className="progress-label">Visit Type</div>
            </div>
            <div className="progress-line"></div>
            <div className="progress-step">
              <div className="progress-circle">2</div>
              <div className="progress-label">Body Map</div>
            </div>
            <div className="progress-line"></div>
            <div className="progress-step">
              <div className="progress-circle">3</div>
              <div className="progress-label">Symptoms</div>
            </div>
            <div className="progress-line"></div>
            <div className="progress-step">
              <div className="progress-circle">4</div>
              <div className="progress-label">Emergency</div>
            </div>
            <div className="progress-line"></div>
            <div className="progress-step">
              <div className="progress-circle">5</div>
              <div className="progress-label">Details</div>
            </div>
          </div>
          <div className="progress-title">
            <i className="fas fa-clipboard-list"></i> Step 1 of 5: Select the nature of your visit
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <i className="fas fa-stethoscope"></i>
            <h3>Select the nature of your visit</h3>
          </div>

          <div className="info-badge">
            <i className="fas fa-info-circle"></i>
            This service is only available to patients registered with Collins Medical Practice. You do not need any login details. We aim to deal with all urgent requests and appointment requests submitted before 4 pm on the same working day and all other routine queries within 48 working hours.
          </div>

          <div className="option-grid">
            {visitOptions.map((option) => (
              <div
                key={option.value}
                className={`option-card ${selected === option.value ? 'selected' : ''}`}
                onClick={() => handleSelect(option.value)}
              >
                <span className="option-icon"><i className={`fas ${option.icon}`}></i></span>
                <span className="option-name">{option.title}</span>
                <span className="option-desc">{option.desc}</span>
                <div className="option-check"></div>
              </div>
            ))}
          </div>

          <div className="btn-group">
            <button className="btn btn-secondary" disabled>
              <i className="fas fa-arrow-left"></i> Previous
            </button>
            <button className="btn btn-primary" onClick={handleNext} disabled={!selected}>
              Next <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </main>

      <footer className="main-footer">
        <p>© 2026 Collins Medical Practice. All rights reserved. | Powered by Klinik Healthcare Solutions UK Ltd</p>
      </footer>
      </div>
    </div>
  );
}
