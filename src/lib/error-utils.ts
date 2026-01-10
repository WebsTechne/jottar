export function getPublicErrorMessage(err: unknown): string {
  if (!err) return "Something went wrong. Try again later.";

  if (err instanceof Error) {
    const m = err.message || err.name;

    // quick pattern matching for common server-y failures
    if (/database|connection|ECONNREFUSED|ENOTFOUND|pooler/i.test(m)) {
      return "Authentication service temporarily unavailable. Try again later.";
    }
    if (/Model .* does not exist/i.test(m)) {
      return "Server misconfiguration. Try again later.";
    }
    // fallback
    return "An unexpected error occurred. Try again later.";
  }

  // non-Error
  return "An unexpected error occurred. Try again later.";
}

// call from client to send full error details to your server (returns a ref id)
export async function reportErrorToServer(err: unknown) {
  const ref = crypto.randomUUID();
  try {
    await fetch("/api/report-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ref,
        error: {
          name: err instanceof Error ? err.name : String(err),
          message: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
          userAgent:
            typeof navigator !== "undefined" ? navigator.userAgent : null,
          ts: new Date().toISOString(),
        },
      }),
    });
  } catch (e) {
    // best-effort; don't block UX if logging fails
    console.error("Failed to report error to server", e);
  }
  return ref;
}
