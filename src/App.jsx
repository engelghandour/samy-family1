import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ToastProvider from './components/ToastProvider';
import LoadingOverlay from './components/LoadingOverlay';
import LandingPage from './pages/LandingPage';
import NatureOfVisit from './pages/NatureOfVisit';
import BodyMap from './pages/BodyMap';
import Symptoms from './pages/Symptoms';
import Emergency from './pages/Emergency';
import Details from './pages/Details';
import Personal from './pages/Personal';
import ThankYou from './pages/ThankYou';
import CovidBooster from './pages/CovidBooster';
import './App.css';

function App() {
  return (
    <Router>
      <AppProvider>
        <ToastProvider />
        <LoadingOverlay />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/booking" element={<NatureOfVisit />} />
          <Route path="/body-map" element={<BodyMap />} />
          <Route path="/symptoms" element={<Symptoms />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/details" element={<Details />} />
          <Route path="/personal" element={<Personal />} />
          <Route path="/thankyou" element={<ThankYou />} />
          <Route path="/covid-booster" element={<CovidBooster />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </Router>
  );
}

export default App;
