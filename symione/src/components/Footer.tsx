export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-[1920px] mx-auto px-8 lg:px-16 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Left side */}
          <div className="flex flex-col gap-2">
            <p className="text-[0.75rem] text-muted-foreground uppercase tracking-wide" style={{ fontWeight: 500 }}>
              © 2025 LEX-ENGINE
            </p>
            <p className="text-[0.75rem] text-muted-foreground">
              Intelligent legal systems for modern practices
            </p>
          </div>

          {/* Right side - Links */}
          <div className="flex gap-8">
            <a 
              href="#privacy" 
              className="text-[0.75rem] text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wide"
              style={{ fontWeight: 500 }}
            >
              Privacy
            </a>
            <a 
              href="#terms" 
              className="text-[0.75rem] text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wide"
              style={{ fontWeight: 500 }}
            >
              Terms
            </a>
            <a 
              href="#support" 
              className="text-[0.75rem] text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wide"
              style={{ fontWeight: 500 }}
            >
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
