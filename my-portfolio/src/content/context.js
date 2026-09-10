import { createContext } from "react";
import { buildDefaultStore } from "../../server/defaultContent.js";

export const fallback = (() => {
  const store = buildDefaultStore({ email: "", passwordHash: "" });
  delete store.admin;
  return store;
})();

export const ContentContext = createContext({
  content: fallback,
  loading: true,
  fromApi: false,
  refresh: () => Promise.resolve(),
});
