import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error('Render error:', err);
    rootElement.innerHTML = `<div style="padding: 20px; color: #ef4444; background: #fff5f5; border-radius: 8px; margin: 20px; font-family: sans-serif;">
      <h1 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem;">Application Error</h1>
      <p style="font-size: 0.875rem; color: #7f1d1d;">The application failed to start. Please try refreshing.</p>
      <pre style="margin-top: 1rem; font-size: 0.75rem; white-space: pre-wrap; overflow: auto; max-height: 200px;">${err instanceof Error ? err.stack : String(err)}</pre>
    </div>`;
  }
} else {
  console.error('Root element not found');
}
