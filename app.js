// Elements
const splash = document.getElementById("splash");
const splashTapHint = document.getElementById("splash-tap-hint");
const splashNames = document.getElementById("splash-names");
const appContainer = document.getElementById("app");
const curtainVideo = document.getElementById("curtain-video");

// Audio Controls
const bgAudio = document.getElementById("bg-audio");
const musicToggle = document.getElementById("music-toggle");
const musicIcon = document.getElementById("music-icon-playing");

// Guest Selector
const btnMinus = document.getElementById("btn-minus");
const btnPlus = document.getElementById("btn-plus");
const guestCountEl = document.getElementById("guest-count");

// RSVP Submission Triggers
const btnAcceptSubmit = document.getElementById("btn-accept-submit");
const btnDeclineSubmit = document.getElementById("btn-decline-submit");

const WHATSAPP_PHONE = "919645244441";
let guestCount = 2;

// 1. Splash Screen Curtain Video & Fading Names Transition (Tapping Screen)
splash.addEventListener("click", () => {
  // Prevent double trigger of transition sequence
  if (splash.classList.contains("transitioning")) return;
  splash.classList.add("transitioning");

  // Play background music on first user interaction (browser autoplay policy workaround)
  if (bgAudio) {
    bgAudio.play().then(() => {
      if (musicIcon) musicIcon.classList.add("animate-spin");
    }).catch(err => console.log("Audio play delayed:", err));
  }

  // Fade out the tap instruction hint
  if (splashTapHint) {
    splashTapHint.classList.add("hide");
  }

  // Start playing the curtain video
  if (curtainVideo) {
    curtainVideo.play();
  }

  // Fade in names overlay ONLY after the curtain has completely opened (2.2 seconds)
  setTimeout(() => {
    if (splashNames) {
      splashNames.classList.add("show");
    }
  }, 2200);
  
  // Wait for the names to be displayed, then fade out the splash screen (5.5s total)
  setTimeout(() => {
    splash.classList.add("fade-out");
    appContainer.classList.remove("hidden");
    setTimeout(() => {
      appContainer.classList.add("fade-in");
    }, 50);
    document.body.classList.remove("no-scroll");
    
    // Completely remove the splash from layout and pause video resources after transition finishes
    setTimeout(() => {
      splash.style.display = "none";
      if (curtainVideo) {
        curtainVideo.pause();
      }
    }, 1500);
  }, 5500);
});

// 2. Audio Toggle Play/Pause
if (musicToggle && bgAudio) {
  musicToggle.addEventListener("click", () => {
    if (bgAudio.paused) {
      bgAudio.play();
      if (musicIcon) musicIcon.classList.add("animate-spin");
    } else {
      bgAudio.pause();
      if (musicIcon) musicIcon.classList.remove("animate-spin");
    }
  });
}

// 3. Guest Selector Controls
if (btnMinus && btnPlus && guestCountEl) {
  btnMinus.addEventListener("click", () => {
    if (guestCount > 1) {
      guestCount--;
      guestCountEl.textContent = String(guestCount).padStart(2, "0");
    }
  });

  btnPlus.addEventListener("click", () => {
    if (guestCount < 10) {
      guestCount++;
      guestCountEl.textContent = String(guestCount).padStart(2, "0");
    }
  });
}

// 4. RSVP Form Submission via WhatsApp
function sendRSVP(attendance) {
  const nameInput = document.getElementById("rsvp-name");
  if (!nameInput) return;
  const name = nameInput.value.trim();

  if (!name) {
    alert("Please enter your name first.");
    nameInput.focus();
    return;
  }

  const statusIcon = attendance === "Joyfully Accepts" ? "🎉" : "✉️";
  const guestPlural = guestCount === 1 ? "person" : "people";

  let text = "";
  if (attendance === "Joyfully Accepts") {
    text = `Assalamu Alaikum! I would like to RSVP for Anas & Ansila's wedding on July 9, 2026.\n\n` +
           `*Name:* ${name}\n` +
           `*Attendance:* ${statusIcon} Joyfully Accepts\n` +
           `*Guests:* ${guestCount} ${guestPlural}\n\n` +
           `Looking forward to celebrating this blessed union!`;
  } else {
    text = `Assalamu Alaikum! I would like to RSVP for Anas & Ansila's wedding on July 9, 2026.\n\n` +
           `*Name:* ${name}\n` +
           `*Attendance:* ${statusIcon} Regretfully Declines\n\n` +
           `Sending you warm blessings and prayers!`;
  }

  const encodedText = encodeURIComponent(text);
  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`;

  window.open(whatsappUrl, "_blank");
}

if (btnAcceptSubmit) {
  btnAcceptSubmit.addEventListener("click", () => sendRSVP("Joyfully Accepts"));
}
if (btnDeclineSubmit) {
  btnDeclineSubmit.addEventListener("click", () => sendRSVP("Regretfully Declines"));
}

/* ══ Countdown timer ══ */
const wedding = new Date('2026-07-09T11:30:00+05:30'); // Thursday, July 9, 2026 at 11:30 AM IST
function tick(){
  const diff = wedding - new Date();
  if (diff <= 0) {
    const gridEl = document.querySelector('.countdown-grid');
    if (gridEl) {
      gridEl.innerHTML = '<p style="color:#d2b56b;font-family:Playfair Display,serif;font-size:0.85rem;letter-spacing:0.15em;padding:1.5rem;text-align:center;width:100%">Alhamdulillah — The Big Day is Here!</p>';
    }
    return;
  }
  const pad = n => String(Math.floor(n)).padStart(2, '0');
  const dEl = document.getElementById('cd-days');
  const hEl = document.getElementById('cd-hours');
  const mEl = document.getElementById('cd-mins');
  const sEl = document.getElementById('cd-secs');
  
  if (dEl) dEl.textContent = pad(diff / 86400000);
  if (hEl) hEl.textContent = pad((diff % 86400000) / 3600000);
  if (mEl) mEl.textContent = pad((diff % 3600000) / 60000);
  if (sEl) sEl.textContent = pad((diff % 60000) / 1000);
}
tick();
setInterval(tick, 1000);

/* ══ Scroll reveal elements ══ */
const obs = new IntersectionObserver(e => {
  e.forEach(x => {
    if (x.isIntersecting) {
      x.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
