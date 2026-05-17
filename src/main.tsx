import { createRoot } from 'react-dom/client';
import React, { Component, ReactNode } from 'react';
import App from './App';
import './index.css';

// Simple Error Boundary to catch runtime errors that cause WSoD
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("App Crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: '#0c2557', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#e9bb93' }}>Something went wrong.</h1>
          <p style={{ opacity: 0.8 }}>{this.state.error?.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '20px', padding: '10px 20px', background: '#787fb2', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}
          >
            Retry Loading
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Clear any existing Service Workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
}

console.log("Main processing starting...");
const container = document.getElementById('root');
if (container) {
  console.log("Found root container, rendering...");
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} else {
  console.error("Root container not found!");
}
