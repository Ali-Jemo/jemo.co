// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { POST as postJev } from "@/app/api/jev/route";
import { publishResearchObject, triggerBackgroundJevAudit } from "@/lib/research/store";

const { currentUserMock } = vi.hoisted(() => ({ currentUserMock: vi.fn() }));

vi.mock("@clerk/nextjs/server", () => ({
  currentUser: () => currentUserMock(),
}));

describe("Jev System One API", () => {
  const originalAiGatewayKey = process.env.AI_GATEWAY_API_KEY;
  const originalTypesafeKey = process.env.TYPESAFE_API_KEY;

  beforeEach(() => {
    currentUserMock.mockReset();
    delete process.env.AI_GATEWAY_API_KEY;
    delete process.env.TYPESAFE_API_KEY;
  });

  afterEach(() => {
    if (originalAiGatewayKey !== undefined) {
      process.env.AI_GATEWAY_API_KEY = originalAiGatewayKey;
    } else {
      delete process.env.AI_GATEWAY_API_KEY;
    }
    if (originalTypesafeKey !== undefined) {
      process.env.TYPESAFE_API_KEY = originalTypesafeKey;
    } else {
      delete process.env.TYPESAFE_API_KEY;
    }
  });

  it("returns 401 unauthorized when no user session exists", async () => {
    currentUserMock.mockResolvedValue(null);
    const req = new Request("http://localhost:3000/api/jev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "audit" }),
    });

    const res = await postJev(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe("unauthorized");
  });

  it("returns 503 ai_unavailable when gateway keys are missing (audit)", async () => {
    currentUserMock.mockResolvedValue({ id: "user_123" });
    const req = new Request("http://localhost:3000/api/jev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Deep Learning for Iraqi Arabic NLP",
        abstract: "A transformer model trained on Mesopotamian dialects.",
        field: "AI",
      }),
    });

    const res = await postJev(req);
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.error).toBe("ai_unavailable");
  });

  it("returns 503 ai_unavailable when gateway keys are missing (validate)", async () => {
    currentUserMock.mockResolvedValue({ id: "user_123" });
    const req = new Request("http://localhost:3000/api/jev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "validate",
        title: "Ziqa Kernel IPC",
      }),
    });

    const res = await postJev(req);
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.error).toBe("ai_unavailable");
  });

  it("returns 503 ai_unavailable when gateway keys are missing (route)", async () => {
    currentUserMock.mockResolvedValue({ id: "user_123" });
    const req = new Request("http://localhost:3000/api/jev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "route",
        query: "What is the formal proof for memory safety in Ziqa?",
      }),
    });

    const res = await postJev(req);
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.error).toBe("ai_unavailable");
  });

  it("returns 503 ai_unavailable when gateway keys are missing (moderate)", async () => {
    currentUserMock.mockResolvedValue({ id: "user_123" });
    const req = new Request("http://localhost:3000/api/jev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "moderate",
        text: "I replicated your benchmark on an AMD Ryzen 5950X.",
        author: "reviewer_42",
      }),
    });

    const res = await postJev(req);
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.error).toBe("ai_unavailable");
  });

  it("attaches failed null evaluation to published research objects when keys are missing", async () => {
    const paper = publishResearchObject({
      title: "Micro-architectural Cache Latency in RISC-V QEMU",
      abstract: "Detailed memory access timing tests under virtualized translation lookaside buffers.",
      findings: "Found deterministic 4-cycle L1 overhead.",
      field: "Compilers & Architecture",
    });

    expect(paper.id).toBeDefined();

    // Await background execution directly to verify completion
    await triggerBackgroundJevAudit(paper);

    expect(paper.jevEvaluation).toBeDefined();
    expect(paper.jevEvaluation?.status).toBe("failed");
    expect(paper.jevEvaluation?.rigorScore).toBeNull();
    expect(paper.jevEvaluation?.reproducibilityPercent).toBeNull();
    expect(paper.jevEvaluation?.contribution).toBeNull();
  });
});
