import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import BookingHeader from '../components/BookingHeader';


export default function ThankYou() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const [requestId, setRequestId] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const submissionData = state;

  // Generate request ID and confetti on mount
  useEffect(() => {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    const id = `CMP-${timestamp}-${random}`;
    setRequestId(id);

    // Create confetti
    createConfetti();

    // Show toast
    setTimeout(() => {
      if (window.showToast) {
        window.showToast(`✅ Request ${id} submitted successfully! Check your ${submissionData.personalInfo?.contactSms ? 'SMS' : ''} ${submissionData.personalInfo?.contactSms && submissionData.personalInfo?.contactEmail ? 'or' : ''} ${submissionData.personalInfo?.contactEmail ? 'email' : ''} for updates.`, 'success');
      }
    }, 800);
  }, []);

  const createConfetti = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3'];
    for (let i = 0; i < 120; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.width = Math.random() * 8 + 4 + 'px';
      confetti.style.height = Math.random() * 8 + 4 + 'px';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      confetti.style.animationDuration = Math.random() * 2 + 2 + 's';
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 4000);
    }
  };

  const personalInfo = submissionData.personalInfo || {};
  const selectedSymptoms = submissionData.selectedSymptoms || [];
  const uniqueSymptoms = [...new Map(selectedSymptoms.map((s) => [s.name, s])).values()];
  const bodyPartName = submissionData.bodyPartName || 'Not specified';
  const duration = submissionData.duration || '';
  const symptomDetails = submissionData.symptomDetails || '';
  const medicationUsed = submissionData.medicationUsed || 'no';
  const medicationText = submissionData.medicationText || '';
  const examinedBefore = submissionData.examinedBefore || 'no';
  const examText = submissionData.examText || '';
  const isEmergency = submissionData.isEmergency || false;

  const durationText = {
    less_than_24h: '< 24 hours',
    '1_to_3_days': '1-3 days',
    '4_to_7_days': '4-7 days',
    '8_to_14_days': '8-14 days',
    '2_to_4_weeks': '2-4 weeks',
    '1_to_3_months': '1-3 months',
    more_than_3_months: '> 3 months',
  }[duration] || 'Not specified';

  const handleStarClick = (rating) => {
    if (feedbackSubmitted) {
      if (window.showToast) window.showToast('Feedback already submitted!', 'warning');
      return;
    }
    setSelectedRating(rating);
    setFeedbackMessage(`You selected ${rating} star${rating > 1 ? 's' : ''}. Click submit to confirm.`);
  };

  const submitFeedback = () => {
    if (feedbackSubmitted) {
      if (window.showToast) window.showToast('You have already submitted feedback for this request!', 'warning');
      return;
    }
    if (selectedRating === 0) {
      if (window.showToast) window.showToast('Please select a rating first', 'warning');
      setFeedbackMessage('Please select a rating (1-5 stars) before submitting.');
      return;
    }
    setFeedbackSubmitted(true);
    setFeedbackMessage(`✅ Thank you for your ${selectedRating} star rating! Your feedback helps us improve our service.`);
    if (window.showToast) window.showToast(`Thank you for your ${selectedRating} star rating!`, 'success');
  };

  const copyRequestId = () => {
    navigator.clipboard.writeText(requestId).then(() => {
      if (window.showToast) window.showToast(`Request ID ${requestId} copied to clipboard!`, 'success');
    }).catch(() => {
      if (window.showToast) window.showToast('Failed to copy', 'error');
    });
  };

  const printSummary = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Collins Medical Practice - Request Summary ${requestId}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          h1 { color: #1e293b; }
          .summary-card { border: 1px solid #ddd; padding: 15px; margin-bottom: 20px; border-radius: 10px; }
          .value { margin: 6px 0; }
          .header { text-align: center; margin-bottom: 30px; }
          .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #666; }
          .symptoms-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
          .symptom-badge { background: #e0e7ff; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Samy Family Practice</h1>
          <p>Request Summary - ${requestId}</p>
          <p>Submitted: ${new Date().toLocaleString()}</p>
        </div>
        <div id="printContent">${document.getElementById('summaryGrid').innerHTML}</div>
        <div class="footer">
          <p>This is an automated summary of your appointment request.</p>
          <p>Please keep this for your records.</p>
          <p>Samy Family Practice - Cavan, Ireland</p>
        </div>
        <script>window.onload = function() { window.print(); window.close(); };<\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const downloadJSON = () => {
    const exportData = {
      requestId,
      exportedAt: new Date().toISOString(),
      exportedAtLocal: new Date().toLocaleString(),
      submissionData,
    };
    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `collins-request-${requestId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (window.showToast) window.showToast('Request data downloaded successfully!', 'success');
  };

  const exitToHomepage = () => {
    dispatch({ type: 'RESET' });
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    setTimeout(() => navigate('/'), 300);
  };

  return (
    <div className="app-wrapper">
      <div className="main-container">

          <BookingHeader
          icon="fa-check-circle"
          subtitle={<><i className="fas fa-stethoscope"></i> Request Submitted Successfully</>}
          badgeText="Confirmation Sent"
          badgeColor="#10b981"
          badgeIcon="fa-check-circle"
        />

        <main className="content-section">
          <div className="success-card">
            {/* Success Header */}
            <div className="success-header">
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h2>Thank You! Your request has been sent.</h2>
              <p>Your request has been sent to Samy Family Practice. A member of our team will review your information shortly.</p>

              <div className="request-id-box">
                <span><i className="fas fa-hashtag"></i> CONFIRMATION NUMBER</span>
                <strong>{requestId}</strong>
                <button
                  onClick={copyRequestId}
                  style={{ background: 'none', border: 'none', color: 'var(--success)', cursor: 'pointer', marginTop: 8, fontSize: 12, display: 'block', margin: '8px auto 0' }}
                >
                  <i className="fas fa-copy"></i> Copy
                </button>
              </div>
            </div>

            {/* Data Flow Info */}
            <div className="info-section dataflow-box" style={{ margin: '0 32px 24px 32px' }}>
              <i className="fas fa-chart-line"></i>
              <div className="info-section-content">
                <h4><i className="fas fa-question-circle"></i> Where does my data go?</h4>
                <p><strong>Your request has been securely submitted to the samy  family Practice clinical team.</strong> The data is:</p>
                <ul style={{ marginTop: 10, marginLeft: 20, color: 'var(--gray-400)', fontSize: 13 }}>
                  <li>✅ <strong>Stored locally</strong> in your browser's localStorage (for your reference)</li>
                  <li>✅ <strong>Sent to samy family Practice's secure server</strong> (simulated - in production, this would be an API call)</li>
                  <li>✅ <strong>Reviewed by our clinical team</strong> - A GP or nurse will assess your symptoms</li>
                  <li>✅ <strong>Added to our patient queue</strong> - You will be contacted via your preferred method (SMS/Phone/Email)</li>
                </ul>
                <p style={{ marginTop: 10 }}><strong>Response time:</strong> Urgent requests before 4pm: same day | Routine queries: within 48 working hours</p>
              </div>
            </div>

            {/* Summary Section */}
            <div className="summary-section">
              <h3><i className="fas fa-clipboard-list"></i> Request Summary</h3>
              <div className="summary-grid" id="summaryGrid">
                {/* Patient Information */}
                <div className="summary-card">
                  <h4><i className="fas fa-user"></i> Patient Information</h4>
                  <div className="value"><i className="fas fa-user"></i> {personalInfo.firstName || 'N/A'} {personalInfo.lastName || ''}</div>
                  <div className="value"><i className="fas fa-calendar"></i> DOB: {personalInfo.dob || 'N/A'}</div>
                  <div className="value"><i className="fas fa-phone"></i> {personalInfo.countryCode || '+353'} {personalInfo.phoneNumber || 'N/A'}</div>
                  <div className="value"><i className="fas fa-map-marker-alt"></i> {personalInfo.address || 'N/A'}</div>
                  {personalInfo.email && <div className="value"><i className="fas fa-envelope"></i> {personalInfo.email}</div>}
                </div>

                {/* Clinical Information */}
                <div className="summary-card">
                  <h4><i className="fas fa-stethoscope"></i> Clinical Information</h4>
                  <div className="value"><i className="fas fa-map-pin"></i> Symptom Location: {bodyPartName}</div>
                  <div className="value"><i className="fas fa-clock"></i> Duration: {durationText}</div>
                  <div className="value"><i className="fas fa-venus-mars"></i> Sex: {submissionData.sex ? submissionData.sex.charAt(0).toUpperCase() + submissionData.sex.slice(1) : 'N/A'}</div>
                  <div className="value"><i className="fas fa-birthday-cake"></i> Age: {submissionData.age || 'N/A'} years</div>
                  {isEmergency && <div className="value" style={{ color: 'var(--warning)' }}><i className="fas fa-exclamation-triangle"></i> ⚠️ EMERGENCY SYMPTOMS DETECTED</div>}
                </div>

                {/* Symptoms & Description */}
                <div className="summary-card">
                  <h4><i className="fas fa-notes-medical"></i> Symptoms & Description</h4>
                  {uniqueSymptoms.length > 0 ? (
                    <div className="symptoms-list">
                      {uniqueSymptoms.slice(0, 10).map((s, i) => (
                        <span className="symptom-badge" key={i}><i className="fas fa-tag"></i> {s.name}</span>
                      ))}
                      {uniqueSymptoms.length > 10 && <span className="symptom-badge">+{uniqueSymptoms.length - 10} more</span>}
                    </div>
                  ) : (
                    <span className="value">No symptoms selected</span>
                  )}
                  {symptomDetails && <div className="value" style={{ marginTop: 12 }}><i className="fas fa-align-left"></i> Description: {symptomDetails.substring(0, 120)}{symptomDetails.length > 120 ? '...' : ''}</div>}
                </div>

                {/* Previous Treatment */}
                <div className="summary-card">
                  <h4><i className="fas fa-prescription-bottle"></i> Previous Treatment</h4>
                  <div className="value"><i className="fas fa-capsules"></i> Medication Used: {medicationUsed === 'yes' ? 'Yes' : 'No'}</div>
                  {medicationUsed === 'yes' && medicationText && <div className="value" style={{ marginTop: 8, fontSize: 12, color: 'var(--gray-400)' }}>{medicationText.substring(0, 100)}{medicationText.length > 100 ? '...' : ''}</div>}
                  <div className="value" style={{ marginTop: 8 }}><i className="fas fa-user-md"></i> Prior Examination: {examinedBefore === 'yes' ? 'Yes' : 'No'}</div>
                  {examinedBefore === 'yes' && examText && <div className="value" style={{ marginTop: 8, fontSize: 12, color: 'var(--gray-400)' }}>{examText.substring(0, 100)}{examText.length > 100 ? '...' : ''}</div>}
                </div>

                {/* Contact Preferences */}
                <div className="summary-card">
                  <h4><i className="fas fa-envelope"></i> Contact Preferences</h4>
                  <div className="value"><i className="fas fa-sms"></i> SMS: {personalInfo.contactSms ? 'Yes' : 'No'}</div>
                  <div className="value"><i className="fas fa-envelope"></i> Email: {personalInfo.contactEmail ? 'Yes' : 'No'}</div>
                  <div className="value"><i className="fas fa-phone"></i> Phone Call: {personalInfo.contactPhone ? 'Yes' : 'No'}</div>
                  {personalInfo.medicalCard && <div className="value" style={{ marginTop: 8 }}><i className="fas fa-id-card"></i> Medical Card: {personalInfo.medicalCard === 'yes' ? 'Yes' : personalInfo.medicalCard === 'no' ? 'No' : 'Applied'}</div>}
                </div>

                {/* Submission Details */}
                <div className="summary-card">
                  <h4><i className="fas fa-info-circle"></i> Submission Details</h4>
                  <div className="value"><i className="fas fa-hashtag"></i> Request ID: {requestId}</div>
                  <div className="value"><i className="fas fa-calendar-check"></i> Submitted: {new Date().toLocaleString()}</div>
                  <div className="value"><i className="fas fa-clock"></i> Expected Response: Within 48 hours</div>
                  <div className="value"><i className="fas fa-database"></i> Data stored securely in practice system</div>
                </div>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="info-section" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', margin: '0 32px 24px 32px' }}>
              <i className="fas fa-exclamation-triangle" style={{ color: 'var(--warning)' }}></i>
              <div className="info-section-content">
                <h4>⚠️ Important! Emergency Contacts</h4>
                <p>Our primary means of contacting you is via SMS or phone call. If you provided your email address, you will receive an automatic confirmation.</p>
                <div className="contact-numbers">
                  <span className="contact-number"><i className="fas fa-phone"></i> Emergency: 999</span>
                  <span className="contact-number"><i className="fas fa-phone-alt"></i> NEDOC: 1850 777 911</span>
                  <span className="contact-number"><i className="fas fa-hospital"></i> Cavan A&E: (049) 437 6000</span>
                </div>
              </div>
            </div>

            {/* Feedback Section */}
            <div className="feedback-section">
              <h4><i className="fas fa-star"></i> Rate your experience with our digital service</h4>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <i
                    key={rating}
                    className={`fas fa-star star ${selectedRating >= rating ? 'active' : ''}`}
                    onClick={() => handleStarClick(rating)}
                    onMouseEnter={(e) => {
                      if (!feedbackSubmitted) {
                        document.querySelectorAll('.star').forEach((s, i) => {
                          if (i < rating) s.style.color = '#f59e0b';
                        });
                      }
                    }}
                    onMouseLeave={() => {
                      if (!feedbackSubmitted) {
                        document.querySelectorAll('.star').forEach((s, i) => {
                          if (i < selectedRating && selectedRating > 0) {
                            s.style.color = '#f59e0b';
                          } else {
                            s.style.color = '';
                          }
                        });
                      }
                    }}
                  />
                ))}
              </div>
              <button
                className="btn btn-primary"
                onClick={submitFeedback}
                disabled={feedbackSubmitted}
                style={feedbackSubmitted ? { opacity: 0.6, cursor: 'not-allowed', margin: '0 auto' } : { margin: '0 auto' }}
              >
                {feedbackSubmitted ? (
                  <><i className="fas fa-check-circle"></i> Feedback Submitted</>
                ) : (
                  <><i className="fas fa-paper-plane"></i> Submit Feedback</>
                )}
              </button>
              {feedbackMessage && (
                <div className="feedback-message" style={{ color: feedbackSubmitted ? 'var(--success)' : selectedRating > 0 ? 'var(--warning)' : 'var(--error)' }}>
                  {feedbackMessage}
                </div>
              )}
            </div>

            {/* Button Group */}
            <div className="button-group">
              <button className="btn btn-secondary" onClick={printSummary}>
                <i className="fas fa-print"></i> Print Summary
              </button>
              <button className="btn btn-primary" onClick={exitToHomepage}>
                <i className="fas fa-home"></i> Return to Homepage
              </button>
              <button className="btn btn-warning" onClick={downloadJSON}>
                <i className="fas fa-download"></i> Download Request (JSON)
              </button>
            </div>
          </div>
        </main>

        <footer className="footer-section">
          <div className="footer-links">
            <a href="#"><i className="fas fa-file-contract"></i> Terms of Use</a>
            <a href="#"><i className="fas fa-lock"></i> Privacy Policy</a>
            <a href="#"><i className="fas fa-universal-access"></i> Accessibility Statement</a>
            <a href="#"><i className="fas fa-database"></i> Data Protection Policy</a>
          </div>
          <div className="copyright">
            <p>© 2026 Collins Medical Practice. All rights reserved. | GDPR Compliant | Secure Patient Portal</p>
            <p style={{ marginTop: 6 }}>This is a simulated system. In production, data would be encrypted and sent to practice servers.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
