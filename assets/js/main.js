/* ==========================================================================
   LOYALTY TATTOO CALI — Lógica principal
   ========================================================================== */
(function () {
  "use strict";
  const CFG = window.LOYALTY;
  const DICT = window.I18N;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };

  /* ----------  LINKS (WhatsApp / Maps)  ---------- */
  function waLink(msg) {
    return "https://wa.me/" + CFG.whatsapp + "?text=" + encodeURIComponent(msg || "");
  }
  function mapsEmbed() {
    return "https://maps.google.com/maps?q=" + encodeURIComponent(CFG.mapsQuery) + "&z=16&output=embed";
  }
  function mapsDir() {
    return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(CFG.mapsQuery);
  }

  /* ----------  IDIOMA  ---------- */
  let lang = store.get("loyalty-lang") || (navigator.language || "es").slice(0, 2);
  if (lang !== "en") lang = "es";

  function t(key) { return (DICT[lang] && DICT[lang][key]) || (DICT.es[key] || key); }

  function applyLang() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach((el) => { el.textContent = t(el.getAttribute("data-i18n")); });
    // lang toggle labels
    const lb = $("#langBtn");
    if (lb) {
      lb.querySelector(".es").classList.toggle("on", lang === "es");
      lb.querySelector(".es").classList.toggle("off", lang !== "es");
      lb.querySelector(".en").classList.toggle("on", lang === "en");
      lb.querySelector(".en").classList.toggle("off", lang !== "en");
      lb.setAttribute("aria-label", lang === "es" ? "Switch to English" : "Cambiar a español");
    }
    // dynamic links + labels
    refreshLinks();
    updateSoundLabel();
  }

  function setLang(l) { lang = l; store.set("loyalty-lang", l); applyLang(); }

  function refreshLinks() {
    // WhatsApp genéricos
    $$("[data-wa]").forEach((a) => {
      const kind = a.getAttribute("data-wa");
      let msg = CFG.waMsg[lang];
      if (kind === "tattoo") msg = CFG.waMsgTattoo[lang];
      if (kind === "removal") msg = CFG.waMsgRemoval[lang];
      if (kind === "proc") msg = (activeProc === "tattoo" ? CFG.waMsgTattoo : CFG.waMsgRemoval)[lang];
      a.href = waLink(msg);
    });
    // Instagram
    $$("[data-ig]").forEach((a) => { a.href = CFG.instagram; });
    // Maps
    $$("[data-map-dir]").forEach((a) => { a.href = mapsDir(); });
    // WA float aria
    const waf = $("#waFloat"); if (waf) waf.setAttribute("aria-label", t("wa.float"));
  }

  /* ----------  TEMA  ---------- */
  function applyTheme(theme) {
    if (theme === "light" || theme === "dark") {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }
  function currentTheme() {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr) return attr;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function toggleTheme() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    store.set("loyalty-theme", next);
    applyTheme(next);
  }

  /* ----------  NAV scroll / móvil  ---------- */
  const nav = $("#nav");
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add("solid");
    else nav.classList.remove("solid");
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  const mm = $("#mobileMenu");
  function openMenu() { mm.classList.add("open"); document.body.style.overflow = "hidden"; }
  function closeMenu() { mm.classList.remove("open"); document.body.style.overflow = ""; }

  /* ----------  SONIDO (solo en el header)  ---------- */
  const video = $("#heroVideo");
  const soundBtn = $("#soundBtn");
  let soundOn = false;        // intención del usuario
  let heroVisible = true;

  function updateSoundLabel() {
    if (!soundBtn) return;
    const title = soundBtn.querySelector(".t-title");
    const hint = soundBtn.querySelector(".t-hint");
    if (title) title.textContent = t("sound.title");
    if (hint) hint.textContent = soundOn ? t("sound.off") : t("sound.on");
    soundBtn.setAttribute("aria-pressed", soundOn ? "true" : "false");
  }

  function syncAudio() {
    if (!video) return;
    const shouldPlay = soundOn && heroVisible;
    video.muted = !shouldPlay;
    soundBtn.classList.toggle("playing", shouldPlay);
    // volumen suave
    try { video.volume = 0.5; } catch (e) {}
    if (shouldPlay) { const p = video.play(); if (p && p.catch) p.catch(() => {}); }
  }

  function toggleSound() {
    soundOn = !soundOn;
    syncAudio();
    updateSoundLabel();
  }

  /* IntersectionObserver: corta el audio cuando el header sale de pantalla */
  if (video) {
    const heroSec = $("#inicio");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        heroVisible = e.isIntersecting && e.intersectionRatio > 0.35;
        syncAudio();
      });
    }, { threshold: [0, 0.35, 0.6] });
    if (heroSec) io.observe(heroSec);

    // Autoplay muteado robusto
    video.muted = true;
    const kick = () => { const p = video.play(); if (p && p.catch) p.catch(() => {}); };
    video.addEventListener("canplay", kick, { once: true });
    kick();
  }

  /* ----------  PROCEDIMIENTO tabs  ---------- */
  let activeProc = "removal";
  function setProc(kind) {
    activeProc = kind;
    $$(".proc-tab").forEach((b) => b.classList.toggle("active", b.dataset.proc === kind));
    $("#stepsRemoval").hidden = kind !== "removal";
    $("#stepsTattoo").hidden = kind !== "tattoo";
    refreshLinks();
  }

  /* ----------  RESULTADOS filtro  ---------- */
  function setFilter(cat) {
    $$(".filter").forEach((f) => f.setAttribute("aria-pressed", f.dataset.cat === cat ? "true" : "false"));
    $$(".shot").forEach((s) => {
      const show = cat === "all" || s.dataset.cat === cat;
      s.classList.toggle("hide", !show);
    });
  }

  /* ----------  LIGHTBOX  ---------- */
  const lb = $("#lightbox");
  const lbImg = $("#lbImg");
  let shots = [], lbIndex = 0;
  function openLb(el) {
    shots = $$(".shot:not(.hide)");
    lbIndex = Math.max(0, shots.indexOf(el));
    showLb();
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function showLb() {
    const img = shots[lbIndex] && shots[lbIndex].querySelector("img");
    if (img) { lbImg.src = img.src; lbImg.alt = img.alt; }
  }
  function closeLb() { lb.classList.remove("open"); document.body.style.overflow = ""; }
  function moveLb(d) { lbIndex = (lbIndex + d + shots.length) % shots.length; showLb(); }

  /* ----------  REVEAL  ---------- */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); revealIO.unobserve(e.target); } });
  }, { threshold: 0.12 });

  /* ----------  INIT  ---------- */
  function init() {
    // tema guardado
    const savedTheme = store.get("loyalty-theme");
    if (savedTheme) applyTheme(savedTheme);

    // mapa
    const mapFrame = $("#mapFrame"); if (mapFrame) mapFrame.src = mapsEmbed();

    // PQRS links
    $$("[data-pqrs]").forEach((a, i) => { if (CFG.pqrs[i]) a.href = CFG.pqrs[i]; });

    // Instagram handle text
    // (queda fijo en el HTML)

    applyLang();
    onScroll();
    setProc("removal");
    setFilter("all");

    // listeners
    $("#themeBtn").addEventListener("click", toggleTheme);
    $("#langBtn").addEventListener("click", () => setLang(lang === "es" ? "en" : "es"));
    if (soundBtn) soundBtn.addEventListener("click", toggleSound);
    $("#burger").addEventListener("click", openMenu);
    $("#mmClose").addEventListener("click", closeMenu);
    $$("#mobileMenu a").forEach((a) => a.addEventListener("click", closeMenu));
    $$(".proc-tab").forEach((b) => b.addEventListener("click", () => setProc(b.dataset.proc)));
    $$(".filter").forEach((f) => f.addEventListener("click", () => setFilter(f.dataset.cat)));
    $$(".shot").forEach((s) => s.addEventListener("click", () => openLb(s)));
    $("#lbClose").addEventListener("click", closeLb);
    $("#lbPrev").addEventListener("click", () => moveLb(-1));
    $("#lbNext").addEventListener("click", () => moveLb(1));
    lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") moveLb(-1);
      if (e.key === "ArrowRight") moveLb(1);
    });

    // reveal
    $$(".reveal").forEach((el) => revealIO.observe(el));

    updateSoundLabel();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
