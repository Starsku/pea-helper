import "server-only";

export const SESSION_COOKIE_NAME =
  process.env.AUTH_SESSION_COOKIE_NAME || "pea_helper_session";

export const SESSION_COOKIE_MAX_AGE_DAYS =
  Number(process.env.AUTH_SESSION_COOKIE_MAX_AGE_DAYS || 14);

export const SESSION_COOKIE_MAX_AGE_MS =
  SESSION_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
