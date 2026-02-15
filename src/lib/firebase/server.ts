import "server-only";

import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function buildAdminApp(): App {
  const existing = getApps();
  if (existing.length) return existing[0]!;

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (serviceAccountJson) {
    const serviceAccount = JSON.parse(serviceAccountJson);
    return initializeApp({
      credential: cert(serviceAccount),
    });
  }

  // Fallback: Application Default Credentials (ADC)
  // Requires local `gcloud auth application-default login` or configured SA on hosting.
  return initializeApp();
}

export const firebaseAdminApp = buildAdminApp();
export const adminAuth = getAuth(firebaseAdminApp);
