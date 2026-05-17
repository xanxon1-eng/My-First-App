import { createRoot } from 'react-dom/client';
import React, { Component, ReactNode } from 'react';
import App from './App';
import './index.css';

// Solution 2: Global window fallback to prevent invisible crashes rendering a blank white/black screen
window.addEventListener('error', (e) => {
  const root = document.getElementById('root');
  if (root && root.innerHTML === '') {
    root.innerHTML = `<div style="padding: 20px; color: #ff5555; font-family: monospace;">Fatal Error before React mount: ${e.message}</div>`;
  }
});

// Solution 3: Catch unhandled promises and prevent infinite reload loops
window.addEventListener('unhandledrejection', (e) => {
  console.error("Unhandled Promise Rejection:", e.reason);
  // Do NOT location.reload() here, just log to prevent loops
});

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
        <div className="flex flex-col items-center justify-center h-full w-full bg-[#121212] text-white p-8">
          <h1 className="text-red-500 text-xl font-bold mb-4">Training Shell Crashed</h1>
          <pre className="text-sm text-gray-400 bg-black p-4 rounded">{this.state.error?.message}</pre>
          <button 
            onClick={() => window.location.href = '/'} // Reset gracefully without caching state
            className="mt-6 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
          >
            Restart Shell
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

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}
