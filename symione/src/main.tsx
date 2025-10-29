
import React, { Component, ReactNode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: any }> {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "24px", fontFamily: "Inter, sans-serif" }}>
          <h1 style={{ marginBottom: 12 }}>Une erreur s'est produite</h1>
          <pre style={{ background: "#f5f5f5", padding: 12, borderRadius: 8, overflow: "auto" }}>
            {String(this.state.error)}
          </pre>
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
  