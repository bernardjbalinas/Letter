/* =========================================================
   LETTER WEBSITE — SCRIPT.JS
   Personalize the 3 values below.
   ========================================================= */

const CONFIG = {
  recipient: "Someone Special",
  sender: "Berns",

  // Change this to anything you want.
  secretMessage:
    "If you ever come back to this page, I hope it finds you on a good day.",

  // Optional: set to false if you do not want falling hearts.
  fallingHearts: true
};

/* ---------- Personalization ---------- */

document.querySelectorAll("[data-recipient]").forEach((element) => {
  element.textContent = CONFIG.recipient;
});

document.querySelectorAll("[data-sender]").forEach((element) => {
  element.textContent = CONFIG.sender;
});

/* ---------- Elements ---------- */

const intro = document.getElementById("intro");
const envelope = document.querySelector(".envelope");
const openLetterButton = document.getElementById("openLetter");
const letterPage = document.getElementById("letterPage");
const replayButton = document.getElementById("replayButton");
const music = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");
const musicIcon = document.getElementById("musicIcon");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const heartButton = document.getElementById("heartButton");
const secretMessage = document.getElementById("secretMessage");
const petalsContainer = document.getElementById("petals");

/* ---------- Open the envelope ---------- */

openLetterButton.addEventListener("click", () => {
  envelope.classList.add("opening");

  if (CONFIG.fallingHearts) {
    createHeartBurst(18);
  }

  // Slight delay allows the envelope animation to finish first.
  setTimeout(() => {
    intro.classList.add("exiting");

    setTimeout(() => {
      intro.hidden = true;
      letterPage.classList.add("visible");
      letterPage.setAttribute("aria-hidden", "false");

      // Trigger visible elements immediately after page appears.
      document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

      window.scrollTo({ top: 0, behavior: "instant" });
    }, 650);
  }, 650);
});

/* ---------- Scroll reveal ---------- */

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible-reveal");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

/* ---------- Music ---------- */

musicToggle.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      musicToggle.setAttribute("aria-pressed", "true");
      musicToggle.title = "Pause music";
      musicIcon.textContent = "❚❚";
    } catch (error) {
      // Usually means music.mp3 is missing or playback was blocked.
      musicToggle.title = "Add a music.mp3 file to enable music";
      musicIcon.textContent = "×";

      setTimeout(() => {
        musicIcon.textContent = "♫";
      }, 1300);
    }
  } else {
    music.pause();
    musicToggle.setAttribute("aria-pressed", "false");
    musicToggle.title = "Play music";
    musicIcon.textContent = "♫";
  }
});

/* ---------- Theme ---------- */

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("evening");
  const active = document.body.classList.contains("evening");

  themeToggle.setAttribute("aria-pressed", String(active));
  themeToggle.title = active ? "Use daylight mode" : "Use evening mode";
  themeIcon.textContent = active ? "☀" : "☾";
});

/* ---------- Final heart ---------- */

heartButton.addEventListener("click", () => {
  const saved = heartButton.classList.toggle("saved");

  if (saved) {
    heartButton.querySelector("span:first-child").textContent = "♥";
    secretMessage.textContent = CONFIG.secretMessage;

    if (CONFIG.fallingHearts) {
      createHeartBurst(24);
    }
  } else {
    heartButton.querySelector("span:first-child").textContent = "♡";
    secretMessage.textContent = "";
  }
});

/* ---------- Replay ---------- */

replayButton.addEventListener("click", () => {
  letterPage.classList.remove("visible");
  letterPage.setAttribute("aria-hidden", "true");

  document.querySelectorAll(".reveal").forEach((el) => {
    el.classList.remove("visible-reveal");
  });

  intro.hidden = false;
  intro.classList.remove("exiting");
  envelope.classList.remove("opening");

  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ---------- Gentle 3D cards ---------- */

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const rotateY = (x - 0.5) * 7;
    const rotateX = (0.5 - y) * 7;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

/* ---------- Falling hearts ---------- */

function createHeartBurst(amount = 16) {
  if (!petalsContainer) return;

  for (let i = 0; i < amount; i++) {
    const heart = document.createElement("span");
    heart.className = "petal";
    heart.textContent = Math.random() > 0.5 ? "♡" : "♥";

    const left = Math.random() * 100;
    const duration = 4 + Math.random() * 4;
    const delay = Math.random() * 1.3;
    const size = 10 + Math.random() * 14;
    const drift = -90 + Math.random() * 180;

    heart.style.left = `${left}%`;
    heart.style.fontSize = `${size}px`;
    heart.style.color = Math.random() > 0.5 ? "#b76a72" : "#d19a91";
    heart.style.animationDuration = `${duration}s`;
    heart.style.animationDelay = `${delay}s`;
    heart.style.setProperty("--drift", `${drift}px`);

    petalsContainer.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, (duration + delay) * 1000 + 300);
  }
}
