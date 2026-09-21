// p2game SDK Handshake (RT-006)
if (typeof window !== "undefined" && (window as any).p2) {
  const p2 = (window as any).p2;
  if (typeof p2.init === "function") {
    p2.init().catch((e: any) => console.warn("[p2game] init error:", e));
  }
  if (typeof p2.ready === "function") {
    window.addEventListener("load", () => {
      try { p2.ready(); } catch (_) {}
    }, { once: true });
  }
}

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import GameApp from "./GameApp";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GameApp />
  </StrictMode>,
);
