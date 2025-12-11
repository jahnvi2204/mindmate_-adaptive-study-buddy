import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const isProd = process.env.NODE_ENV === "production";
const stateCookie = {
  httpOnly: true,
  sameSite: "none" as const, // send with OAuth redirect (cross-site)
  secure: true, // Required for sameSite: "none" - always true in production
  path: "/",
  maxAge: 600, // 10 minutes
};

// Helper to create signed state (fallback if cookies fail)
const createSignedState = (state: string): string => {
  const appSecret = process.env.APP_SECRET || "fallback-secret";
  const signature = crypto
    .createHmac('sha256', appSecret)
    .update(state)
    .digest('hex');
  return `${state}.${signature}`;
};

const getBaseUrl = (req: NextRequest) => {
  // Always derive from the incoming request to avoid cross-domain cookie issues.
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
};

export async function GET(req: NextRequest) {
  if (!process.env.GOOGLE_CLIENT_ID) {
    console.error("Missing GOOGLE_CLIENT_ID environment variable");
    return NextResponse.json({ 
      error: "Server configuration error: GOOGLE_CLIENT_ID is not set" 
    }, { status: 500 });
  }

  const state = crypto.randomUUID();
  const baseUrl = getBaseUrl(req);
  
  // Create signed state as fallback (in case cookies are blocked)
  const signedState = createSignedState(state);

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${baseUrl}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid profile email",
    access_type: "offline",
    prompt: "consent",
    state: signedState, // Use signed state instead of plain state
  });

  const res = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );

  // Still set cookie as primary method
  res.cookies.set("oauth_state", state, stateCookie);
  return res;
}

