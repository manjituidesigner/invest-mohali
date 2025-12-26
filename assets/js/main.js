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

  const initLandParcelsMap = () => {
    const pinsRoot = document.getElementById("lpMapPins");
    if (!pinsRoot) return;

    const modalEl = document.getElementById("lpParcelModal");
    const modalTitleEl = document.getElementById("lpModalTitle");
    const modalMetaEl = document.getElementById("lpModalMeta");
    const modalCategoryEl = document.getElementById("lpModalCategory");
    const modalSectorEl = document.getElementById("lpModalSector");
    const modalAreaEl = document.getElementById("lpModalArea");
    const modalPriceEl = document.getElementById("lpModalPrice");
    const bsModal = modalEl && window.bootstrap ? new window.bootstrap.Modal(modalEl) : null;

    const parcels = [
      {
        id: "LP-101",
        title: "Commercial Plot - Sector 82",
        meta: "Near PR-7 Road, Greater Mohali",
        category: "commercial",
        categoryLabel: "Commercial",
        sector: "Sector 82",
        area: "1.20 Acres",
        price: "₹ 12.5 Cr",
        x: 34,
        y: 62,
      },
      {
        id: "LP-102",
        title: "Group Housing - Sector 88",
        meta: "Planned township zone",
        category: "group-housing",
        categoryLabel: "Group Housing",
        sector: "Sector 88",
        area: "5.00 Acres",
        price: "₹ 48.0 Cr",
        x: 52,
        y: 46,
      },
      {
        id: "LP-103",
        title: "Healthcare Site - Sector 79",
        meta: "200m from arterial road",
        category: "healthcare",
        categoryLabel: "Healthcare",
        sector: "Sector 79",
        area: "2.10 Acres",
        price: "₹ 24.0 Cr",
        x: 66,
        y: 54,
      },
      {
        id: "LP-104",
        title: "Education Campus - Sector 74",
        meta: "Adjacent to green belt",
        category: "education",
        categoryLabel: "Education",
        sector: "Sector 74",
        area: "3.40 Acres",
        price: "₹ 31.5 Cr",
        x: 43,
        y: 68,
      },
      {
        id: "LP-105",
        title: "Hospitality Plot - Sector 90",
        meta: "High footfall corridor",
        category: "hospitality",
        categoryLabel: "Hospitality",
        sector: "Sector 90",
        area: "1.75 Acres",
        price: "₹ 19.0 Cr",
        x: 78,
        y: 40,
      },
      {
        id: "LP-106",
        title: "Commercial Plot - Sector 66",
        meta: "IT City access road",
        category: "commercial",
        categoryLabel: "Commercial",
        sector: "Sector 66",
        area: "0.85 Acres",
        price: "₹ 9.2 Cr",
        x: 28,
        y: 40,
      },
    ];

    const iconByCategory = {
      commercial: "bi-building",
      "group-housing": "bi-houses",
      healthcare: "bi-hospital",
      education: "bi-mortarboard",
      hospitality: "bi-cup-hot",
    };

    let activeFilter = "all";

    const setModalContent = (parcel) => {
      if (!parcel) return;
      if (modalTitleEl) modalTitleEl.textContent = parcel.title;
      if (modalMetaEl) modalMetaEl.textContent = `${parcel.id} • ${parcel.meta}`;
      if (modalCategoryEl) modalCategoryEl.textContent = parcel.categoryLabel;
      if (modalSectorEl) modalSectorEl.textContent = parcel.sector;
      if (modalAreaEl) modalAreaEl.textContent = parcel.area;
      if (modalPriceEl) modalPriceEl.textContent = parcel.price;
    };

    const renderPins = () => {
      pinsRoot.innerHTML = "";
      for (const parcel of parcels) {
        const isVisible = activeFilter === "all" || activeFilter === parcel.category;
        if (!isVisible) continue;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `lp-pin lp-pin--${parcel.category}`;
        btn.style.left = `${parcel.x}%`;
        btn.style.top = `${parcel.y}%`;
        btn.setAttribute("aria-label", `${parcel.title} pin`);
        btn.dataset.parcelId = parcel.id;

        const icon = document.createElement("i");
        icon.className = `bi ${iconByCategory[parcel.category] ?? "bi-geo-alt"}`;
        icon.setAttribute("aria-hidden", "true");
        btn.appendChild(icon);

        btn.addEventListener("click", () => {
          setModalContent(parcel);
          if (bsModal) bsModal.show();
        });

        pinsRoot.appendChild(btn);
      }
    };

    const chips = Array.from(document.querySelectorAll("[data-lp-filter]"));
    const updateChips = () => {
      for (const chip of chips) {
        const filter = chip.getAttribute("data-lp-filter") ?? "all";
        chip.classList.toggle("is-active", filter === activeFilter);
      }
    };

    for (const chip of chips) {
      chip.addEventListener("click", () => {
        activeFilter = chip.getAttribute("data-lp-filter") ?? "all";
        updateChips();
        renderPins();
      });
    }

    updateChips();
    renderPins();
  };

  initLandParcelsMap();

  const initReadyToInvestForm = () => {
    const form = document.getElementById("rtiForm");
    if (!form) return;

    const showMessage = (type, text) => {
      const existing = form.querySelector(".rti-form-alert");
      if (existing) existing.remove();

      const el = document.createElement("div");
      el.className = `alert alert-${type} rti-form-alert mb-0 mt-3`;
      el.setAttribute("role", "status");
      el.textContent = text;
      form.appendChild(el);
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const fd = new FormData(form);
      const name = String(fd.get("name") ?? "").trim();
      const phone = String(fd.get("phone") ?? "").trim();
      const email = String(fd.get("email") ?? "").trim();
      const message = String(fd.get("message") ?? "").trim();

      if (!name || !phone || !email || !message) {
        showMessage("warning", "Please fill in all fields so we can contact you.");
        return;
      }

      showMessage("success", "Thanks! Your request has been received. Our team will contact you soon.");
      form.reset();
    });
  };

  initReadyToInvestForm();
})();
