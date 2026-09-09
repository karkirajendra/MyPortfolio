export const EMAIL = "rajendrakarki0614@gmail.com";

export const GMAIL_COMPOSE = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}&su=${encodeURIComponent("Portfolio inquiry")}&body=${encodeURIComponent("Hi Rajendra,\n\n")}`;

/** Opens Gmail compose in a new tab — works in browser without a desktop mail app. */
export function openEmail() {
  window.open(GMAIL_COMPOSE, "_blank", "noopener,noreferrer");
}
