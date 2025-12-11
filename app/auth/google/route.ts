import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  return NextResponse.redirect(`${baseUrl}/api/auth/google`, 308);
}

