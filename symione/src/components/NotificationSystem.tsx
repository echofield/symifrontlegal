import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useUI } from './state-management';

interface NotificationProps {
  notification: {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
    actions?: Array<{
      label: string;
      action: () => void;
    }>;
  };
  onRemove: (id: string) => void;
}

function NotificationItem({ notification, onRemove }: NotificationProps) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const Icon = icons[notification.type];

  useEffect(() => {
    if (notification.duration !== 0) {
      const timer = setTimeout(() => {
        onRemove(notification.id);
      }, notification.duration || 5000);

      return () => clearTimeout(timer);
    }
  }, [notification.id, notification.duration, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${colors[notification.type]}`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium">{notification.title}</p>
            <p className="mt-1 text-sm opacity-90">{notification.message}</p>
            {notification.actions && notification.actions.length > 0 && (
              <div className="mt-3 flex space-x-2">
                {notification.actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="text-sm font-medium underline hover:no-underline"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => onRemove(notification.id)}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function NotificationContainer() {
  const { ui, removeNotification } = useUI();

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        <AnimatePresence>
          {ui.notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRemove={removeNotification}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Enhanced toast system that integrates with the state management
export function useToast() {
  const { addNotification } = useUI();

  const toast = {
    success: (title: string, message?: string, options?: { duration?: number; actions?: any[] }) => {
      addNotification({
        type: 'success',
        title,
        message: message || '',
        ...options,
      });
    },
    error: (title: string, message?: string, options?: { duration?: number; actions?: any[] }) => {
      addNotification({
        type: 'error',
        title,
        message: message || '',
        ...options,
      });
    },
    warning: (title: string, message?: string, options?: { duration?: number; actions?: any[] }) => {
      addNotification({
        type: 'warning',
        title,
        message: message || '',
        ...options,
      });
    },
    info: (title: string, message?: string, options?: { duration?: number; actions?: any[] }) => {
      addNotification({
        type: 'info',
        title,
        message: message || '',
        ...options,
      });
    },
  };

  return toast;
}

// Legacy compatibility function
export function showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
  // This is a fallback for components that haven't been updated yet
  console.warn('showToast is deprecated. Use useToast hook instead.');
  
  // Try to get the toast function from context if available
  try {
    const { addNotification } = useUI();
    addNotification({
      type,
      title: type === 'error' ? 'Erreur' : type === 'success' ? 'Succès' : type === 'warning' ? 'Attention' : 'Information',
      message,
    });
  } catch {
    // Fallback to console if context is not available
    console[type === 'error' ? 'error' : type === 'warning' ? 'warn' : 'log'](message);
  }
}
