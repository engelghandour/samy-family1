export default function BookingHeader({
  icon = 'fa-clipboard-list',
  subtitle = '',
  badgeText = '',
  badgeColor = '#10b981',
  badgeIcon = 'fa-circle',
  children,
}) {
  return (
    <header className="header-section">
      <div className="brand-container">
        <div className="logo">
          <div className="logo-icon">
            <i className={`fas ${icon}`}></i>
          </div>
          <div className="logo-text">
            <h1>Samy Family Practice</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
        </div>
        <div className="header-actions">
          {badgeText && (
            <span className="header-badge">
              <i className={`fas ${badgeIcon}`} style={{ fontSize: '10px', color: badgeColor, marginRight: 6 }}></i>
              {badgeText}
            </span>
          )}
          {children}
        </div>
      </div>
    </header>
  );
}
