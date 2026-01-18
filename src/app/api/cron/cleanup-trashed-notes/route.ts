// app/api/cron/cleanup-trashed-notes/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

  const cutoff = new Date(Date.now() - THIRTY_DAYS);

  const result = await prisma.note.deleteMany({
    where: {
      trashedAt: {
        lte: cutoff,
      },
    },
  });

  return NextResponse.json({
    deleted: result.count,
  });
}
