(function () {
  "use strict";

  /* ── Sticky Header (hide on scroll-down, reveal on scroll-up) ── */
  function initStickyHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    let last = 0;
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        header.classList.toggle("header--hidden", y > last && y > 80);
        header.classList.toggle("header--scrolled", y > 10);
        last = y;
      },
      { passive: true }
    );
  }

  /* ── Button Press (micro-interaction) ── */
  function initButtonPress() {
    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("pointerdown", () => (el.style.transform = "scale(0.96)"));
      const reset = () => (el.style.transform = "");
      el.addEventListener("pointerup", reset);
      el.addEventListener("pointerleave", reset);
    });
  }

  /* ── Scroll Reveal (fade-up on enter viewport) ── */
  function initScrollReveal() {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  }

  /* ── Hero Wordmark Entrance ── */
  function initHeroEntrance() {
    const wm = document.querySelector(".hero-wordmark");
    const tag = document.querySelector(".hero-tagline");
    if (wm) wm.classList.add("is-in-view");
    if (tag) setTimeout(() => tag.classList.add("is-in-view"), 400);
  }

  /* ── Glow Line (animated divider) ── */
  function initGlowLine() {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    document.querySelectorAll(".glow-line").forEach((el) => io.observe(el));
  }

  /* ── Ambient Particles (floating dots behind hero) ── */
  function initParticles() {
    const canvas = document.getElementById("particles");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H;
    const COUNT = 40;
    const dots = [];

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      W = canvas.parentElement.clientWidth;
      H = canvas.parentElement.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      for (let i = 0; i < COUNT; i++) {
        dots.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: 1 + Math.random() * 2,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          a: 0.15 + Math.random() * 0.25,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x = W;
        if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H;
        if (d.y > H) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(107,123,58," + d.a + ")";
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }

    resize();
    seed();
    draw();
    window.addEventListener("resize", resize);
  }

  /* ── Nav link hover glow ── */
  function initNavGlow() {
    document.querySelectorAll(".main-nav a, .footer-links a").forEach((a) => {
      a.addEventListener("mouseenter", () => {
        a.style.textShadow = "0 0 8px rgba(107,123,58,0.6)";
      });
      a.addEventListener("mouseleave", () => {
        a.style.textShadow = "";
      });
    });
  }

  /* ── Smooth Scroll ── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const target = document.querySelector(a.getAttribute("href"));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  /* ── Init ── */
  function init() {
    initStickyHeader();
    initButtonPress();
    initScrollReveal();
    initHeroEntrance();
    initGlowLine();
    initParticles();
    initNavGlow();
    initSmoothScroll();
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
