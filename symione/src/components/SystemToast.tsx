import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastCounter = 0;
const toastListeners = new Set<(toast: Toast) => void>();

export function showToast(message: string, type: ToastType = 'info') {
  const toast: Toast = {
    id: `toast-${++toastCounter}`,
    message,
    type,
  };
  toastListeners.forEach((listener) => listener(toast));
}

export function SystemToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (toast: Toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        console.log('🔍 Filter debug:', {
          array: toasts,
          arrayType: typeof toasts,
          isArray: Array.isArray(toasts),
          location: 'SystemToast timeout cleanup'
        });
        setToasts((prev) => (prev || []).filter((t) => t && t.id !== toast.id));
      }, 5000);
    };
    toastListeners.add(listener);
    return () => {
      toastListeners.delete(listener);
    };
  }, []);

  const removeToast = (id: string) => {
    console.log('🔍 Filter debug:', {
      array: toasts,
      arrayType: typeof toasts,
      isArray: Array.isArray(toasts),
      location: 'SystemToast removeToast'
    });
    setToasts((prev) => (prev || []).filter((t) => t && t.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'linear' }}
            className="bg-card border border-border p-4 pr-12 min-w-[320px] max-w-md shadow-lg pointer-events-auto relative"
          >
            <div className="flex items-start gap-3">
              {toast.type === 'success' && (
                <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" strokeWidth={1.5} />
              )}
              {toast.type === 'error' && (
                <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" strokeWidth={1.5} />
              )}
              {toast.type === 'info' && (
                <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" strokeWidth={1.5} />
              )}
              <p
                className="text-[0.8125rem] flex-1"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 300, lineHeight: 1.5 }}
              >
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
