import { describe, it, expect } from "vitest";
import { POST as postJev } from "@/app/api/jev/route";
import { publishResearchObject, triggerBackgroundJevAudit } from "@/lib/research/store";

describe("Jev System One API", () => {
  it("evaluates a research object and returns typed scores and probabilities", async () => {
    const req = new Request("http://localhost:3000/api/jev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Deep Learning for Iraqi Arabic NLP",
        abstract: "A transformer model trained on Mesopotamian Arabic dialects with empirical benchmark evaluations.",
        question: "How well can a dedicated transformer capture Mesopotamian colloquial idioms?",
        field: "Computer Science / AI",
      }),
    });

    const res = await postJev(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.model).toContain("typesafe-ai/jev");
    expect(data.evaluation).toBeDefined();
    expect(typeof data.evaluation.rigorScore).toBe("number");
    expect(typeof data.evaluation.reproducibilityPercent).toBe("number");
    expect(typeof data.evaluation.contribution).toBe("string");
  });

  it("validates and auto-tags a research post via Jev", async () => {
    const req = new Request("http://localhost:3000/api/jev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "validate",
        title: "Ziqa Kernel: Zero-Copy IPC on x86_64",
        abstract: "A microkernel experiment implementing hardware-accelerated message passing with empirical latency benchmarks.",
        question: "Can ring buffers with atomic fences reduce context-switch overhead below 40ns?",
        findings: "Achieved 32ns IPC latency compared to 180ns on standard Linux pipes.",
      }),
    });

    const res = await postJev(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.action).toBe("validate");
    expect(data.result).toBeDefined();
    expect(typeof data.result.isRelevant).toBe("boolean");
    expect(typeof data.result.relevanceProbability).toBe("number");
    expect(typeof data.result.suggestedCategory).toBe("string");
    expect(typeof data.result.depthScore).toBe("number");
    expect(data.result.depthNormalized).toBeGreaterThan(0);
  });

  it("dynamically routes incoming user queries to the optimal model tier", async () => {
    const req = new Request("http://localhost:3000/api/jev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "route",
        query: "What is the formal proof for memory safety in the Ziqa page allocator?",
      }),
    });

    const res = await postJev(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.action).toBe("route");
    expect(data.result).toBeDefined();
    expect(["fast_retrieval", "code_execution", "frontier_reasoning"]).toContain(data.result.targetModel);
    expect(typeof data.result.requiresRetrieval).toBe("boolean");
    expect(typeof data.result.confidence).toBe("number");
  });

  it("moderates and classifies community interactions", async () => {
    const req = new Request("http://localhost:3000/api/jev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "moderate",
        text: "I replicated your benchmark on an AMD Ryzen 5950X, but found cache-line contention at 64 threads. Here is the adjusted patch.",
        author: "reviewer_42",
      }),
    });

    const res = await postJev(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.action).toBe("moderate");
    expect(data.result.isConstructive).toBe(true);
    expect(typeof data.result.constructiveProbability).toBe("number");
    expect(typeof data.result.contributionType).toBe("string");
  });

  it("attaches background Jev evaluation to published research objects", async () => {
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
    expect(paper.jevEvaluation?.status).toBe("completed");
    expect(typeof paper.jevEvaluation?.rigorScore).toBe("number");
    expect(typeof paper.jevEvaluation?.reproducibilityPercent).toBe("number");
    expect(typeof paper.jevEvaluation?.contribution).toBe("string");
  });

  it("handles multi-turn grounded research chat with Jev System One routing", async () => {
    const req = new Request("http://localhost:3000/api/jev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "chat",
        paperTitle: "Ziqa Kernel IPC",
        paperFindings: "Achieved 32ns zero-copy latency.",
        paperTools: ["QEMU", "x86_64", "Rust"],
        messages: [
          { role: "user", content: "كيف يمكنني إعادة تكرار التجربة على جهازي؟" }
        ],
      }),
    });

    const res = await postJev(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.action).toBe("chat");
    expect(data.route).toBeDefined();
    expect(data.route.targetModel).toBeDefined();
    expect(data.message).toBeDefined();
    expect(data.message.role).toBe("assistant");
    expect(data.message.content.length).toBeGreaterThan(20);
  });
});
