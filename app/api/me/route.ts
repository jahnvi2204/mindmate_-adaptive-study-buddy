import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const user = jwt.verify(token, process.env.APP_SECRET ?? "change-me");
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
}

