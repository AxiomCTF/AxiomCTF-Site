// ── LANGUAGE SWITCHER ──────────────────────────────────────
let currentLang = "ru";
const LANG_STORAGE_KEY = "axiom_ctf_lang";

function setLang(lang) {
    currentLang = lang;

    try {
        localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (_error) {
        // Ignore storage errors (private mode / disabled storage)
    }

    // Update button states
    document.querySelectorAll(".lang-btn").forEach((btn) => {
        btn.classList.toggle(
            "active",
            btn.textContent.toLowerCase() === lang,
        );
    });

    // Update all elements with data-ru / data-en
    document.querySelectorAll("[data-ru],[data-en]").forEach((el) => {
        const text = el.getAttribute("data-" + lang);
        if (!text) return;
        // Some translated strings include inline markup (<br>, <code>, etc.)
        if (text.includes("<")) {
            el.innerHTML = text;
        } else {
            el.textContent = text;
        }
    });

    // Update countdown "live" label if CTF hasn't started
    const cdLabel = document.querySelector(".countdown-label");
    if (cdLabel && cdLabel.dataset[lang]) {
        // already handled above
    }

    // Update html lang attribute
    document.documentElement.lang = lang;

    // Keep countdown label synchronized with selected language immediately
    if (typeof updateCountdown === "function") {
        updateCountdown();
    }
}
// ── COUNTDOWN ──────────────────────────────────────────────
const targetDate = new Date("2026-03-07T10:00:00+03:00");

function pad(n) {
    return String(n).padStart(2, "0");
}

function updateCountdown() {
    const daysEl = document.getElementById("cd-days");
    const hoursEl = document.getElementById("cd-hours");
    const minsEl = document.getElementById("cd-mins");
    const secsEl = document.getElementById("cd-secs");
    const liveLabel = document.querySelector(".countdown-label");

    if (!daysEl || !hoursEl || !minsEl || !secsEl) {
        return;
    }

    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
        daysEl.textContent = "00";
        hoursEl.textContent = "00";
        minsEl.textContent = "00";
        secsEl.textContent = "00";

        if (!liveLabel) {
            return;
        }

        liveLabel.textContent =
            currentLang === "ru"
                ? "// CTF идёт прямо сейчас!"
                : "// CTF is live right now!";
        liveLabel.style.color = "#5a9a5a";
        return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    const prevSecs = secsEl.textContent;
    const newSecs = pad(secs);

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minsEl.textContent = pad(mins);
    secsEl.textContent = newSecs;

    if (prevSecs !== newSecs) {
        secsEl.classList.add("flash");
        setTimeout(() => secsEl.classList.remove("flash"), 150);
    }
}

if (
    document.getElementById("cd-days") &&
    document.getElementById("cd-hours") &&
    document.getElementById("cd-mins") &&
    document.getElementById("cd-secs")
) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ── PARTICLES ──────────────────────────────────────────────
const pContainer = document.getElementById("particles");
const PARTICLE_COUNT = 25;

if (pContainer) {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = document.createElement("div");
        p.className = "particle";
        const leftPos = Math.random() * 100;
        const duration = 8 + Math.random() * 12;
        const delay = Math.random() * 10;
        const drift = (Math.random() - 0.5) * 200 + "px";
        p.style.cssText = `
    left: ${leftPos}%;
    --drift: ${drift};
    animation-duration: ${duration}s;
    animation-delay: -${delay}s;
    opacity: ${0.3 + Math.random() * 0.5};
    width: ${Math.random() > 0.7 ? 3 : 2}px;
    height: ${Math.random() > 0.7 ? 3 : 2}px;
  `;
        pContainer.appendChild(p);
    }
}

// ── SCROLL REVEAL ──────────────────────────────────────────
const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                e.target.classList.add("visible");
                observer.unobserve(e.target);
            }
        });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
);

reveals.forEach((el) => observer.observe(el));

// ── INIT LANGUAGE ──────────────────────────────────────────
function getInitialLang() {
    try {
        const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
        if (savedLang === "ru" || savedLang === "en") {
            return savedLang;
        }
    } catch (_error) {
        // Ignore storage errors
    }
    return "ru";
}

setLang(getInitialLang());
