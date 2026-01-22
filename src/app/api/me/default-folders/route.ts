// app/api/me/default-folders/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth"; // implement for BetterAuth

export async function POST(req: Request) {
  // getSessionFromRequest should validate cookies/header and return { user: { id } } or null
  const session = await auth.api.getSession(req);
  if (!session?.user?.id) {
    return NextResponse.json(
      { ok: false, error: "Not authenticated" },
      { status: 401 },
    );
  }
  const userId = session.user.id;

  // idempotent create: skip existing
  const folders = await prisma.folder.findMany({
    where: {
      userId,
      slug: { in: ["shared-notes", "imported-notes"] },
    },
  });

  const names = new Set(folders.map((f) => f.name));

  const ops = [];

  if (!names.has("Shared Notes")) {
    ops.push(
      prisma.folder.create({
        data: {
          name: "Shared Notes",
          slug: "shared-notes",
          description: "Notes you made available to others",
          userId,
        },
      }),
    );
  }

  if (!names.has("Imported Notes")) {
    ops.push(
      prisma.folder.create({
        data: {
          name: "Imported Notes",
          slug: "imported-notes",
          description: "Notes you added from other people's shared notes",
          userId,
        },
      }),
    );
  }

  if (ops.length) {
    await prisma.$transaction(ops);
  }

  return NextResponse.json({ ok: true });
}
