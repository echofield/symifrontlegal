import type { AppProps } from 'next/app';
import Link from 'next/link';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <nav className="container" style={{ display: 'flex', gap: 12, paddingTop: 12, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
        <Link href="/" className="link">Accueil</Link>
        <Link href="/contracts" className="link">Contrats</Link>
        <Link href="/conseiller" className="link">Conseiller</Link>
      </nav>
      <Component {...pageProps} />
    </>
  );
}


