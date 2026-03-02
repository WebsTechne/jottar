import { NextResponse } from "next/server";
import { getRequestUser } from "@/server/get-request-user";

type ApiError = { ok: false; error: string };
type ApiSuccess<T> = { ok: true } & T;

function apiError(error: string, status = 400) {
  return NextResponse.json<ApiError>({ ok: false, error }, { status });
}

function apiSuccess<T extends Record<string, unknown>>(data: T, status = 200) {
  return NextResponse.json<ApiSuccess<T>>({ ok: true, ...data }, { status });
}

async function parseJson<T>(req: Request): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}

export { apiError, apiSuccess, getRequestUser, parseJson };
