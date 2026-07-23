"use client";

import Header from "@/components/Header";
import SceneOrchestrator from "@/components/scenes/SceneOrchestrator";

export default function Home() {
  return (
    <>
      <Header />
      <main className="relative z-10">
        <SceneOrchestrator />
      </main>
    </>
  );
}
