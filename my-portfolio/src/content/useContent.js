import { useContext } from "react";
import { ContentContext } from "./context.js";

export function useContent() {
  return useContext(ContentContext);
}
