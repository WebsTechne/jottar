import prisma from "@/lib/prisma";
import crypto from "crypto";

const ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz";
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";

const generateToken = async (l?: 8) => {
  const length = l ? --l : 7;

  while (true) {
    const bit = Array.from(
      { length },
      () => CHARS[crypto.randomInt(CHARS.length)],
    ).join("");

    const token = [ALPHA[crypto.randomInt(ALPHA.length)], bit].join("");

    const existing = await prisma.note.findUnique({
      where: {
        shareToken: token,
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      return token;
    }
  }
};

export { generateToken };
