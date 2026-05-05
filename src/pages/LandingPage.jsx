import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* ===== TOP BAR ===== */}
      <div className="landing-topbar">
        <div className="landing-container">
          <div className="topbar-left">
            <i className="fas fa-map-marker-alt"></i>
            <span>Samy Family Practice, Co. Cavan, Ireland</span>
          </div>
          <div className="topbar-right">
            <i className="far fa-clock"></i>
            <span>Mon - Fri 9am - 1pm & 2pm - 5pm</span>
          </div>
        </div>
      </div>

      {/* ===== HEADER / NAV ===== */}
      <header className="landing-header">
        <div className="landing-container">
          <div className="header-logo-section">
            <Link to="/" className="logo-link">
              <div className="logo-icon">
                <i className="fas fa-stethoscope"></i>
              </div>
              <div className="logo-text">
                <h1>Samy Family Medical</h1>
                <span>Practice</span>
              </div>
            </Link>
          </div>
          <nav className="header-nav">
            <Link to="/">Home</Link>
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>
            <Link to="/booking" className="nav-cta">Book Online</Link>
          </nav>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="landing-hero">
        <div className="hero-overlay"></div>
        <div className="landing-container hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Samy Family Practice</h1>
            <p className="hero-desc">
              Providing health services to Cavan area and surrounding areas.
              Compassionate care in a modern, welcoming environment.
            </p>
            <div className="hero-buttons">
              <Link to="/booking" className="hero-btn hero-btn-primary">
                <i className="fas fa-calendar-check"></i> Book Online
              </Link>
              <a href="#contact" className="hero-btn hero-btn-secondary">
                <i className="fas fa-phone-alt"></i> Contact Us
              </a>
            </div>
            <a href="#services" className="hero-scroll">
              <span>Learn More</span>
              <i className="fas fa-chevron-down"></i>
            </a>
          </div>
          <div className="hero-info-card">
            <div className="info-card-body">
              <h3><i className="fas fa-phone-alt"></i> Emergency</h3>
              <a href="tel:+353000000000" className="info-phone">(1800) 777-911</a>
            </div>
            <div className="info-card-body">
              <h3><i className="far fa-clock"></i> Opening Hours</h3>
              <ul className="info-hours">
                <li><span>Mon - Fri</span><span>9am - 1pm, 2pm - 5pm</span></li>
                <li><span>Sat - Sun</span><span>Closed</span></li>
              </ul>
            </div>
            <div className="info-card-body">
              <h3><i className="fas fa-map-marker-alt"></i> Address</h3>
              <p>Samy Family Practice<br/>2nd floor, Drumalee Primary Care Center<br/>Co. Cavan, Ireland</p>
            </div>
            <Link to="/booking" className="info-card-cta">
              <i className="fas fa-arrow-right"></i> Book an Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURES / SERVICES SECTION ===== */}
      <section id="services" className="landing-section landing-services">
        <div className="landing-container">
          <div className="section-header-center">
            <h2>Our Services</h2>
            <p>Comprehensive healthcare services tailored to your needs</p>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-calendar-check"></i>
              </div>
              <h3>Online Booking</h3>
              <p>Book your appointment online quickly and easily. Choose your preferred time and date.</p>
              <Link to="/booking" className="service-link">Book Now <i className="fas fa-arrow-right"></i></Link>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-phone-alt"></i>
              </div>
              <h3>Contact Us</h3>
              <p>Get in touch with our friendly team for any enquiries or assistance you may need.</p>
              <a href="#contact" className="service-link">Contact Now <i className="fas fa-arrow-right"></i></a>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-flask"></i>
              </div>
              <h3>Test Results</h3>
              <p>Access your test results and medical records through our secure patient portal.</p>
              <a href="#contact" className="service-link">Learn More <i className="fas fa-arrow-right"></i></a>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-ambulance"></i>
              </div>
              <h3>Emergency Care</h3>
              <p>Immediate assistance for urgent medical concerns. Your health is our priority.</p>
              <Link to="/booking" className="service-link">Get Help <i className="fas fa-arrow-right"></i></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COVID BOOSTER BANNER ===== */}
      <section className="landing-section landing-covid-banner">
        <div className="landing-container">
          <div className="covid-banner-content">
            <div className="covid-banner-text">
              <h2><i className="fas fa-syringe"></i> COVID-19 Booster Vaccination</h2>
              <p>We are now offering COVID-19 booster vaccinations for eligible patients. Book your appointment today to ensure you and your family are protected.</p>
            </div>
            <Link to="/covid-booster" className="covid-banner-btn">
              Learn More <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section id="about" className="landing-section landing-about">
        <div className="landing-container">
          <div className="about-grid">
            <div className="about-image">
              <div className="about-image-placeholder">
                <i className="fas fa-user-md"></i>
              </div>
            </div>
            <div className="about-text">
              <h2>Welcome to Samy Family Practice</h2>
              <p>
                At Samy Family Practice, we are dedicated to providing high-quality,
                compassionate healthcare to the Cavan area and surrounding areas.
                Our experienced team of healthcare professionals is committed to your wellbeing.
              </p>
              <p>
                We offer a wide range of medical services including general consultations,
                health screenings, vaccinations, chronic disease management, and more.
                Your health is our top priority.
              </p>
              <div className="about-stats">
                <div className="stat-item">
                  <span className="stat-number">10+</span>
                  <span className="stat-label">Years Experience</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">5,000+</span>
                  <span className="stat-label">Patients Treated</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">4.9</span>
                  <span className="stat-label">Patient Rating</span>
                </div>
              </div>
              <Link to="/booking" className="about-cta">
                Book an Appointment <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section id="contact" className="landing-section landing-contact">
        <div className="landing-container">
          <div className="section-header-center">
            <h2>Get In Touch</h2>
            <p>We're here to help. Contact us for any enquiries.</p>
          </div>
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon">
                <i className="fas fa-phone-alt"></i>
              </div>
              <h3>Phone</h3>
              <a href="tel:+353000000000" className="contact-link">(049) 489-1721</a>
              <p className="contact-note">Call us during office hours</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <h3>Email</h3>
              <a href="mailto:info@samyfamily.com" className="contact-link">info@samyfamily.com</a>
              <p className="contact-note">We reply within 24 hours</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3>Address</h3>
              <p className="contact-address">Samy Family Practice<br/>2nd floor, Drumalee Primary Care Center<br/>Co. Cavan, Ireland</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">
                <i className="far fa-clock"></i>
              </div>
              <h3>Opening Hours</h3>
              <ul className="contact-hours">
                <li><span>Mon - Fri</span><span>9am - 1pm, 2pm - 5pm</span></li>
                <li><span>Saturday</span><span>Closed</span></li>
                <li><span>Sunday</span><span>Closed</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="footer-grid">
            <div className="footer-col footer-brand">
              <div className="footer-logo">
                <i className="fas fa-stethoscope"></i>
                <div>
                  <h3>Samy Family Practice</h3>
                  <span>Practice</span>
                </div>
              </div>
              <p>Providing quality healthcare to the Cavan area and surrounding areas since 2015.</p>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><Link to="/booking">Book Online</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Contact Info</h4>
              <ul className="footer-contact">
                <li><i className="fas fa-phone-alt"></i> (049) 489-1721</li>
                <li><i className="fas fa-envelope"></i> info@samyfamily.com</li>
                <li><i className="fas fa-map-marker-alt"></i> 2nd floor, Drumalee Primary Care Center, Co. Cavan, Ireland</li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Opening Hours</h4>
              <ul className="footer-hours">
                <li><span>Mon - Fri</span><span>9am - 1pm, 2pm - 5pm</span></li>
                <li><span>Saturday</span><span>Closed</span></li>
                <li><span>Sunday</span><span>Closed</span></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Samy Family Practice. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
