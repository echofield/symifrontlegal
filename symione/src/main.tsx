
import React, { Component, ReactNode } from "react";
import "./shims";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: any; componentStack?: string }> {
  state = { hasError: false, error: null as any, componentStack: '' };
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, info: any) {
    this.setState({ componentStack: info?.componentStack || '' });
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "24px", fontFamily: "Inter, sans-serif" }}>
          <h1 style={{ marginBottom: 12 }}>Une erreur s'est produite</h1>
          <pre style={{ background: "#f5f5f5", padding: 12, borderRadius: 8, overflow: "auto" }}>
            {String(this.state.error)}
          </pre>
          {this.state.componentStack && (
            <pre style={{ background: "#fafafa", padding: 12, borderRadius: 8, overflow: "auto", marginTop: 12 }}>
              {this.state.componentStack}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element not found");

createRoot(rootEl).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
  