import { Phone, Mail, MapPin, Scale } from 'lucide-react';

interface LawyerContactCardProps {
  lawyer: {
    name?: string;
    nom?: string;
    specialty?: string;
    specialties?: string[];
    specialites?: string[];
    city?: string;
    address?: string;
    adresse?: string;
    phone?: string;
    telephone?: string;
    email?: string;
    experience?: string;
    rating?: number;
    isPriority?: boolean;
  };
}

export function LawyerContactCard({ lawyer }: LawyerContactCardProps) {
  const name = lawyer.name || lawyer.nom || 'Nom non disponible';
  const specialty = lawyer.specialty || lawyer.specialties?.[0] || lawyer.specialites?.[0] || 'Droit général';
  const city = lawyer.city || 'Ville non disponible';
  const address = lawyer.address || lawyer.adresse;
  const phone = lawyer.phone || lawyer.telephone;
  const email = lawyer.email;
  const experience = lawyer.experience;
  const rating = lawyer.rating;
  const isPriority = lawyer.isPriority;

  return (
    <div className="border border-border bg-card p-6 hover:border-accent/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Scale className="w-5 h-5 text-accent" strokeWidth={1.5} />
            </div>
            <div>
              <h3 
                className="text-[1.125rem] tracking-[-0.01em]"
                style={{ fontWeight: 600, lineHeight: 1.2 }}
              >
                {name}
              </h3>
              {isPriority && (
                <span 
                  className="inline-block mt-1 px-2 py-0.5 bg-accent/10 text-accent text-[0.625rem] uppercase tracking-[0.08em]"
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
                >
                  Référencé SYMIONE
                </span>
              )}
            </div>
          </div>

          <p 
            className="text-[0.875rem] text-muted-foreground mb-1"
            style={{ lineHeight: 1.5 }}
          >
            {specialty}
          </p>

          {experience && (
            <p 
              className="text-[0.75rem] text-muted-foreground"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Expérience: {experience}
            </p>
          )}

          {rating !== undefined && rating > 0 && (
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i}
                  className={`w-4 h-4 ${i < rating ? 'text-accent fill-accent' : 'text-muted-foreground/20 fill-muted-foreground/20'}`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4 pt-4 border-t border-border">
        {address && (
          <div className="flex items-start gap-2 text-[0.8125rem]">
            <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" strokeWidth={1.5} />
            <span className="text-muted-foreground">{address}</span>
          </div>
        )}
        {!address && city && (
          <div className="flex items-start gap-2 text-[0.8125rem]">
            <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" strokeWidth={1.5} />
            <span className="text-muted-foreground">{city}</span>
          </div>
        )}
        {phone && (
          <div className="flex items-center gap-2 text-[0.8125rem]">
            <Phone className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            <a href={`tel:${phone}`} className="text-muted-foreground hover:text-foreground transition-colors">
              {phone}
            </a>
          </div>
        )}
        {email && (
          <div className="flex items-center gap-2 text-[0.8125rem]">
            <Mail className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            <a href={`mailto:${email}`} className="text-muted-foreground hover:text-foreground transition-colors">
              {email}
            </a>
          </div>
        )}
      </div>

      <button
        onClick={() => {
          if (phone) {
            window.location.href = `tel:${phone}`;
          } else if (email) {
            window.location.href = `mailto:${email}`;
          }
        }}
        disabled={!phone && !email}
        className="w-full px-6 py-3 border border-border hover:border-foreground hover:bg-accent/5 transition-all text-[0.75rem] uppercase tracking-[0.12em] disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
      >
        Contacter
      </button>
    </div>
  );
}

