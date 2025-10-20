import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// State management types
interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

interface UIState {
  notifications: Notification[];
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  loading: boolean;
}

interface UIStateAction {
  type: 'ADD_NOTIFICATION' | 'REMOVE_NOTIFICATION' | 'SET_THEME' | 'SET_SIDEBAR_OPEN' | 'SET_LOADING';
  payload?: any;
}

// Initial state
const initialState: UIState = {
  notifications: [],
  theme: 'system',
  sidebarOpen: false,
  loading: false,
};

// Reducer
function uiReducer(state: UIState, action: UIStateAction): UIState {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, { ...action.payload, id: Date.now().toString() }],
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };
    
    case 'SET_SIDEBAR_OPEN':
      return {
        ...state,
        sidebarOpen: action.payload,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    
    default:
      return state;
  }
}

// Context
interface UIContextType {
  ui: UIState;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setSidebarOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

// Provider component
interface UIProviderProps {
  children: ReactNode;
}

export function UIProvider({ children }: UIProviderProps) {
  const [ui, dispatch] = useReducer(uiReducer, initialState);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  const setSidebarOpen = (open: boolean) => {
    dispatch({ type: 'SET_SIDEBAR_OPEN', payload: open });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  return (
    <UIContext.Provider
      value={{
        ui,
        addNotification,
        removeNotification,
        setTheme,
        setSidebarOpen,
        setLoading,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

// Hook to use the UI context
export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}

// Theme management utilities
export function useTheme() {
  const { ui, setTheme } = useUI();
  
  const toggleTheme = () => {
    const newTheme = ui.theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return {
    theme: ui.theme,
    setTheme,
    toggleTheme,
  };
}

// Loading state management
export function useLoadingState() {
  const { ui, setLoading } = useUI();
  
  return {
    loading: ui.loading,
    setLoading,
  };
}

// Sidebar management
export function useSidebar() {
  const { ui, setSidebarOpen } = useUI();
  
  const toggleSidebar = () => {
    setSidebarOpen(!ui.sidebarOpen);
  };

  return {
    sidebarOpen: ui.sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
  };
}
