import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import BookingHeader from "../components/BookingHeader";

export default function Personal() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [formData, setFormData] = useState({
    onBehalf: false,
    firstName: "",
    lastName: "",
    dob: "",
    countryCode: "+353",
    phoneNumber: "",
    address: "",
    email: "",
    landline: "",
    postalCode: "",
    medicalCard: "",
    contactSms: true,
    contactEmail: false,
    contactPhone: true,
    consentGiven: false,
  });

  const [signatureSaved, setSignatureSaved] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = 180;

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctxRef.current = ctx;
      ctx.fillStyle = "#fefefe";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#1f2937";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const getCoordinates = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    let x = (clientX - rect.left) * scaleX;
    let y = (clientY - rect.top) * scaleY;
    x = Math.max(0, Math.min(x, canvas.width));
    y = Math.max(0, Math.min(y, canvas.height));
    return { x, y };
  }, []);

  const startDrawing = useCallback(
    (e) => {
      setIsDrawing(true);
      const ctx = ctxRef.current;
      const pos = getCoordinates(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      e.preventDefault();
    },
    [getCoordinates],
  );

  const draw = useCallback(
    (e) => {
      if (!isDrawing) return;
      const ctx = ctxRef.current;
      const pos = getCoordinates(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      e.preventDefault();
    },
    [isDrawing, getCoordinates],
  );

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    const ctx = ctxRef.current;
    ctx.beginPath();
    checkSignature();
  }, []);

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.fillStyle = "#fefefe";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#1f2937";
    setSignatureSaved(false);
    if (window.showToast) window.showToast("Signature cleared", "info");
  }, []);

  const checkSignature = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let hasPixels = false;
    for (let i = 0; i < imageData.data.length; i += 4) {
      if (
        imageData.data[i] !== 254 ||
        imageData.data[i + 1] !== 254 ||
        imageData.data[i + 2] !== 254
      ) {
        hasPixels = true;
        break;
      }
    }
    setSignatureSaved(hasPixels);
  }, []);

  const getSignatureDataURL = useCallback(() => {
    return canvasRef.current.toDataURL("image/png");
  }, []);

  const validateName = (name) =>
    name && name.trim().length >= 2 && /^[a-zA-Z\s\-']+$/.test(name.trim());
  const validateDateOfBirth = (dateString) => {
    if (!dateString) return false;
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    )
      age--;
    return age >= 0 && age <= 120 && !isNaN(birthDate.getTime());
  };
  const validatePhoneNumber = (number) => {
    const cleaned = number.replace(/\s/g, "");
    return cleaned.length >= 7 && /^[0-9+\-()\s]+$/.test(cleaned);
  };
  const validateEmail = (emailStr) =>
    !emailStr || /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(emailStr);
  const validateAddress = (addr) => addr && addr.trim().length >= 5;

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!validateName(formData.firstName))
      newErrors.firstName = "First name is required";
    if (!validateName(formData.lastName))
      newErrors.lastName = "Last name is required";
    if (!validateDateOfBirth(formData.dob))
      newErrors.dob = "Valid date of birth is required";
    if (!validatePhoneNumber(formData.phoneNumber))
      newErrors.phone = "Valid phone number is required (at least 7 digits)";
    if (!validateAddress(formData.address))
      newErrors.address = "Street address is required";
    if (formData.email && !validateEmail(formData.email))
      newErrors.email = "Please enter a valid email address";
    if (!formData.consentGiven)
      newErrors.consent = "You must consent to data processing";
    if (!signatureSaved) newErrors.signature = "Please provide your signature";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, signatureSaved]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      if (window.showToast)
        window.showToast(
          "Please complete all required fields and provide your signature",
          "error",
        );
      return;
    }

    setIsSubmitting(true);

    // Save all data to context
    dispatch({
      type: "SET_PERSONAL_INFO",
      payload: { ...formData, signature: getSignatureDataURL() },
    });

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    if (window.showToast)
      window.showToast(
        "✅ Request submitted successfully! Redirecting...",
        "success",
      );
    setTimeout(() => navigate("/thankyou"), 1500);
  };

  const handlePrev = () => {
    navigate("/details");
  };

  // Set max/min date for DOB
  const today = new Date();
  const maxDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  )
    .toISOString()
    .split("T")[0];
  const minDate = new Date(
    today.getFullYear() - 120,
    today.getMonth(),
    today.getDate(),
  )
    .toISOString()
    .split("T")[0];

  return (
    <div className="app-wrapper">
      <div className="main-container">
        <BookingHeader
          icon="fa-user-circle"
          subtitle={
            <>
              <i className="fas fa-shield-alt"></i> Secure Patient Registration
            </>
          }
          badgeText="GDPR Compliant | Encrypted Data"
          badgeColor="#3b82f6"
          badgeIcon="fa-lock"
        />

        <main className="content-section">
          <div className="progress-tracker">
            <div className="progress-bar">
              <div className="progress-step completed">
                <div className="progress-circle">1</div>
                <div className="progress-label">Visit Type</div>
              </div>
              <div className="progress-line filled"></div>
              <div className="progress-step completed">
                <div className="progress-circle">2</div>
                <div className="progress-label">Body Map</div>
              </div>
              <div className="progress-line filled"></div>
              <div className="progress-step completed">
                <div className="progress-circle">3</div>
                <div className="progress-label">Symptoms</div>
              </div>
              <div className="progress-line filled"></div>
              <div className="progress-step completed">
                <div className="progress-circle">4</div>
                <div className="progress-label">Emergency</div>
              </div>
              <div className="progress-line filled"></div>
              <div className="progress-step completed">
                <div className="progress-circle">5</div>
                <div className="progress-label">Details</div>
              </div>
              <div className="progress-line filled"></div>
              <div className="progress-step active">
                <div className="progress-circle">6</div>
                <div className="progress-label">Personal</div>
              </div>
            </div>
            <div className="progress-title">
              <i className="fas fa-address-card"></i> Step 6 of 6: Personal
              Information & Digital Signature
            </div>
          </div>

          <div className="form-card animate-fadeUp">
            <div className="form-header">
              <h3>
                <i className="fas fa-id-card mr-2"></i>
                Fill in your personal information
              </h3>
              <p>
                Please provide accurate information so we can contact you
                regarding your appointment.
              </p>
            </div>

            <div className="form-body">
              {/* On Behalf Checkbox */}
              {/* <div className="form-group full-width checkbox-option">
                <label className="checkbox-label">
                  <i className="fas fa-users"></i>
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={formData.onBehalf}
                    onChange={(e) =>
                      handleInputChange("onBehalf", e.target.checked)
                    }
                  />
                  I'm filling the form on behalf of another person OR I am a
                  care home worker
                </label>
              </div> */}
              <div className="form-group full-width checkbox-option">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.onBehalf}
                    onChange={(e) =>
                      handleInputChange("onBehalf", e.target.checked)
                    }
                  />
                  <i
                    className="fas fa-users"
                    style={{ marginRight: "10px"  , color: "#3b82f6" ,marginLeft: "10px"}}
                  ></i>
                  I'm filling the form on behalf of another person OR I am a
                  care home worker
                </label>
              </div>

              {/* Personal Info Grid */}
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    First Name <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    placeholder="Enter first name"
                    className={errors.firstName ? "error" : ""}
                  />
                  {errors.firstName && (
                    <div className="error-message show">{errors.firstName}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    Last Name <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    placeholder="Enter last name"
                    className={errors.lastName ? "error" : ""}
                  />
                  {errors.lastName && (
                    <div className="error-message show">{errors.lastName}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    Date of Birth <span className="required-star">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleInputChange("dob", e.target.value)}
                    max={maxDate}
                    min={minDate}
                    className={errors.dob ? "error" : ""}
                  />
                  {errors.dob && (
                    <div className="error-message show">{errors.dob}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    Phone Number (preferably mobile){" "}
                    <span className="required-star">*</span>
                  </label>
                  <div className="phone-input-group">
                    <select
                      className="country-code"
                      value={formData.countryCode}
                      onChange={(e) =>
                        handleInputChange("countryCode", e.target.value)
                      }
                    >
                      <option value="+353">+353 (Ireland)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+1">+1 (US/Canada)</option>
                      <option value="+61">+61 (Australia)</option>
                      <option value="+49">+49 (Germany)</option>
                      <option value="+33">+33 (France)</option>
                      <option value="+34">+34 (Spain)</option>
                      <option value="+39">+39 (Italy)</option>
                    </select>
                    <input
                      type="tel"
                      className={`phone-number ${errors.phone ? "error" : ""}`}
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange(
                          "phoneNumber",
                          e.target.value.replace(/\D/g, "").slice(0, 10),
                        )
                      }
                      placeholder="86123456"
                    />
                  </div>
                  {errors.phone && (
                    <div className="error-message show">{errors.phone}</div>
                  )}
                  <small style={{ color: "var(--gray-500)", fontSize: 11 }}>
                    Example: 086123456 as 86123456
                  </small>
                </div>

                <div className="form-group full-width">
                  <label>
                    Street Address <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Enter street address"
                    className={errors.address ? "error" : ""}
                  />
                  {errors.address && (
                    <div className="error-message show">{errors.address}</div>
                  )}
                </div>

                <div className="form-group full-width">
                  <label>
                    Email <span className="optional-badge">Optional</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter email address"
                    className={errors.email ? "error" : ""}
                  />
                  {errors.email && (
                    <div className="error-message show">{errors.email}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    Landline <span className="optional-badge">Optional</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.landline}
                    onChange={(e) =>
                      handleInputChange("landline", e.target.value)
                    }
                    placeholder="Enter landline number"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Postal Code <span className="optional-badge">Optional</span>
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) =>
                      handleInputChange("postalCode", e.target.value)
                    }
                    placeholder="Enter postal code"
                  />
                </div>

                <div className="form-group">
                  <label>Medical Card</label>
                  <select
                    value={formData.medicalCard}
                    onChange={(e) =>
                      handleInputChange("medicalCard", e.target.value)
                    }
                  >
                    <option value="">Select one</option>
                    <option value="yes">Yes, I have a medical card</option>
                    <option value="no">No, I do not have a medical card</option>
                    <option value="applied">
                      Applied, waiting for approval
                    </option>
                  </select>
                </div>
              </div>

              {/* Digital Signature */}
              <div className="signature-section">
                <div className="signature-header">
                  <h3>
                    <i className="fas fa-pen-fancy"></i> Digital Signature
                  </h3>
                  <div className="signature-buttons">
                    <button onClick={clearSignature}>
                      <i className="fas fa-trash-alt"></i> Clear
                    </button>
                  </div>
                </div>
                <div className="signature-pad-container">
                  <canvas
                    ref={canvasRef}
                    id="signatureCanvas"
                    width="600"
                    height="180"
                    style={{ width: "100%", height: 180, maxWidth: "100%" }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    onTouchCancel={stopDrawing}
                  />
                </div>
                <div className="signature-info">
                  <i className="fas fa-fingerprint"></i> Sign using mouse or
                  touch
                  <div className="signature-status">
                    <span
                      className={`signed-badge ${signatureSaved ? "show" : ""}`}
                    >
                      <i className="fas fa-check-circle"></i> Signature complete
                    </span>
                  </div>
                </div>
                {errors.signature && (
                  <div className="error-message show" style={{ marginTop: 8 }}>
                    {errors.signature}
                  </div>
                )}
                <p style={{ fontSize: 11, color: "#6b7280", marginTop: 12 }}>
                  <i className="fas fa-info-circle"></i> By signing above, you
                  confirm that the information provided is accurate and you
                  consent to the processing of your data as outlined in our
                  privacy policy.
                </p>
              </div>

              {/* Response Time Info */}
              <div className="info-box">
                <i className="fas fa-clock"></i>
                <div className="info-box-content">
                  <h4>Response Time Information</h4>
                  <p>
                    We aim to deal with all urgent requests and appointment
                    requests submitted before 4 pm on the same working day and
                    all other routine queries within 48 working hours.
                  </p>
                </div>
              </div>

              {/* Contact Preferences */}
              <div className="form-group full-width" style={{ marginTop: 28 }}>
                <label>Please contact me via:</label>
                <div className="checkbox-group">
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={formData.contactSms}
                      onChange={(e) =>
                        handleInputChange("contactSms", e.target.checked)
                      }
                    />
                    <span>
                      <i className="fas fa-sms" style={{ marginLeft: '10px' }}></i> SMS
                    </span>
                  </label>
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={formData.contactEmail}
                      onChange={(e) =>
                        handleInputChange("contactEmail", e.target.checked)
                      }
                    />
                    <span>
                      <i className="fas fa-envelope" style={{ marginLeft: '10px' }}></i> Email
                    </span>
                  </label>
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={formData.contactPhone}
                      onChange={(e) =>
                        handleInputChange("contactPhone", e.target.checked)
                      }
                    />
                    <span>
                      <i className="fas fa-phone" style={{ marginLeft: '10px' }}></i> Phone Call
                    </span>
                  </label>
                </div>
              </div>

              {/* Consent */}
              <div className="consent-group">
                <label className="consent-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.consentGiven}
                    onChange={(e) =>
                      handleInputChange("consentGiven", e.target.checked)
                    }
                  />
                  <div className="consent-text">
                    <strong>Data Processing Consent *</strong>
                    <br />
                    By submitting this form, I confirm that I have read and
                    understood the privacy policy and consent to Collins Medical
                    Practice processing my personal data for the purpose of
                    assessing my medical request and contacting me regarding my
                    appointment.
                  </div>
                </label>
                {errors.consent && (
                  <div className="error-message show" style={{ marginTop: 8 }}>
                    {errors.consent}
                  </div>
                )}
              </div>
            </div>

            <div className="button-container">
              <button className="btn btn-secondary" onClick={handlePrev}>
                <i className="fas fa-arrow-left"></i> Previous
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}{" "}
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </main>

        <footer className="footer-section">
          <div className="footer-links">
            <a href="#">
              <i className="fas fa-file-contract"></i> Terms of Use
            </a>
            <a href="#">
              <i className="fas fa-lock"></i> Privacy Policy
            </a>
            <a href="#">
              <i className="fas fa-universal-access"></i> Accessibility
              Statement
            </a>
          </div>
          <div className="copyright">
            <p>
              © 2026 Collins Medical Practice. All rights reserved. | Secure
              Patient Registration System
            </p>
            <p style={{ marginTop: 6 }}>
              Your data is encrypted and protected under GDPR regulations
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
