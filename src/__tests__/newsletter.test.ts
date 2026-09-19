import { describe, it, expect } from "vitest";
import { POST as subscribeNewsletter } from "@/app/api/newsletter/route";
import { NextRequest } from "next/server";

// ponytail: regression test for newsletter subscription API
describe("Newsletter API (/api/newsletter)", () => {
  it("subscribes valid email with topics and format", async () => {
    const req = new NextRequest("http://localhost:3000/api/newsletter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "10.0.0.1",
      },
      body: JSON.stringify({
        email: "researcher@example.edu.iq",
        format: "html",
        topics: ["النوى والأنظمة السيادية"],
      }),
    });

    const res = await subscribeNewsletter(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.email).toBe("researcher@example.edu.iq");
  });

  it("rejects invalid email formats", async () => {
    const invalidEmails = ["not-an-email", "", "test@", "@domain.com", "plainaddress"];
    let ipCounter = 2;
    for (const email of invalidEmails) {
      const req = new NextRequest("http://localhost:3000/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": `10.0.0.${ipCounter++}`,
        },
        body: JSON.stringify({ email }),
      });
      const res = await subscribeNewsletter(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("يرجى إدخال بريد إلكتروني صالح");
    }
  });

  it("handles malformed JSON body gracefully", async () => {
    const req = new NextRequest("http://localhost:3000/api/newsletter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "10.0.0.99",
      },
      body: "not-json",
    });
    const res = await subscribeNewsletter(req);
    expect(res.status).toBe(400);
  });
});
