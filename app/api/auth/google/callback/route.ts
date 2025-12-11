import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const isProd = process.env.NODE_ENV === "production";
const sessionCookie = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: isProd,
  path: "/",
  maxAge: 7 * 24 * 60 * 60,
};

const stateCookie = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: isProd,
  path: "/",
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
  const state = searchParams.get("state");
  const storedState = req.cookies.get("oauth_state")?.value;

  if (!code || !state || state !== storedState) {
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }

  const baseUrl = getBaseUrl(req);

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID ?? "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
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
    const sessionToken = jwt.sign(
      {
        sub: profile.sub,
        name: profile.name,
        email: profile.email,
        picture: profile.picture,
      },
      process.env.APP_SECRET ?? "change-me",
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

