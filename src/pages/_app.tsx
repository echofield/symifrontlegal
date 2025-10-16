import type { AppProps } from "next/app";
import Link from "next/link";
import Head from "next/head";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  // Global error boundary for runtime errors
  if (typeof window !== 'undefined') {
    // Attach once
    if (!(window as any).__symioneGlobalErrorListenerAttached) {
      (window as any).__symioneGlobalErrorListenerAttached = true;
      window.addEventListener('error', (event: ErrorEvent) => {
        console.error('🛑 Global error caught:', event.error || event.message || event);
        console.trace();
      });
      window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
        console.error('🛑 Unhandled rejection:', event.reason);
        console.trace();
      });
    }
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>SYMIONE — Legal Intelligence Engine</title>
      </Head>

      <nav
        className="container"
        style={{
          display: "flex",
          gap: 12,
          paddingTop: 12,
          paddingBottom: 12,
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Link href="/" className="link">
          Accueil
        </Link>
        <Link href="/contracts" className="link">
          Contrats
        </Link>
        <Link href="/conseiller" className="link">
          Conseiller
        </Link>
      </nav>

      <main style={{ minHeight: "100vh", background: "#fff" }}>
        <Component {...pageProps} />
      </main>
    </>
  );
}
