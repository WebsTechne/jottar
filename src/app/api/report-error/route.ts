// app/api/report-error/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const payload = await req.json();

  console.error("Client error report", payload.ref, payload.error);

  return NextResponse.json({ ok: true, ref: payload.ref }, { status: 200 });
}
