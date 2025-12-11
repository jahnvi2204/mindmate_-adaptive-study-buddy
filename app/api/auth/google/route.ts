import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const isProd = process.env.NODE_ENV === "production";
const stateCookie = {
  httpOnly: true,
  sameSite: "none" as const, // send with OAuth redirect (cross-site)
  secure: isProd,
  path: "/",
  maxAge: 600,
};

const getBaseUrl = (req: NextRequest) => {
  // Always derive from the incoming request to avoid cross-domain cookie issues.
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
};

export async function GET(req: NextRequest) {
  const state = crypto.randomUUID();
  const baseUrl = getBaseUrl(req);

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID ?? "",
    redirect_uri: `${baseUrl}/api/auth/google/callback`,
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

