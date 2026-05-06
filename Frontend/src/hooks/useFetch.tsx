// src/hooks/useFetch.tsx
import { useState, useEffect, useCallback } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export function useFetch<T = any>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth(url, {
        method: "GET",
        ...options,
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unkown Error on useFetch");
    } finally {
      setLoading(false);
    }
  }, [url, options]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return { data, loading, error, refetch: fetchData };
}
