import { useState } from "react";
const useAuthForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(url: string, data: object) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Request Failed");
      return result;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unkown Error");
      throw err;
    } finally {
      setLoading(false);
    }
  }
  return { loading, error, submit };
};

export default useAuthForm;
