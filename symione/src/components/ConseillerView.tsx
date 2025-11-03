import { motion } from "motion/react";
import { ArrowLeft, MapPin, Phone, Mail, Search, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { showToast } from "./SystemToast";

interface ConseillerViewProps {
  onBack: () => void;
}

interface Lawyer {
  id: string;
  name: string;
  specialties: string[];
  address: string;
  phone: string;
  email: string;
  distance?: string;
}

export function ConseillerView({ onBack }: ConseillerViewProps) {
  const [question, setQuestion] = useState('');
  const [asking, setAsking] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || !(window as any).google) return;
      const map = new (window as any).google.maps.Map(mapRef.current, {
        center: { lat: 48.8566, lng: 2.3522 }, // Paris center
        zoom: 12,
        styles: [
          { featureType: 'all', elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
        ],
        disableDefaultUI: true,
        zoomControl: true,
      });
      setMapLoaded(true);
    };

    // Load Google Maps script - safe environment variable access
    let apiKey: string | undefined;
    try {
      apiKey = (import.meta as any)?.env?.VITE_GOOGLE_MAPS_API_KEY;
    } catch {}

    if (!apiKey) {
      setMapLoaded(true);
      return;
    }

    if (!(window as any).google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.onload = initMap;
      script.onerror = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, []);

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      showToast('Veuillez entrer une question', 'error');
      return;
    }
    setAsking(true);
    try {
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question, context: {} }),
      });
      if (!response.ok) throw new Error('Erreur API');
      const data = await response.json();
      showToast('Réponse reçue. Recherche d\'avocats en cours...', 'success');
      if (data.practice_area) {
        setSearchQuery('Paris');
        await handleSearchLawyers();
      }
      setQuestion('');
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de l\'envoi', 'error');
    } finally {
      setAsking(false);
    }
  };

  const handleSearchLawyers = async () => {
    if (!searchQuery.trim()) {
      showToast('Veuillez entrer une localisation', 'error');
      return;
    }
    setSearching(true);
    try {
      const response = await fetch(`/api/lawyers/search?near=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Erreur API');
      const data = await response.json();
      setLawyers(data.lawyers || []);
      showToast(`${data.lawyers?.length || 0} avocats trouvés`, 'success');
    } catch (err: any) {
      // Fallback to mock data
      setLawyers([
        { id: '1', name: 'Cabinet Dubois & Associés', specialties: ['Droit des affaires', 'Droit commercial'], address: '45 Rue de la République, 75001 Paris', phone: '+33 1 42 86 55 00', email: 'contact@dubois-avocats.fr', distance: '1.2 km' },
        { id: '2', name: 'Maître Sophie Martin', specialties: ['Droit du travail', 'Droit social'], address: '12 Avenue des Champs-Élysées, 75008 Paris', phone: '+33 1 53 93 60 00', email: 's.martin@avocat-paris.fr', distance: '2.8 km' },
        { id: '3', name: 'SCP Laurent & Moreau', specialties: ['Droit immobilier', 'Droit de la famille'], address: '78 Boulevard Saint-Germain, 75005 Paris', phone: '+33 1 43 26 71 00', email: 'contact@laurent-moreau.fr', distance: '3.5 km' },
      ]);
      showToast('Utilisation des données de démonstration', 'info');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'linear' }}
          className="mb-12"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-colors duration-200 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" strokeWidth={1.5} />
            <span className="text-[0.625rem] uppercase tracking-[0.12em]" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
              Retour
            </span>
          </button>
          <div className="pb-6 border-b border-border">
            <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-3" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
              MODULE CONSEIL / ASSISTANCE
            </p>
            <h1 className="text-[2rem] md:text-[3rem] tracking-[-0.03em]" style={{ fontWeight: 600, lineHeight: 1.1 }}>
              Conseiller juridique
            </h1>
          </div>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column: Ask + Results */}
          <div className="lg:col-span-5 space-y-6">
            {/* Ask Question Module */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease: 'linear' }}
              className="bg-card border border-border p-6 lg:p-8"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                  Poser une question
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="text-[0.625rem] uppercase tracking-[0.1em] text-accent" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                    RÉPONSE EN {'<5'} MIN
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                    Votre question juridique
                  </label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows={6}
                    placeholder="Décrivez votre situation juridique..."
                    className="w-full px-3 py-2.5 bg-input-background border border-border focus-precision transition-all duration-200 text-[0.875rem] resize-none placeholder:text-muted-foreground/50"
                    style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}
                  />
                </div>
                <button
                  onClick={handleAskQuestion}
                  disabled={asking || !question.trim()}
                  className="w-full px-6 py-3 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200 text-[0.625rem] uppercase tracking-[0.12em] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
                >
                  {asking ? (<><Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.5} />Envoi en cours</>) : ('Demander')}
                </button>
                <p className="text-[0.625rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300, lineHeight: 1.5 }}>
                  Réponse sous 24h • Service confidentiel
                </p>
              </div>
            </motion.div>

            {/* Lawyer Search Results */}
            {lawyers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'linear' }}
                className="space-y-2"
              >
                <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-4" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                  Résultats ({lawyers.length})
                </p>
                {lawyers.map((lawyer, index) => (
                  <motion.div
                    key={lawyer.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05, ease: 'linear' }}
                    className="bg-card border border-border p-5 hover:border-accent transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-[1rem] tracking-[-0.01em]" style={{ fontWeight: 600 }}>
                        {lawyer.name}
                      </h3>
                      {lawyer.distance && (
                        <span className="text-[0.625rem] text-accent" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                          {lawyer.distance}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex flex-wrap gap-2">
                        {lawyer.specialties.map((specialty, idx) => (
                          <span
                            key={idx}
                            className="text-[0.625rem] uppercase tracking-[0.1em] px-2 py-1 bg-secondary text-secondary-foreground"
                            style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-start gap-2 text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                        <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                        {lawyer.address}
                      </div>
                      <div className="flex items-center gap-2 text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                        <Phone className="w-3 h-3 flex-shrink-0" strokeWidth={1.5} />
                        {lawyer.phone}
                      </div>
                      <div className="flex items-center gap-2 text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                        <Mail className="w-3 h-3 flex-shrink-0" strokeWidth={1.5} />
                        {lawyer.email}
                      </div>
                    </div>
                    <button className="w-full px-4 py-2 border border-border hover:border-foreground transition-colors duration-200 text-[0.625rem] uppercase tracking-[0.12em]" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                      Contacter
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Right column: Map */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15, ease: 'linear' }}
              className="bg-card border border-border sticky top-20"
            >
              <div className="p-6 lg:p-8 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                    Trouver un avocat
                  </p>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${mapLoaded ? 'bg-accent' : 'bg-system-standby animate-pulse'}`} />
                    <span className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                      {mapLoaded ? 'Carte chargée' : 'Chargement'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
                    <input
                      type="text"
                      placeholder="Ville, code postal..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearchLawyers()}
                      className="w-full pl-10 pr-4 py-3 bg-input-background border border-border focus-precision transition-all duration-200 text-[0.875rem]"
                      style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}
                    />
                  </div>
                  <button
                    onClick={handleSearchLawyers}
                    disabled={searching || !searchQuery.trim()}
                    className="px-6 py-3 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200 text-[0.625rem] uppercase tracking-[0.12em] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
                  >
                    {searching ? <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.5} /> : 'Chercher'}
                  </button>
                </div>
              </div>

              {/* Google Maps Container */}
              <div className="w-full bg-secondary relative overflow-hidden" style={{ height: '520px', minHeight: '420px' }}>
                <div ref={mapRef} className="w-full h-full" />
                {mapLoaded && !(window as any).google && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/95 backdrop-blur-sm p-8">
                    <div className="text-center max-w-md">
                      <div className="w-12 h-12 mx-auto mb-4 border border-border flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="stroke-current text-muted-foreground">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="10" r="3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <p className="text-[0.75rem] text-muted-foreground mb-2" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                        Carte non disponible
                      </p>
                      <p className="text-[0.625rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                        La clé API Google Maps n'est pas configurée.
                        <br />
                        Utilisez la recherche ci-dessus pour trouver des avocats.
                      </p>
                    </div>
                  </div>
                )}
                {!mapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                    <p className="text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                      Chargement de la carte...
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
