import { useEffect, useRef, useState } from 'react';

/**
 * A hook that safely handles async operations with automatic cleanup
 * Prevents memory leaks by canceling pending requests on component unmount
 *
 * @param asyncFn - The async function to execute
 * @param deps - Dependencies array for the effect
 * @returns Object containing data, error, and loading state
 */
export function useSafeAsync<T>(
  asyncFn: () => Promise<T>,
  deps: readonly unknown[]
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setLoading(true);
    setError(null);

    asyncFn()
      .then(result => {
        if (!abortController.signal.aborted) {
          setData(result);
        }
      })
      .catch(err => {
        if (!abortController.signal.aborted) {
          setError(err);
        }
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error, loading };
}

/**
 * A hook for making fetch requests with automatic cancellation
 * Uses AbortController to cancel pending requests on unmount
 * 
 * @param url - The URL to fetch
 * @param options - Fetch options (excluding signal, which is managed internally)
 * @param deps - Dependencies array for the effect
 * @returns Object containing data, error, and loading state
 */
export function useSafeFetch<T>(
  url: string,
  options?: Omit<RequestInit, 'signal'>,
  deps: readonly unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setLoading(true);
    setError(null);

    fetch(url, {
      ...options,
      signal: abortController.signal,
    })
      .then(async response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(result => {
        if (!abortController.signal.aborted) {
          setData(result);
        }
      })
      .catch(err => {
        if (!abortController.signal.aborted) {
          // Don't set error for abort errors
          if (err.name !== 'AbortError') {
            setError(err);
          }
        }
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...deps]);

  return { data, error, loading };
}
