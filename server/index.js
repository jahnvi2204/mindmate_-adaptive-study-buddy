import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI = "http://localhost:4000/auth/google/callback",
  FRONTEND_ORIGIN = "http://localhost:5173",
  APP_SECRET = "change-me",
  PORT = 4000,
} = process.env;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.warn("[auth] GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET not set. OAuth will fail.");
}

const app = express();
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

const SESSION_COOKIE = "session";
const STATE_COOKIE = "oauth_state";

const cookieOpts = {
  httpOnly: true,
  sameSite: "lax",
  secure: false, // set true when serving over https
  path: "/",
};

const generateState = () => crypto.randomUUID();

const setSession = (res, payload) => {
  const token = jwt.sign(payload, APP_SECRET, { expiresIn: "7d" });
  res.cookie(SESSION_COOKIE, token, { ...cookieOpts, maxAge: 7 * 24 * 60 * 60 * 1000 });
};

const clearSession = (res) => {
  res.clearCookie(SESSION_COOKIE, cookieOpts);
};

const decodeIdToken = (idToken) => {
  const [, payload] = idToken.split(".");
  const json = Buffer.from(payload, "base64").toString("utf8");
  return JSON.parse(json);
};

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/auth/google", (_req, res) => {
  const state = generateState();
  res.cookie(STATE_COOKIE, state, { ...cookieOpts, maxAge: 10 * 60 * 1000 });

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID ?? "",
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid profile email",
    access_type: "offline",
    include_granted_scopes: "true",
    state,
    prompt: "consent",
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  res.redirect(authUrl);
});

app.get("/auth/google/callback", async (req, res) => {
  const { code, state } = req.query;
  const storedState = req.cookies[STATE_COOKIE];

  if (!state || !storedState || state !== storedState) {
    return res.status(400).send("Invalid state");
  }

  if (!code) {
    return res.status(400).send("Missing code");
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID ?? "",
        client_secret: GOOGLE_CLIENT_SECRET ?? "",
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      console.error("Token exchange failed:", text);
      return res.status(400).send("Token exchange failed");
    }

    const tokenData = await tokenRes.json();
    const idToken = tokenData.id_token;
    if (!idToken) {
      return res.status(400).send("Missing id_token");
    }

    const profile = decodeIdToken(idToken);
    setSession(res, {
      sub: profile.sub,
      name: profile.name,
      email: profile.email,
      picture: profile.picture,
    });
    res.clearCookie(STATE_COOKIE, cookieOpts);
    res.redirect(FRONTEND_ORIGIN);
  } catch (err) {
    console.error(err);
    res.status(500).send("OAuth error");
  }
});

app.post("/auth/logout", (_req, res) => {
  clearSession(res);
  res.status(200).json({ ok: true });
});

app.get("/api/me", (req, res) => {
  const token = req.cookies[SESSION_COOKIE];
  if (!token) return res.status(401).json({ error: "unauthorized" });
  try {
    const payload = jwt.verify(token, APP_SECRET);
    res.json({ user: payload });
  } catch {
    return res.status(401).json({ error: "unauthorized" });
  }
});

app.listen(PORT, () => {
  console.log(`[auth] listening on http://localhost:${PORT}`);
});

