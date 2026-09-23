// @vitest-environment node
// Uses Web Crypto (crypto.subtle), which jsdom does not implement.
import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST, DELETE } from "@/app/api/keys/route";
import { API_KEY_PREFIX, generateToken, hashToken } from "@/lib/api-keys";

describe("API key primitives", () => {
  it("mints prefixed, high-entropy tokens", () => {
    const token = generateToken();
    expect(token.startsWith(API_KEY_PREFIX)).toBe(true);
    expect(token).toHaveLength(API_KEY_PREFIX.length + 32);
    expect(token).not.toBe(generateToken());
  });

  it("hashes deterministically without exposing the token", async () => {
    const token = generateToken();
    const hash = await hashToken(token);

    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(await hashToken(token)).toBe(hash);
    expect(await hashToken(generateToken())).not.toBe(hash);
    expect(hash).not.toContain(token);
  });
});

describe("/api/keys authorization", () => {
  // vitest.setup.ts mocks Clerk's currentUser() to resolve null, i.e. there is
  // no session — every handler must refuse rather than fall back to a trust
  // source from the request.
  it("rejects unauthenticated list, create and revoke", async () => {
    const list = await GET(new NextRequest("http://localhost:3000/api/keys"));
    expect(list.status).toBe(401);

    const create = await POST(
      new NextRequest("http://localhost:3000/api/keys", { method: "POST" })
    );
    expect(create.status).toBe(401);

    const revoke = await DELETE(
      new NextRequest("http://localhost:3000/api/keys?id=00000000-0000-0000-0000-000000000000")
    );
    expect(revoke.status).toBe(401);
  });
});
