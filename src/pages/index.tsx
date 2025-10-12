import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>SYMIONE — Générateur de contrats juridiques français</title>
        <meta name="description" content="50 modèles juridiques conformes au droit français, générés par IA." />
      </Head>
      <main className="container">
        <header className="header">
          <h1 className="title">SYMIONE <span className="muted" style={{ fontSize: 16 }}>— LEX-ENGINE</span></h1>
          <span className="badge">🇫🇷 Version Française v1.0</span>
        </header>
        <p className="muted" style={{ fontSize: 18, lineHeight: 1.5 }}>
          50 modèles juridiques conformes au droit français, générés par IA.
        </p>
        <div className="row" style={{ marginTop: 16 }}>
          <Link href="/contracts" className="btn btn-primary">Voir tous les contrats</Link>
          <Link href="/contracts?jurisdiction=FR" className="btn btn-secondary">Modèles français (FR)</Link>
        </div>
        <section className="card" style={{ marginTop: 32 }}>
          <strong>🎙️ Assistant vocal et recommandations d’avocats — bientôt disponible</strong>
        </section>
      </main>
    </>
  );
}


