import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { checkRateLimit, getClientIp } from "@/lib/security";
import {
  ApiKeyLimitError,
  createApiKey,
  listApiKeys,
  revokeApiKey,
  type ApiKeyOwner,
} from "@/lib/api-keys";

/**
 * Dashboard key management. Every handler is gated on a verified Clerk session:
 * a key's owner is the authenticated user, never a value from the request body.
 */

type ClerkUser = NonNullable<Awaited<ReturnType<typeof currentUser>>>;

async function requireUser(): Promise<ClerkUser | null> {
  try {
    return await currentUser();
  } catch {
    return null;
  }
}

function toOwner(user: ClerkUser): ApiKeyOwner {
  const email =
    user.primaryEmailAddress?.emailAddress ?? user.emailAddresses?.[0]?.emailAddress ?? "";
  const localPart = email.split("@")[0];

  return {
    userId: user.id,
    userName:
      user.fullName ||
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      (user.username ? `@${user.username}` : localPart) ||
      "باحث معتمد",
    userHandle: user.username ? `@${user.username.replace(/^@/, "")}` : `@${localPart || "researcher"}`,
    role:
      (user.publicMetadata as { role?: string } | undefined)?.role === "admin"
        ? "مدير النظام"
        : "باحث مستقل مسجل",
  };
}

function rateLimited(ip: string, scope: string, limit = 20) {
  const result = checkRateLimit(`api_keys_${scope}:${ip}`, limit, 60_000);
  return result.allowed ? null : NextResponse.json({ error: "Too many requests" }, { status: 429 });
}

export async function GET(req: NextRequest) {
  const limited = rateLimited(getClientIp(req), "get");
  if (limited) return limited;

  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    return NextResponse.json({ keys: await listApiKeys(user.id) });
  } catch (err) {
    console.error("API key list error:", err);
    return NextResponse.json({ error: "Could not load API keys" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const limited = rateLimited(getClientIp(req), "post", 10);
  if (limited) return limited;

  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let name = "Default";
  try {
    const body = await req.json();
    if (typeof body?.name === "string") name = body.name;
  } catch {
    // A body is optional; fall through to the default name.
  }

  try {
    const { token, ...key } = await createApiKey(toOwner(user), name);
    // The plaintext token is returned exactly once and never persisted.
    return NextResponse.json({ key, token }, { status: 201 });
  } catch (err) {
    if (err instanceof ApiKeyLimitError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("API key create error:", err);
    return NextResponse.json({ error: "Could not create API key" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const limited = rateLimited(getClientIp(req), "delete", 20);
  if (limited) return limited;

  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing 'id' query parameter" }, { status: 400 });

  try {
    const revoked = await revokeApiKey(user.id, id);
    if (!revoked) return NextResponse.json({ error: "Key not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("API key revoke error:", err);
    return NextResponse.json({ error: "Could not revoke API key" }, { status: 500 });
  }
}
