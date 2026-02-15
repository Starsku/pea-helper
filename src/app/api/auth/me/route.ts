import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    return NextResponse.json({ user: { uid: decoded.uid, email: decoded.email || null } });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
