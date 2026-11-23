"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0, background: "#f7f7f5", color: "#222f30", fontFamily: "Tahoma, sans-serif" }}>
        <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center" }}>
          <div style={{ maxWidth: "32rem" }}>
            <p style={{ letterSpacing: "0.12em", fontSize: "12px", color: "#728825" }}>JEMO LABS</p>
            <h1 style={{ fontSize: "2rem", margin: "0.5rem 0" }}>تعذّر فتح الموقع</h1>
            <p style={{ lineHeight: 1.7, color: "#445e5f" }}>
              الواجهة الأساسية لم تكتمل. أعد المحاولة، أو ارجع بعد لحظات.
            </p>
            <button
              type="button"
              onClick={() => reset()}
              style={{ marginTop: "1.25rem", background: "#222f30", color: "#fff", border: 0, borderRadius: "999px", padding: "0.7rem 1.2rem", cursor: "pointer" }}
            >
              إعادة المحاولة
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
