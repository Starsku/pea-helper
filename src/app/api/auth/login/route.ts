import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/server";
import {
  SESSION_COOKIE_MAX_AGE_MS,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { idToken?: string };
    const idToken = body?.idToken;

    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    const decoded = await adminAuth.verifyIdToken(idToken);

    // Extra safety: only allow for existing users
    await adminAuth.getUser(decoded.uid);

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_COOKIE_MAX_AGE_MS,
    });

    const res = NextResponse.json({ ok: true });
    res.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Math.floor(SESSION_COOKIE_MAX_AGE_MS / 1000),
    });

    return res;
  } catch (e) {
    console.error("/api/auth/login error", e);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
