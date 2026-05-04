import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import BookingHeader from '../components/BookingHeader';


const MAX_CHARS = 5000;
const MIN_CHARS_REQUIRED = 20;

const aiSuggestionsDB = {
  Pain: [
    "The pain started [number] days ago as a [dull/sharp/burning/stabbing] sensation. It is located in the [area] and [radiates/does not radiate] to other areas. The pain is [constant/intermittent] and has a severity of [X/10]. It is worse when [activity] and better when [rest/medication].",
    "I first noticed the pain [time frame]. It began [suddenly/gradually] after [activity/meal/event]. The character has changed from [initial description] to [current description]. No previous history of similar pain.",
  ],
  Bleeding: [
    "The bleeding started [time frame]. It is [light/moderate/heavy] and [continuous/on and off]. The blood is [bright red/dark red/clotted]. I have taken [medication] to help stop it. There is [pain/no pain] associated.",
    "I noticed bleeding without any apparent injury. It occurs [frequency]. I am taking blood-thinning medication: [Yes/No - specify medication]. Previous similar episodes: [details].",
  ],
  Fever: [
    "Fever started [time frame]. Temperature reached [X]°F/°C. Associated with [chills/sweating/body aches]. I have taken [medication] which [helped/did not help]. The fever [comes and goes/is constant].",
    "The fever began after [possible exposure/activity]. I have [traveled/been in contact with sick individuals]. Other family members [are/are not] affected.",
  ],
  Headache: [
    "Headache started [time frame]. The pain is [throbbing/constant/pressure-like] and located [location]. Intensity [X/10]. Associated symptoms: [nausea/sensitivity to light/vision changes]. Triggers include [stress/food/weather].",
    "This is [new/recurring] type of headache. Previous diagnosis: [if any]. Current medications: [list]. The headache [worsens/improves] with [activity/rest].",
  ],
  "Shortness of breath": [
    "Shortness of breath began [time frame]. It occurs [at rest/with exertion/at night]. I feel [tight/wheezy/unable to get enough air]. Associated with [cough/chest pain/dizziness]. Oxygen levels [normal/low].",
    "The breathing difficulty started [suddenly/gradually]. I have [asthma/COPD/heart condition]. Triggered by [allergens/exercise/cold air]. Relieved by [inhaler/position change].",
  ],
  default: [
    "The symptom started [time frame]. It began [suddenly/gradually] and has [improved/worsened/remained the same] since onset. The severity is currently [mild/moderate/severe]. Factors that help: [details]. Factors that worsen: [details].",
    "I have [had/not had] this symptom before. Past medical history: [relevant conditions]. Current medications: [list]. Any recent changes: [diet/activity/stress/medication].",
    "The symptom affects my daily activities [not at all/somewhat/significantly]. I have tried [home remedies/over-the-counter medications] which [helped/did not help].",
  ],
};

export default function Details() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const textareaRef = useRef(null);
  const autoSaveRef = useRef(null);

  const [symptomDetails, setSymptomDetails] = useState(state.symptomDetails || '');
  const [charCount, setCharCount] = useState((state.symptomDetails || '').length);

  const selectedSymptoms = state.selectedSymptoms || [];
  const uniqueSymptoms = [...new Map(selectedSymptoms.map((s) => [s.name, s])).values()];
  const displaySymptoms = uniqueSymptoms.slice(0, 8);

  // Get AI suggestions based on selected symptoms
  const getSuggestions = () => {
    const symptomNames = selectedSymptoms.map((s) => s.name);
    for (const [key, value] of Object.entries(aiSuggestionsDB)) {
      if (key !== 'default' && symptomNames.some((name) => name.toLowerCase().includes(key.toLowerCase()))) {
        return value;
      }
    }
    return aiSuggestionsDB.default;
  };

  const suggestions = getSuggestions();

  const handleTextChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setSymptomDetails(value);
      setCharCount(value.length);

      // Auto-save with debounce
      clearTimeout(autoSaveRef.current);
      autoSaveRef.current = setTimeout(() => {
        dispatch({ type: 'SET_SYMPTOM_DETAILS', payload: value });
      }, 800);
    }
  };

  const insertSuggestion = (suggestion) => {
    const newText = symptomDetails
      ? symptomDetails + '\n\n---\n\n' + suggestion
      : suggestion;
    setSymptomDetails(newText);
    setCharCount(newText.length);
    dispatch({ type: 'SET_SYMPTOM_DETAILS', payload: newText });
    if (window.showToast) window.showToast('✨ AI suggestion added to your description', 'success');
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(newText.length, newText.length);
    }
  };

  const handleNext = () => {
    const length = symptomDetails.length;
    if (length < MIN_CHARS_REQUIRED) {
      if (window.showToast) window.showToast(`Please provide at least ${MIN_CHARS_REQUIRED} characters describing your symptoms`, 'warning');
      return;
    }
    dispatch({ type: 'SET_SYMPTOM_DETAILS', payload: symptomDetails });
    navigate('/personal');
  };

  const handlePrev = () => {
    dispatch({ type: 'SET_SYMPTOM_DETAILS', payload: symptomDetails });
    navigate('/emergency');
  };

  const isValid = charCount >= MIN_CHARS_REQUIRED && charCount <= MAX_CHARS;

  const getCharColor = () => {
    if (charCount >= MIN_CHARS_REQUIRED && charCount <= MAX_CHARS) return '#10b981';
    if (charCount < MIN_CHARS_REQUIRED) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="app-wrapper">
      <div className="main-container">

        <BookingHeader
          icon="fa-pen-alt"
          subtitle={<><i className="fas fa-stethoscope"></i> Detailed Symptom Assessment</>}
          badgeText="Final clinical step"
          badgeColor="#f59e0b"
          badgeIcon="fa-info-circle"
        />

        <main className="content-section">
          <div className="progress-tracker">
            <div className="progress-bar">
              <div className="progress-step completed"><div className="progress-circle">1</div><div className="progress-label">Visit Type</div></div>
              <div className="progress-line filled"></div>
              <div className="progress-step completed"><div className="progress-circle">2</div><div className="progress-label">Body Map</div></div>
              <div className="progress-line filled"></div>
              <div className="progress-step completed"><div className="progress-circle">3</div><div className="progress-label">Symptoms</div></div>
              <div className="progress-line filled"></div>
              <div className="progress-step completed"><div className="progress-circle">4</div><div className="progress-label">Emergency</div></div>
              <div className="progress-line filled"></div>
              <div className="progress-step active"><div className="progress-circle">5</div><div className="progress-label">Details</div></div>
            </div>
            <div className="progress-title">
              <i className="fas fa-edit"></i> Step 5 of 5: Describe your symptoms in detail
            </div>
          </div>
          <div className="form-card animate-fadeUp">
            <div className="form-header">
              <h2>
                <i className="fas fa-stethoscope"></i>
                Describe the symptoms in more detail
              </h2>
              <p>Your detailed description helps our clinical team understand your condition better and provide appropriate care.</p>
            </div>

            <div className="form-body">
              {/* Question Box */}
              <div className="question-box">
                <h3><i className="fas fa-question-circle"></i> Please describe your symptom in detail:</h3>
                <p>
                  • When did it begin?<br />
                  • How and in what situation did it manifest?<br />
                  • Has the symptom changed since it began? If so, how?<br />
                  • What makes it better or worse?<br />
                  • Have you had this symptom before?
                </p>
              </div>

              {/* Textarea */}
              <div className="textarea-container">
                <label><i className="fas fa-align-left"></i> Symptom Description <span className="required-star">*</span></label>
                <textarea
                  ref={textareaRef}
                  className="symptom-textarea"
                  value={symptomDetails}
                  onChange={handleTextChange}
                  placeholder="Example: The pain started 3 days ago in my lower abdomen. It began as a dull ache after lunch, but has become sharper and more constant. The pain is worse when I move or cough, and feels slightly better when I lie still. I've never experienced anything like this before..."
                  maxLength={MAX_CHARS}
                />
                <div className="char-counter" style={{ color: getCharColor() }}>
                  <i className="fas fa-keyboard"></i> {charCount} / {MAX_CHARS} characters
                </div>
              </div>

              {/* AI Suggestions */}
              {suggestions.length > 0 && (
                <div className="ai-suggestions">
                  <h4><i className="fas fa-robot"></i> AI Smart Suggestions</h4>
                  <div className="suggestion-buttons">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="suggestion-btn"
                        onClick={() => insertSuggestion(suggestion)}
                      >
                        <i className="fas fa-magic"></i> Suggestion {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Symptom Summary */}
              <div className="symptom-summary">
                <h4><i className="fas fa-list-ul"></i> Your selected symptoms:</h4>
                <div className="symptom-tags">
                  {displaySymptoms.length === 0 ? (
                    <span style={{ color: 'var(--gray-500)' }}>No symptoms selected</span>
                  ) : (
                    <>
                      {displaySymptoms.map((symptom, index) => (
                        <div className="symptom-tag" key={index}>
                          <i className="fas fa-tag"></i> {symptom.name}
                        </div>
                      ))}
                      {uniqueSymptoms.length > 8 && (
                        <div className="symptom-tag">+{uniqueSymptoms.length - 8} more</div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="button-container">
              <button className="btn btn-secondary" onClick={handlePrev}>
                <i className="fas fa-arrow-left"></i> Previous
              </button>
              <button className="btn btn-primary" onClick={handleNext} disabled={!isValid}>
                Next <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </main>

        <footer className="footer-section">
          <div className="footer-links">
            <a href="#"><i className="fas fa-file-contract"></i> Terms of Use</a>
            <a href="#"><i className="fas fa-lock"></i> Privacy Policy</a>
            <a href="#"><i className="fas fa-universal-access"></i> Accessibility Statement</a>
          </div>
          <div className="copyright">
            <p>© 2026 Collins Medical Practice. All rights reserved. | AI-Assisted Symptom Analysis</p>
            <p style={{ marginTop: 6 }}>Your information is securely encrypted and confidential</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
