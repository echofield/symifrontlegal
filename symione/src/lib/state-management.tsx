import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';

// Types for application state
interface AppState {
  user: {
    isAuthenticated: boolean;
    profile: any | null;
    preferences: {
      theme: 'light' | 'dark' | 'system';
      language: 'fr' | 'en';
    };
  };
  ui: {
    currentView: string;
    sidebarOpen: boolean;
    notifications: Notification[];
    loading: {
      global: boolean;
      operations: Record<string, boolean>;
    };
  };
  contracts: {
    templates: any[];
    generated: any[];
    favorites: string[];
  };
  bond: {
    contracts: any[];
    templates: any[];
    currentContract: any | null;
  };
  conseiller: {
    history: any[];
    currentAnalysis: any | null;
  };
}

// Action types
type AppAction =
  | { type: 'SET_USER'; payload: any }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' | 'system' }
  | { type: 'SET_LANGUAGE'; payload: 'fr' | 'en' }
  | { type: 'SET_CURRENT_VIEW'; payload: string }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'SET_LOADING'; payload: { operation?: string; loading: boolean } }
  | { type: 'SET_CONTRACTS_TEMPLATES'; payload: any[] }
  | { type: 'ADD_GENERATED_CONTRACT'; payload: any }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'SET_BOND_CONTRACTS'; payload: any[] }
  | { type: 'SET_BOND_TEMPLATES'; payload: any[] }
  | { type: 'SET_CURRENT_BOND_CONTRACT'; payload: any | null }
  | { type: 'ADD_CONSEILLER_HISTORY'; payload: any }
  | { type: 'SET_CURRENT_ANALYSIS'; payload: any | null }
  | { type: 'RESET_STATE' };

// Notification type
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

// Initial state
const initialState: AppState = {
  user: {
    isAuthenticated: false,
    profile: null,
    preferences: {
      theme: 'system',
      language: 'fr',
    },
  },
  ui: {
    currentView: 'home',
    sidebarOpen: false,
    notifications: [],
    loading: {
      global: false,
      operations: {},
    },
  },
  contracts: {
    templates: [],
    generated: [],
    favorites: [],
  },
  bond: {
    contracts: [],
    templates: [],
    currentContract: null,
  },
  conseiller: {
    history: [],
    currentAnalysis: null,
  },
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: {
          ...state.user,
          profile: action.payload,
          isAuthenticated: !!action.payload,
        },
      };

    case 'SET_THEME':
      return {
        ...state,
        user: {
          ...state.user,
          preferences: {
            ...state.user.preferences,
            theme: action.payload,
          },
        },
      };

    case 'SET_LANGUAGE':
      return {
        ...state,
        user: {
          ...state.user,
          preferences: {
            ...state.user.preferences,
            language: action.payload,
          },
        },
      };

    case 'SET_CURRENT_VIEW':
      return {
        ...state,
        ui: {
          ...state.ui,
          currentView: action.payload,
        },
      };

    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarOpen: !state.ui.sidebarOpen,
        },
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: [...state.ui.notifications, action.payload],
        },
      };

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.filter(n => n.id !== action.payload),
        },
      };

    case 'SET_LOADING':
      if (action.payload.operation) {
        return {
          ...state,
          ui: {
            ...state.ui,
            loading: {
              ...state.ui.loading,
              operations: {
                ...state.ui.loading.operations,
                [action.payload.operation]: action.payload.loading,
              },
            },
          },
        };
      }
      return {
        ...state,
        ui: {
          ...state.ui,
          loading: {
            ...state.ui.loading,
            global: action.payload.loading,
          },
        },
      };

    case 'SET_CONTRACTS_TEMPLATES':
      return {
        ...state,
        contracts: {
          ...state.contracts,
          templates: action.payload,
        },
      };

    case 'ADD_GENERATED_CONTRACT':
      return {
        ...state,
        contracts: {
          ...state.contracts,
          generated: [...state.contracts.generated, action.payload],
        },
      };

    case 'TOGGLE_FAVORITE':
      const favorites = state.contracts.favorites.includes(action.payload)
        ? state.contracts.favorites.filter(id => id !== action.payload)
        : [...state.contracts.favorites, action.payload];
      return {
        ...state,
        contracts: {
          ...state.contracts,
          favorites,
        },
      };

    case 'SET_BOND_CONTRACTS':
      return {
        ...state,
        bond: {
          ...state.bond,
          contracts: action.payload,
        },
      };

    case 'SET_BOND_TEMPLATES':
      return {
        ...state,
        bond: {
          ...state.bond,
          templates: action.payload,
        },
      };

    case 'SET_CURRENT_BOND_CONTRACT':
      return {
        ...state,
        bond: {
          ...state.bond,
          currentContract: action.payload,
        },
      };

    case 'ADD_CONSEILLER_HISTORY':
      return {
        ...state,
        conseiller: {
          ...state.conseiller,
          history: [...state.conseiller.history, action.payload],
        },
      };

    case 'SET_CURRENT_ANALYSIS':
      return {
        ...state,
        conseiller: {
          ...state.conseiller,
          currentAnalysis: action.payload,
        },
      };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Custom hooks for specific state slices
export function useUser() {
  const { state, dispatch } = useApp();
  
  const setUser = useCallback((user: any) => {
    dispatch({ type: 'SET_USER', payload: user });
  }, [dispatch]);

  const setTheme = useCallback((theme: 'light' | 'dark' | 'system') => {
    dispatch({ type: 'SET_THEME', payload: theme });
  }, [dispatch]);

  const setLanguage = useCallback((language: 'fr' | 'en') => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  }, [dispatch]);

  return {
    user: state.user,
    setUser,
    setTheme,
    setLanguage,
  };
}

export function useUI() {
  const { state, dispatch } = useApp();
  
  const setCurrentView = useCallback((view: string) => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: view });
  }, [dispatch]);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  }, [dispatch]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    dispatch({ type: 'ADD_NOTIFICATION', payload: { ...notification, id } });
    
    // Auto-remove notification after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
      }, notification.duration || 5000);
    }
  }, [dispatch]);

  const removeNotification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }, [dispatch]);

  const setLoading = useCallback((operation: string | undefined, loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: { operation, loading } });
  }, [dispatch]);

  return {
    ui: state.ui,
    setCurrentView,
    toggleSidebar,
    addNotification,
    removeNotification,
    setLoading,
  };
}

export function useContracts() {
  const { state, dispatch } = useApp();
  
  const setTemplates = useCallback((templates: any[]) => {
    dispatch({ type: 'SET_CONTRACTS_TEMPLATES', payload: templates });
  }, [dispatch]);

  const addGeneratedContract = useCallback((contract: any) => {
    dispatch({ type: 'ADD_GENERATED_CONTRACT', payload: contract });
  }, [dispatch]);

  const toggleFavorite = useCallback((templateId: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: templateId });
  }, [dispatch]);

  return {
    contracts: state.contracts,
    setTemplates,
    addGeneratedContract,
    toggleFavorite,
  };
}

export function useBond() {
  const { state, dispatch } = useApp();
  
  const setContracts = useCallback((contracts: any[]) => {
    dispatch({ type: 'SET_BOND_CONTRACTS', payload: contracts });
  }, [dispatch]);

  const setTemplates = useCallback((templates: any[]) => {
    dispatch({ type: 'SET_BOND_TEMPLATES', payload: templates });
  }, [dispatch]);

  const setCurrentContract = useCallback((contract: any | null) => {
    dispatch({ type: 'SET_CURRENT_BOND_CONTRACT', payload: contract });
  }, [dispatch]);

  return {
    bond: state.bond,
    setContracts,
    setTemplates,
    setCurrentContract,
  };
}

export function useConseiller() {
  const { state, dispatch } = useApp();
  
  const addHistory = useCallback((analysis: any) => {
    dispatch({ type: 'ADD_CONSEILLER_HISTORY', payload: analysis });
  }, [dispatch]);

  const setCurrentAnalysis = useCallback((analysis: any | null) => {
    dispatch({ type: 'SET_CURRENT_ANALYSIS', payload: analysis });
  }, [dispatch]);

  return {
    conseiller: state.conseiller,
    addHistory,
    setCurrentAnalysis,
  };
}

// Persistence utilities
export function usePersistence() {
  const { state, dispatch } = useApp();

  const saveToStorage = useCallback(() => {
    try {
      localStorage.setItem('symi-app-state', JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save state to localStorage:', error);
    }
  }, [state]);

  const loadFromStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem('symi-app-state');
      if (saved) {
        const parsedState = JSON.parse(saved);
        // Only restore safe parts of the state
        if (parsedState.user?.preferences) {
          dispatch({ type: 'SET_THEME', payload: parsedState.user.preferences.theme });
          dispatch({ type: 'SET_LANGUAGE', payload: parsedState.user.preferences.language });
        }
        if (parsedState.contracts?.favorites) {
          parsedState.contracts.favorites.forEach((id: string) => {
            dispatch({ type: 'TOGGLE_FAVORITE', payload: id });
          });
        }
      }
    } catch (error) {
      console.error('Failed to load state from localStorage:', error);
    }
  }, [dispatch]);

  const clearStorage = useCallback(() => {
    try {
      localStorage.removeItem('symi-app-state');
      dispatch({ type: 'RESET_STATE' });
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }, [dispatch]);

  return {
    saveToStorage,
    loadFromStorage,
    clearStorage,
  };
}
