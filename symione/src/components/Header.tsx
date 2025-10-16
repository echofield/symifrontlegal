import { User } from "lucide-react";

interface HeaderProps {
  onThemeChange?: (theme: 'white' | 'offwhite' | 'night') => void;
  currentTheme?: 'white' | 'offwhite' | 'night';
}

export function Header({ onThemeChange, currentTheme }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-[1920px] mx-auto px-8 lg:px-16 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-[1.5rem] tracking-[-0.03em]" style={{ fontWeight: 700, lineHeight: 1 }}>
            LEX-ENGINE
          </h1>
        </div>

        {/* Theme Switcher & User */}
        <div className="flex items-center gap-6">
          {/* Theme variant switcher */}
          {onThemeChange && (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => onThemeChange('white')}
                className={`w-6 h-6 rounded-full border transition-all ${
                  currentTheme === 'white' ? 'border-foreground border-2' : 'border-border'
                }`}
                style={{ backgroundColor: '#ffffff' }}
                aria-label="White theme"
              />
              <button
                onClick={() => onThemeChange('offwhite')}
                className={`w-6 h-6 rounded-full border transition-all ${
                  currentTheme === 'offwhite' ? 'border-foreground border-2' : 'border-border'
                }`}
                style={{ backgroundColor: '#fafafa' }}
                aria-label="Off-white theme"
              />
              <button
                onClick={() => onThemeChange('night')}
                className={`w-6 h-6 rounded-full border transition-all ${
                  currentTheme === 'night' ? 'border-muted-foreground border-2' : 'border-border'
                }`}
                style={{ backgroundColor: '#0a0a0a' }}
                aria-label="Night theme"
              />
            </div>
          )}
          
          <button 
            className="w-10 h-10 rounded-full bg-secondary hover:bg-accent hover:text-accent-foreground transition-all duration-300 flex items-center justify-center"
            aria-label="User menu"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
