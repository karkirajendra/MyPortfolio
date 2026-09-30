const JSON_HEADERS = { "Content-Type": "application/json" };
const TOKEN_KEY = "portfolio_admin_token";
const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    /* ignore storage errors */
  }
}

export function clearStoredToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export async function api(path, opts = {}) {
  const { json, form, headers = {}, ...rest } = opts;
  const token = getStoredToken();
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const init = {
    credentials: "include",
    headers: {
      ...authHeaders,
      ...headers,
    },
    ...rest,
  };

  if (form) {
    init.body = form;
  } else if (json !== undefined) {
    init.headers = { ...JSON_HEADERS, ...init.headers };
    init.body = JSON.stringify(json);
  }

  const res = await fetch(`${API_BASE}/api${path}`, init);

  const contentType = res.headers.get("content-type") || "";
  let data;
  if (contentType.includes("application/json")) {
    data = await res.json().catch(() => ({}));
  } else {
    // Received HTML or non-JSON (e.g. SPA fallback index.html, proxy 404/502)
    if (path !== "/auth/login") {
      clearStoredToken();
    }
    const err = new Error(
      `API returned non-JSON response (${res.status} ${res.statusText}). Check backend connection and VITE_API_URL.`
    );
    err.status = res.status;
    throw err;
  }

  if (!res.ok) {
    if (res.status === 401 && path !== "/auth/login") {
      clearStoredToken();
    }
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }

  return data;
}
