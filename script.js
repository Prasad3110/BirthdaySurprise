/* ── State ── */
const openedGifts = new Set();
let currentGift = 0;

const screens = {
  landing: document.getElementById("landing"),
  gifts: document.getElementById("gifts"),
  gift1: document.getElementById("gift-1"),
  gift2: document.getElementById("gift-2"),
  gift3: document.getElementById("gift-3"),
  cake: document.getElementById("cake"),
  letter: document.getElementById("letter"),
};

const giftHint = document.getElementById("gift-hint");
const progressText = document.getElementById("progress-text");
const giftButtons = document.querySelectorAll(".gift-box");
const confettiCanvas = document.getElementById("confetti-canvas");
const ctx = confettiCanvas.getContext("2d");
const video = document.getElementById("birthday-video");
const videoAudio = document.getElementById("video-audio");
const musicBtn = document.getElementById("music-btn");
const musicIconOn = document.getElementById("music-icon-on");
const musicIconOff = document.getElementById("music-icon-off");

let confettiPieces = [];
let confettiRunning = false;
let activeScreen = "landing";
let videoAudioMuted = false;

if (videoAudio) {
  videoAudio.volume = 0.5;
  videoAudio.loop = true;
}

/* ── Helpers ── */
function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

function setActiveScreen(id) {
  Object.entries(screens).forEach(([key, el]) => {
    el.classList.toggle("active", key === id);
  });
  activeScreen = id;
}

function updateGiftUI() {
  const count = openedGifts.size;
  progressText.textContent = `${count} of 3 opened`;

  giftButtons.forEach((btn) => {
    const n = Number(btn.dataset.gift);
    const isOpened = openedGifts.has(n);
    const isNext = n === count + 1;
    const isLocked = !isOpened && !isNext;

    btn.classList.toggle("locked", isLocked);
    btn.classList.toggle("opened", isOpened);
    btn.classList.toggle("next-up", isNext);
    btn.disabled = isLocked || isOpened;
  });

  if (count === 0) giftHint.textContent = "Tap Gift 1 to begin";
  else if (count === 1) giftHint.textContent = "Gift 2 is ready for you";
  else if (count === 2) giftHint.textContent = "One more gift awaits";
  else giftHint.textContent = "All gifts opened ✨";
}

/* ── Floating hearts ── */
function createHearts() {
  const container = document.querySelector(".hearts-bg");
  const emojis = ["💗", "💖", "💕", "❤️", "🤍", "💝"];

  for (let i = 0; i < 22; i++) {
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = emojis[i % emojis.length];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDuration = `${10 + Math.random() * 14}s`;
    heart.style.animationDelay = `${Math.random() * 10}s`;
    heart.style.fontSize = `${0.7 + Math.random() * 1.2}rem`;
    container.appendChild(heart);
  }
}

/* ── Confetti ── */
function launchConfetti() {
  const colors = ["#ff6b9d", "#e84d82", "#ffc9dc", "#ffd166", "#ffffff", "#ff9fbe"];
  confettiPieces = Array.from({ length: 140 }, () => ({
    x: Math.random() * confettiCanvas.width,
    y: -20 - Math.random() * confettiCanvas.height * 0.5,
    w: 6 + Math.random() * 8,
    h: 4 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    spin: (Math.random() - 0.5) * 8,
    speed: 2 + Math.random() * 4,
    drift: (Math.random() - 0.5) * 2,
  }));

  if (!confettiRunning) {
    confettiRunning = true;
    animateConfetti();
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  confettiPieces = confettiPieces.filter((p) => p.y < confettiCanvas.height + 40);

  confettiPieces.forEach((p) => {
    p.y += p.speed;
    p.x += p.drift;
    p.rotation += p.spin;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  });

  if (confettiPieces.length > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiRunning = false;
  }
}

/* ── GSAP transitions ── */
function transitionTo(fromId, toId, onComplete) {
  const from = screens[fromId];
  const to = screens[toId];

  to.classList.add("active");
  gsap.set(to, { opacity: 0, scale: 1.03, filter: "blur(10px)" });

  gsap.timeline({
    onComplete: () => {
      from.classList.remove("active");
      gsap.set([from, to], { clearProps: "all" });
      activeScreen = toId;
      onComplete?.();
    },
  })
    .to(from, {
      opacity: 0,
      scale: 0.96,
      filter: "blur(8px)",
      duration: 0.55,
      ease: "power3.inOut",
    })
    .to(
      to,
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.7,
        ease: "power3.out",
      },
      "-=0.3"
    );
}

function animateLandingIn() {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.from(".landing-hearts", { opacity: 0, y: 24, duration: 0.8 })
    .from(".landing-name", { opacity: 0, y: 40, scale: 0.92, duration: 1 }, "-=0.4")
    .from(".landing-from", { opacity: 0, y: 20, duration: 0.7 }, "-=0.5")
    .from("#start-btn", { opacity: 0, y: 16, duration: 0.6 }, "-=0.3");
}

function animateGiftsIn() {
  gsap.from(".gifts-header", { opacity: 0, y: 30, duration: 0.7, ease: "power3.out" });
  gsap.from(".gift-box", {
    opacity: 0,
    y: 50,
    scale: 0.8,
    stagger: 0.15,
    duration: 0.8,
    ease: "back.out(1.4)",
    delay: 0.2,
  });
  gsap.from(".progress", { opacity: 0, duration: 0.5, delay: 0.7 });
}

function animateGiftContent(screenId) {
  const screen = screens[screenId];
  const card = screen.querySelector(".glass-card");
  const btn = screen.querySelector(".next-btn");

  // All gifts now use split layout
  const imgWrap = screen.querySelector(".split-img-wrap");
  const textSide = screen.querySelector(".split-text-side");
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  if (imgWrap) tl.from(imgWrap, { opacity: 0, x: -50, scale: 0.95, duration: 0.9 });
  if (textSide) tl.from(textSide, { opacity: 0, x: 40, duration: 0.8 }, "-=0.5");
  if (card) {
    tl.from(card.querySelectorAll(".message-line"), {
      opacity: 0, y: 16, stagger: 0.15, duration: 0.6,
    }, "-=0.4");
  }
  if (btn) tl.from(btn, { opacity: 0, y: 16, duration: 0.5 }, "-=0.2");

  // Auto-play video (muted) when gift 2 opens
  if (screenId === "gift2") {
    const vid = screen.querySelector("video");
    if (vid) {
      vid.muted = true;
      setTimeout(() => {
        vid.play().catch(() => {
          console.log("Video autoplay blocked");
        });
      }, 200);
    }
  }
}

function animateCakeIn() {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.from(".cake-card", { opacity: 0, y: 50, scale: 0.92, duration: 0.9 })
    .from(".css-cake", { opacity: 0, y: 20, scale: 0.85, duration: 0.8 }, "-=0.4")
    .from(".cake-messages p, .cake-hearts-row", {
      opacity: 0, y: 14, stagger: 0.12, duration: 0.55,
    }, "-=0.3")
    .from("#cake-next-btn", { opacity: 0, y: 16, duration: 0.5 }, "-=0.1");
}

function animateLetterIn() {
  launchConfetti();

  gsap.from(".letter-card", {
    opacity: 0,
    y: 50,
    scale: 0.94,
    duration: 1,
    ease: "power3.out",
  });
  gsap.from(".letter-body p", {
    opacity: 0,
    y: 14,
    stagger: 0.12,
    duration: 0.6,
    delay: 0.4,
    ease: "power2.out",
  });
  gsap.from("#replay-btn", { opacity: 0, duration: 0.5, delay: 1.2 });
}

function openGiftBox(btn, giftNum) {
  btn.classList.add("opening");
  btn.classList.remove("next-up");

  gsap.to(btn.querySelector(".gift-box-inner"), {
    scale: 1.1,
    duration: 0.3,
    yoyo: true,
    repeat: 1,
    ease: "power2.inOut",
    onComplete: () => {
      setTimeout(() => {
        btn.classList.remove("opening");
        const giftKey = `gift${giftNum}`;
        transitionTo("gifts", giftKey, () => animateGiftContent(giftKey));
      }, 400);
    },
  });
}

/* ── Background music controls ── */
function startMusic() {
  if (videoAudio && videoAudio.paused) {
    videoAudio.currentTime = 0;
    videoAudio.play().catch(() => {});
  }
}

musicBtn.addEventListener("click", () => {
  videoAudioMuted = !videoAudioMuted;
  if (videoAudio) videoAudio.muted = videoAudioMuted;
  musicIconOn.style.display = videoAudioMuted ? "none" : "";
  musicIconOff.style.display = videoAudioMuted ? "" : "none";
  musicBtn.setAttribute("aria-label", videoAudioMuted ? "Unmute music" : "Mute music");
});

/* ── Event handlers ── */
document.getElementById("start-btn").addEventListener("click", () => {
  startMusic();
  gsap.to("#start-btn", {
    scale: 0.95,
    duration: 0.15,
    yoyo: true,
    repeat: 1,
    onComplete: () => {
      transitionTo("landing", "cake", animateCakeIn);
    },
  });
});

giftButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.disabled || btn.classList.contains("locked")) return;
    const n = Number(btn.dataset.gift);
    if (n !== openedGifts.size + 1) return;
    currentGift = n;
    openGiftBox(btn, n);
  });
});

document.querySelectorAll(".next-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const complete = Number(btn.dataset.complete);
    const dest = btn.dataset.next;
    openedGifts.add(complete);
    updateGiftUI();

    if (video && !video.paused) video.pause();

    const fromKey = `gift${complete}`;

    if (dest === "cake") {
      transitionTo(fromKey, "cake", animateCakeIn);
    } else if (dest === "letter") {
      transitionTo(fromKey, "letter", animateLetterIn);
    } else {
      transitionTo(fromKey, "gifts", animateGiftsIn);
    }  });
});

document.getElementById("cake-next-btn").addEventListener("click", () => {
  transitionTo("cake", "gifts", animateGiftsIn);
});

/* ── Tap to play/pause video in gift 2 ── */
const gift2Section = document.getElementById("gift-2");
if (gift2Section) {
  gift2Section.addEventListener("click", (e) => {
    if (e.target.closest(".btn")) return;
    const vid = gift2Section.querySelector("video");
    if (!vid) return;
    if (vid.paused) {
      vid.muted = true;
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  });
}

document.getElementById("replay-btn").addEventListener("click", () => {
  openedGifts.clear();
  currentGift = 0;
  updateGiftUI();
  giftButtons.forEach((b) => b.classList.remove("opening", "opened"));
  if (video) {
    video.pause();
    video.currentTime = 0;
  }
  if (videoAudio) {
    videoAudio.currentTime = 0;
    if (!videoAudioMuted) videoAudio.play().catch(() => {});
  }
  transitionTo("letter", "landing", animateLandingIn);
});

/* ── Init ── */
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
createHearts();
updateGiftUI();
animateLandingIn();
