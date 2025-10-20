import { useEffect, useRef, useCallback } from 'react';

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTiming(name: string): void {
    this.metrics.set(name, performance.now());
  }

  endTiming(name: string): number {
    const startTime = this.metrics.get(name);
    if (!startTime) {
      console.warn(`No start time found for ${name}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.metrics.delete(name);
    
    // Log slow operations
    if (duration > 1000) {
      console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.startTiming(name);
    return fn().finally(() => {
      this.endTiming(name);
    });
  }

  measureSync<T>(name: string, fn: () => T): T {
    this.startTiming(name);
    const result = fn();
    this.endTiming(name);
    return result;
  }

  // Monitor Core Web Vitals
  startWebVitalsMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    } catch (e) {
      console.warn('LCP monitoring not supported');
    }

    // First Input Delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          console.log('FID:', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    } catch (e) {
      console.warn('FID monitoring not supported');
    }

    // Cumulative Layout Shift
    try {
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        if (clsValue > 0) {
          console.log('CLS:', clsValue);
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    } catch (e) {
      console.warn('CLS monitoring not supported');
    }
  }

  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// React hooks for performance monitoring
export function usePerformanceMonitor() {
  const monitor = PerformanceMonitor.getInstance();

  const measureRender = useCallback((componentName: string) => {
    return {
      start: () => monitor.startTiming(`${componentName}-render`),
      end: () => monitor.endTiming(`${componentName}-render`),
    };
  }, [monitor]);

  const measureAsync = useCallback(<T>(name: string, fn: () => Promise<T>) => {
    return monitor.measureAsync(name, fn);
  }, [monitor]);

  const measureSync = useCallback(<T>(name: string, fn: () => T) => {
    return monitor.measureSync(name, fn);
  }, [monitor]);

  return {
    measureRender,
    measureAsync,
    measureSync,
  };
}

// Hook to monitor component render performance
export function useRenderPerformance(componentName: string) {
  const { measureRender } = usePerformanceMonitor();
  const renderMetrics = useRef(measureRender(componentName));

  useEffect(() => {
    renderMetrics.current.start();
    return () => {
      renderMetrics.current.end();
    };
  });
}

// Hook to monitor API call performance
export function useAPIPerformance() {
  const { measureAsync } = usePerformanceMonitor();

  const measureAPICall = useCallback(async <T>(
    endpoint: string,
    apiCall: () => Promise<T>
  ): Promise<T> => {
    return measureAsync(`api-${endpoint}`, apiCall);
  }, [measureAsync]);

  return { measureAPICall };
}

// Hook to monitor user interactions
export function useInteractionPerformance() {
  const { measureSync } = usePerformanceMonitor();

  const measureInteraction = useCallback(<T>(
    action: string,
    callback: () => T
  ): T => {
    return measureSync(`interaction-${action}`, callback);
  }, [measureSync]);

  return { measureInteraction };
}

// Memory usage monitoring
export function useMemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        setMemoryInfo((performance as any).memory);
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000);

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
}

// Bundle size monitoring
export function useBundleAnalyzer() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Log bundle information in development
      console.log('Bundle analysis:', {
        userAgent: navigator.userAgent,
        connection: (navigator as any).connection,
        deviceMemory: (navigator as any).deviceMemory,
      });
    }
  }, []);
}

// Performance optimization utilities
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
}

// Lazy loading utilities
export function useLazyLoad(
  threshold: number = 0.1
): [React.RefObject<HTMLElement>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return [ref, isIntersecting];
}

// Initialize performance monitoring
export function initializePerformanceMonitoring() {
  if (typeof window === 'undefined') return;

  const monitor = PerformanceMonitor.getInstance();
  monitor.startWebVitalsMonitoring();

  // Monitor page load performance
  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      console.log('Page load metrics:', {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalTime: navigation.loadEventEnd - navigation.fetchStart,
      });
    }, 0);
  });

  return monitor;
}
