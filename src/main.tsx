import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Clear any existing Service Workers to prevent "White Screen of Death" issues
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
