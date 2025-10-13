import { useState, useEffect } from 'react';

export function useRateLimitCountdown(resetSec: number) {
  const [remaining, setRemaining] = useState(resetSec);

  useEffect(() => {
    if (remaining <= 0) return;
    const timer = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [remaining]);

  return remaining;
}
