import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const appSecret = process.env.APP_SECRET;
  if (!appSecret || appSecret === "change-me") {
    console.error("APP_SECRET not properly configured");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  try {
    const user = jwt.verify(token, appSecret);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
}

