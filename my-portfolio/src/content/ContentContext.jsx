import { useCallback, useEffect, useMemo, useState } from "react";
import { ContentContext, fallback } from "./context.js";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export function ContentProvider({ children }) {
  const [content, setContent] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [fromApi, setFromApi] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/content`);
      if (!res.ok) throw new Error("Failed to load content");
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) throw new Error("Non-JSON response");
      const data = await res.json();
      setContent({ ...fallback, ...data, site: { ...fallback.site, ...(data.site || {}) } });
      setFromApi(true);
    } catch {
      setContent(fallback);
      setFromApi(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/content`);
        if (!res.ok) throw new Error("Failed to fetch");
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) throw new Error("Non-JSON response");
        const data = await res.json();
        if (active) {
          setContent({ ...fallback, ...data, site: { ...fallback.site, ...(data.site || {}) } });
          setFromApi(true);
        }
      } catch {
        if (active) {
          setContent(fallback);
          setFromApi(false);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(() => ({ content, loading, fromApi, refresh }), [content, loading, fromApi, refresh]);
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}
