// Force HTTPS
if (
  window.location.protocol === "http:" &&
  !window.location.hostname.includes("localhost") &&
  !window.location.hostname.includes("127.0.0.1")
) {
  window.location.href = window.location.href.replace("http:", "https:");
}

// Service Worker Registration
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("../sw.js").catch(() => {});
}

// Navigation with deep-linking
function showSection(sectionId, btn, skipHistory) {
  document
    .querySelectorAll(".section")
    .forEach((s) => s.classList.remove("active"));
  document
    .querySelectorAll(".nav-btn")
    .forEach((b) => b.classList.remove("active"));
  document.getElementById(sectionId).classList.add("active");

  if (btn) {
    btn.classList.add("active");
  } else {
    const matchingBtn = document.querySelector(
      `.nav-btn[onclick*="'${sectionId}'"]`,
    );
    if (matchingBtn) matchingBtn.classList.add("active");
  }

  // Update URL hash without adding to history stack repeatedly
  if (!skipHistory && window.location.hash !== "#" + sectionId) {
    history.pushState(null, null, "#" + sectionId);
  }

  const nav = document.querySelector("nav");
  if (nav) {
    window.scrollTo({ top: nav.offsetTop - 20, behavior: "smooth" });
  }

  // Re-trigger animations for timeline items
  setTimeout(() => {
    document.querySelectorAll(".timeline-item").forEach((item) => {
      item.classList.remove("visible");
    });
    observeTimelineItems();
  }, 100);
}

// Handle browser back/forward and direct links
function handleHash() {
  const hash = window.location.hash.slice(1);
  const validSections = [
    "plan",
    "restaurants",
    "hotels",
    "checklist",
    "backup",
  ];
  if (validSections.includes(hash)) {
    showSection(hash, null);
  } else if (!hash) {
    const defaultBtn =
      document.querySelector(".nav-btn.active") ||
      document.querySelector(".nav-btn");
    if (defaultBtn) {
      const match = defaultBtn
        .getAttribute("onclick")
        .match(/showSection\('([^']+)'/);
      if (match) showSection(match[1], defaultBtn, true);
    }
  }
}

window.addEventListener("popstate", handleHash);

// Checklist with localStorage persistence
function toggleCheck(element) {
  element.classList.toggle("checked");
  saveChecklist();
}

function saveChecklist() {
  const tripId = document.body.dataset.tripId || "generic";
  const items = document.querySelectorAll(".checklist-item");
  const state = Array.from(items).map((item) =>
    item.classList.contains("checked"),
  );
  localStorage.setItem(tripId + "Checklist", JSON.stringify(state));
}

function loadChecklist() {
  const tripId = document.body.dataset.tripId || "generic";
  const saved = localStorage.getItem(tripId + "Checklist");
  if (saved) {
    const state = JSON.parse(saved);
    const items = document.querySelectorAll(".checklist-item");
    items.forEach((item, i) => {
      if (state[i]) item.classList.add("checked");
    });
  }
}

// Live Mode & Countdown
function updateCountdown() {
  const countdownContainer = document.querySelector(".countdown-container");
  if (!countdownContainer) return;

  const tripStartStr = countdownContainer.dataset.start;
  const tripEndStr = countdownContainer.dataset.end;
  if (!tripStartStr || !tripEndStr) return;

  const tripStart = new Date(tripStartStr);
  const tripEnd = new Date(tripEndStr);
  const now = new Date();
  const countdownEl = document.getElementById("countdown");
  const statusEl = document.getElementById("tripStatus");

  if (now >= tripStart && now <= tripEnd) {
    // During trip – countdown to trip end
    const diff = tripEnd - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    countdownEl.innerHTML = `
            <div class="countdown-unit">
                <div class="countdown-number">${days}</div>
                <div class="countdown-label">Tage</div>
            </div>
            <div class="countdown-unit">
                <div class="countdown-number">${hours}</div>
                <div class="countdown-label">Std.</div>
            </div>
            <div class="countdown-unit">
                <div class="countdown-number">${minutes}</div>
                <div class="countdown-label">Min.</div>
            </div>
        `;
    if (statusEl) {
      statusEl.innerHTML =
        "✈️ Die Reise läuft – noch " +
        days +
        " Tag" +
        (days !== 1 ? "e" : "") +
        " unterwegs";
      statusEl.className = "trip-status";
      statusEl.style.display = "block";
    }
  } else if (now > tripEnd) {
    // Trip ended
    countdownEl.innerHTML =
      '<p style="color: var(--primary-accent); font-family: Playfair Display, serif; font-size: 1.3rem; font-style: italic;">Bis zum nächsten Abenteuer!</p>';
    if (statusEl) {
      statusEl.innerHTML = "✨ Die Reise ist vorbei. Auf ein neues Abenteuer!";
      statusEl.className = "trip-status ended";
      statusEl.style.display = "block";
    }
  } else {
    // Before trip – original countdown
    const diff = tripStart - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    countdownEl.innerHTML = `
            <div class="countdown-unit">
                <div class="countdown-number">${days}</div>
                <div class="countdown-label">Tage</div>
            </div>
            <div class="countdown-unit">
                <div class="countdown-number">${hours}</div>
                <div class="countdown-label">Stunden</div>
            </div>
            <div class="countdown-unit">
                <div class="countdown-number">${minutes}</div>
                <div class="countdown-label">Minuten</div>
            </div>
        `;
    if (statusEl) statusEl.style.display = "none";
  }
}

// Highlight current day during trip
function highlightCurrentDay() {
  const dayCards = document.querySelectorAll("#plan .day-card");
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  dayCards.forEach((card) => {
    const dateAttr = card.dataset.date;
    if (dateAttr === todayStr) {
      card.classList.add("current-day");
      const dayHeader = card.querySelector(".day-header");
      if (dayHeader) {
        const badge = document.createElement("span");
        badge.className = "live-badge";
        badge.textContent = "Heute";
        const dateSpan = dayHeader.querySelector(".day-date");
        if (dateSpan) {
          dateSpan.appendChild(badge);
        } else {
          dayHeader.appendChild(badge);
        }
      }
    }
  });
}

// Parallax effect for hero
function handleParallax() {
  const scrolled = window.pageYOffset;
  const heroImage = document.getElementById("heroImage");
  if (heroImage && scrolled < window.innerHeight) {
    heroImage.style.transform = `translateY(${scrolled * 0.5}px) scale(1.1)`;
  }
}

// Navbar scroll effect
function handleNavbar() {
  const navbar = document.getElementById("navbar");
  if (navbar) {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
}

// Intersection Observer for timeline animations
function observeTimelineItems() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
  );

  document.querySelectorAll(".timeline-item").forEach((item) => {
    observer.observe(item);
  });
}

// Initialize everything on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  loadChecklist();
  updateCountdown();
  setInterval(updateCountdown, 60000);
  highlightCurrentDay();
  handleHash();
  observeTimelineItems();

  window.addEventListener("scroll", () => {
    handleParallax();
    handleNavbar();
  });
});
