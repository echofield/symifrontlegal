import type { AppProps } from "next/app";
import Head from "next/head";
import { Navbar } from "@/components/Navbar";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  if (typeof window !== "undefined") {
    if (!(window as any).__symioneGlobalErrorListenerAttached) {
      (window as any).__symioneGlobalErrorListenerAttached = true;
      window.addEventListener("error", (event: ErrorEvent) => {
        console.error("🛑 Global error caught:", event.error || event.message || event);
        console.trace();
      });
      window.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
        console.error("🛑 Unhandled rejection:", event.reason);
        console.trace();
      });
    }
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>SYMI Legal — Intelligence juridique</title>
      </Head>

      <Navbar />

      <main className="bg-slate-50/60">
        <Component {...pageProps} />
      </main>
    </>
  );
}
