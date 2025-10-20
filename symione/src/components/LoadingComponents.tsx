import React from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <Loader2 
      className={`animate-spin ${sizeClasses[size]} ${className}`}
      strokeWidth={1.5}
    />
  );
}

interface LoadingOverlayProps {
  message?: string;
  progress?: number;
  showProgress?: boolean;
}

export function LoadingOverlay({ 
  message = 'Chargement...', 
  progress, 
  showProgress = false 
}: LoadingOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="bg-card border border-border rounded-lg p-8 max-w-sm w-full mx-4">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {message}
          </h3>
          
          {showProgress && typeof progress === 'number' && (
            <div className="mt-4">
              <div className="w-full bg-muted rounded-full h-2">
                <motion.div
                  className="bg-accent h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {Math.round(progress)}%
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface LoadingCardProps {
  message?: string;
  className?: string;
}

export function LoadingCard({ message = 'Chargement...', className = '' }: LoadingCardProps) {
  return (
    <div className={`bg-card border border-border rounded-lg p-8 ${className}`}>
      <div className="text-center">
        <LoadingSpinner size="md" className="mx-auto mb-4" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className = '', lines = 1 }: SkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="bg-muted rounded h-4 mb-2"
          style={{
            width: i === lines - 1 ? '75%' : '100%',
          }}
        />
      ))}
    </div>
  );
}

interface LoadingButtonProps {
  loading: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export function LoadingButton({
  loading,
  children,
  className = '',
  disabled = false,
  onClick,
  type = 'button',
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2
        ${loading || disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:shadow-lg'
        }
        ${className}
      `}
    >
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  );
}

// Hook for managing loading states
export function useLoadingState(initialState = false) {
  const [loading, setLoading] = React.useState(initialState);
  const [error, setError] = React.useState<string | null>(null);

  const startLoading = React.useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  const stopLoading = React.useCallback(() => {
    setLoading(false);
  }, []);

  const setErrorState = React.useCallback((errorMessage: string) => {
    setError(errorMessage);
    setLoading(false);
  }, []);

  const reset = React.useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setErrorState,
    reset,
  };
}
