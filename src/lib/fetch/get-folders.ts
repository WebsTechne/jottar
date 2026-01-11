// lib/fetch/get-folders.ts
import prisma from "@/lib/prisma";
import { cache } from "react";
import { auth } from "../auth";
import { headers } from "next/headers";

const _getFolders = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user) {
    return;
	}

	return prisma.folder.findMany({
		select: {
			id: true,
			name: true,
			userId: true,
			notes: true
		}, where: {
			userId: { equals: user.id }
		}
	})

	export const getFolders = cache(_getFolders);
