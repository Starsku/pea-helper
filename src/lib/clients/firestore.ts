import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  addDoc,
  where,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase/client";
import { normalizeClientRef } from "@/lib/clients/normalize";
import type { WithdrawalDoc, WithdrawalResultSnapshot, WithdrawalInputSnapshot } from "@/lib/clients/types";

export function userDoc(uid: string) {
  if (!firestore) throw new Error("Firestore not configured");
  return doc(firestore, "users", uid);
}

export function clientDoc(uid: string, clientId: string) {
  if (!firestore) throw new Error("Firestore not configured");
  return doc(firestore, "users", uid, "clients", clientId);
}

export function withdrawalsCol(uid: string, clientId: string) {
  if (!firestore) throw new Error("Firestore not configured");
  return collection(firestore, "users", uid, "clients", clientId, "withdrawals");
}

export async function upsertClient(uid: string, clientRefRaw: string) {
  const clientId = normalizeClientRef(clientRefRaw);
  if (!clientId) throw new Error("Client ref empty");

  const ref = clientDoc(uid, clientId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      clientId,
      clientRefRaw,
      clientRef: clientId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else {
    await setDoc(
      ref,
      { clientRefRaw, updatedAt: serverTimestamp() },
      { merge: true }
    );
  }
  return { clientId };
}

export async function saveWithdrawal(
  uid: string,
  clientRefRaw: string,
  input: WithdrawalInputSnapshot,
  result: WithdrawalResultSnapshot
) {
  const clientId = normalizeClientRef(clientRefRaw);
  if (!clientId) throw new Error("Client ref empty");

  await upsertClient(uid, clientRefRaw);

  await addDoc(withdrawalsCol(uid, clientId), {
    clientRefRaw,
    clientId,
    input,
    result,
    createdAt: serverTimestamp(),
  } satisfies WithdrawalDoc);

  return { clientId };
}

export async function listClientSuggestions(uid: string, prefixRaw: string) {
  const prefix = normalizeClientRef(prefixRaw);
  if (!prefix) return [] as Array<{ clientId: string; clientRefRaw?: string }>;

  // Simple prefix search using range on clientId
  const end = prefix + "\uf8ff";
  if (!firestore) throw new Error("Firestore not configured");

  const q = query(
    collection(firestore, "users", uid, "clients"),
    where("clientId", ">=", prefix),
    where("clientId", "<=", end),
    orderBy("clientId"),
    limit(10)
  );

  const snaps = await getDocs(q);
  return snaps.docs.map((d) => {
    const data = d.data() as any;
    return { clientId: data.clientId || d.id, clientRefRaw: data.clientRefRaw };
  });
}

export async function loadLastWithdrawal(uid: string, clientRefRaw: string) {
  const clientId = normalizeClientRef(clientRefRaw);
  if (!clientId) return null;

  const q = query(withdrawalsCol(uid, clientId), orderBy("createdAt", "desc"), limit(1));
  const snaps = await getDocs(q);
  const docSnap = snaps.docs[0];
  if (!docSnap) return null;
  return docSnap.data() as any as WithdrawalDoc;
}
