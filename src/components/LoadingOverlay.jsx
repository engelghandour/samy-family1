import { useState, useEffect } from 'react';

export default function LoadingOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = () => setVisible(true);
    const hide = () => setVisible(false);
    window.addEventListener('show-loading', show);
    window.addEventListener('hide-loading', hide);
    return () => {
      window.removeEventListener('show-loading', show);
      window.removeEventListener('hide-loading', hide);
    };
  }, []);

  return (
    <div className={`loading-overlay ${visible ? 'active' : ''}`}>
      <div className="loading-spinner"></div>
      <div className="loading-text">Loading...</div>
    </div>
  );
}
