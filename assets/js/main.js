(() => {
  const yearEl = document.querySelector("[data-current-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const navbar = document.querySelector(".site-navbar");
  const logo = document.getElementById("navbarLogo");

  const formatNumber = (value, decimals) => {
    if (typeof value !== "number" || !Number.isFinite(value)) return "0";
    const fixed = value.toFixed(decimals);
    return decimals > 0 ? fixed : String(Math.round(value));
  };

  const animateCounter = (el) => {
    if (!el || el.dataset.animated === "true") return;

    const rawTarget = el.dataset.target;
    const prefix = el.dataset.prefix ?? "";
    const suffix = el.dataset.suffix ?? "";
    const target = Number.parseFloat(rawTarget ?? "0");

    if (!Number.isFinite(target)) {
      el.textContent = `${prefix}${rawTarget ?? "0"}${suffix}`;
      el.dataset.animated = "true";
      return;
    }

    const decimals = (rawTarget ?? "").includes(".") ? (rawTarget.split(".")[1]?.length ?? 0) : 0;
    const durationMs = 900;
    const start = 0;
    const startTime = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - startTime) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = start + (target - start) * eased;
      el.textContent = `${prefix}${formatNumber(current, decimals)}${suffix}`;

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = `${prefix}${formatNumber(target, decimals)}${suffix}`;
        el.dataset.animated = "true";
      }
    };

    requestAnimationFrame(tick);
  };

  const initCounters = () => {
    const counters = Array.from(document.querySelectorAll(".js-counter"));
    if (counters.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.35 }
    );

    for (const el of counters) observer.observe(el);
  };

  const initHeroTitleRotator = () => {
    const el = document.getElementById("heroTitleRotator");
    if (!el) return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const titles = [
      'Building Tomorrow\'s <span class="hero-accent">Mohali</span> Today',
      'Driving Sustainable <span class="hero-accent">Urban Growth</span> in Greater Mohali.',
      'Transforming Mohali into a <span class="hero-accent">World-Class Investment</span> Destination.',
      'Planned Growth. <span class="hero-accent">Transparent Development.</span> Strong Returns.',
    ];

    let index = 0;
    const setTitle = (html) => {
      el.innerHTML = html;
    };

    setTitle(titles[index]);

    if (reduceMotion) return;

    const intervalMs = 3500;
    const transitionMs = 280;

    window.setInterval(() => {
      el.classList.add("is-transitioning");
      window.setTimeout(() => {
        index = (index + 1) % titles.length;
        setTitle(titles[index]);
        el.classList.remove("is-transitioning");
      }, transitionMs);
    }, intervalMs);
  };

  const syncNavbarState = () => {
    if (!navbar) return;

    const isScrolled = window.scrollY > 10;
    navbar.classList.toggle("navbar--scrolled", isScrolled);
    navbar.classList.toggle("navbar--transparent", !isScrolled);

    if (logo) {
      const whiteLogo = logo.dataset.logoWhite;
      const darkLogo = logo.dataset.logoDark;
      if (whiteLogo && darkLogo) {
        logo.src = isScrolled ? darkLogo : whiteLogo;
      }
    }
  };

  syncNavbarState();
  window.addEventListener("scroll", syncNavbarState, { passive: true });

  initCounters();
  initHeroTitleRotator();
})();
