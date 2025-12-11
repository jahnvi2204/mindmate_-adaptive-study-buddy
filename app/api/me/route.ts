import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

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

  try {
    const user = jwt.verify(token, appSecret);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
}

