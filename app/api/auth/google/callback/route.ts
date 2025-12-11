import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const isProd = process.env.NODE_ENV === "production";
const sessionCookie = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: isProd,
  path: "/",
  maxAge: 7 * 24 * 60 * 60,
};

// Helper to verify signed state
const verifySignedState = (signedState: string): string | null => {
  try {
    const appSecret = process.env.APP_SECRET;
    if (!appSecret) return null;
    
    const [state, signature] = signedState.split('.');
    if (!state || !signature) return null;
    
    const expectedSignature = crypto
      .createHmac('sha256', appSecret)
      .update(state)
      .digest('hex');
    
    if (signature === expectedSignature) {
      return state;
    }
    return null;
  } catch {
    return null;
  }
};

const getBaseUrl = (req: NextRequest) => {
  // Always derive from the incoming request to avoid cross-domain cookie issues.
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
};

const decodeIdToken = (idToken: string) => {
  const [, payload] = idToken.split(".");
  const json = Buffer.from(payload, "base64").toString("utf8");
  return JSON.parse(json);
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const signedStateParam = searchParams.get("state");
  const storedState = req.cookies.get("oauth_state")?.value;

  // Better error messages for debugging
  if (!code) {
    console.error("OAuth callback missing 'code' parameter");
    return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
  }
  if (!signedStateParam) {
    console.error("OAuth callback missing 'state' parameter");
    return NextResponse.json({ error: "Missing state parameter" }, { status: 400 });
  }

  // Try to verify signed state first (fallback if cookies fail)
  const verifiedState = verifySignedState(signedStateParam);
  
  // Validate state: prefer cookie if available, otherwise use verified signed state
  let validState: string | null = null;
  
  if (storedState) {
    // Cookie exists - verify it matches the signed state
    if (verifiedState && verifiedState === storedState) {
      validState = storedState;
    } else {
      console.error("State mismatch. Cookie state:", storedState, "Signed state:", verifiedState);
      return NextResponse.json({ 
        error: "Invalid state parameter",
        details: "The OAuth state did not match. This may indicate a security issue."
      }, { status: 400 });
    }
  } else if (verifiedState) {
    // No cookie but signed state is valid - use it as fallback
    console.warn("OAuth state cookie not found, using signed state verification");
    validState = verifiedState;
  } else {
    // Neither cookie nor valid signed state
    console.error("OAuth state cookie not found and signed state verification failed");
    console.error("State from URL:", signedStateParam);
    console.error("All cookies:", req.cookies.getAll().map(c => c.name));
    return NextResponse.json({ 
      error: "State cookie not found. Please try logging in again.",
      details: "The OAuth state cookie was not found and state verification failed. This may happen if cookies are blocked or the session expired."
    }, { status: 400 });
  }

  const baseUrl = getBaseUrl(req);

  if (!process.env.GOOGLE_CLIENT_ID) {
    console.error("Missing GOOGLE_CLIENT_ID environment variable");
    return NextResponse.json({ 
      error: "Server configuration error: GOOGLE_CLIENT_ID is not set" 
    }, { status: 500 });
  }
  if (!process.env.GOOGLE_CLIENT_SECRET) {
    console.error("Missing GOOGLE_CLIENT_SECRET environment variable");
    return NextResponse.json({ 
      error: "Server configuration error: GOOGLE_CLIENT_SECRET is not set" 
    }, { status: 500 });
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${baseUrl}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      console.error("Token exchange failed:", text);
      return NextResponse.json({ error: "Token exchange failed" }, { status: 400 });
    }

    const tokenData = await tokenRes.json();
    const idToken = tokenData.id_token;
    if (!idToken) {
      return NextResponse.json({ error: "Missing id_token" }, { status: 400 });
    }

    const profile = decodeIdToken(idToken);
    const appSecret = process.env.APP_SECRET;
    if (!appSecret) {
      console.error("Missing APP_SECRET environment variable");
      return NextResponse.json({ 
        error: "Server configuration error: APP_SECRET is not set" 
      }, { status: 500 });
    }
    if (appSecret === "change-me") {
      console.error("APP_SECRET is still set to default value 'change-me'");
      return NextResponse.json({ 
        error: "Server configuration error: APP_SECRET must be changed from default value" 
      }, { status: 500 });
    }

    const sessionToken = jwt.sign(
      {
        sub: profile.sub,
        name: profile.name,
        email: profile.email,
        picture: profile.picture,
      },
      appSecret,
      { expiresIn: "7d" }
    );

    const res = NextResponse.redirect(baseUrl || "/");
    res.cookies.set("session", sessionToken, sessionCookie);
    res.cookies.delete("oauth_state");
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "OAuth error" }, { status: 500 });
  }
}

