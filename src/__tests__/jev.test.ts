import { describe, it, expect } from "vitest";
import { POST as postJev } from "@/app/api/jev/route";

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
});
