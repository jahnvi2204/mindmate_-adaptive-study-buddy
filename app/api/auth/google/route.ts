import { NextResponse } from "next/server";
import crypto from "crypto";

const isProd = process.env.NODE_ENV === "production";
const stateCookie = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: isProd,
  path: "/",
  maxAge: 600,
};

const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || "";

export async function GET() {
  const state = crypto.randomUUID();

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID ?? "",
    redirect_uri: `${getBaseUrl()}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid profile email",
    access_type: "offline",
    prompt: "consent",
    state,
  });

  const res = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );

  res.cookies.set("oauth_state", state, stateCookie);
  return res;
}

