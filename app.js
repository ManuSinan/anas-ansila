// Elements
const splash = document.getElementById("splash");
const splashTapHint = document.getElementById("splash-tap-hint");
const splashNames = document.getElementById("splash-names");
const appContainer = document.getElementById("app");
const curtainVideo = document.getElementById("curtain-video");
const rsvpForm = document.getElementById("rsvp-form");

// WhatsApp number from original invitation
const WHATSAPP_PHONE = "919645244441"; 

// 1. Splash Screen Curtain Video & Fading Names Transition (Tapping Screen)
splash.addEventListener("click", () => {
  // Prevent double trigger of transition sequence
  if (splash.classList.contains("transitioning")) return;
  splash.classList.add("transitioning");

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
  }, 2200); // 2.2s delay matches the curtain opening duration
  
  // Wait for the names to be displayed, then fade out the splash screen (5.5s total)
  setTimeout(() => {
    // Add fade-out transition to the whole splash container
    splash.classList.add("fade-out");
    
    // Reveal the main invitation card beneath
    appContainer.classList.remove("hidden");
    setTimeout(() => {
      appContainer.classList.add("fade-in");
    }, 50);
    document.body.classList.remove("no-scroll");
    
    // Completely remove the splash from layout and pause resources after transition finishes
    setTimeout(() => {
      splash.style.display = "none";
      if (curtainVideo) {
        curtainVideo.pause(); // Stop video playback to conserve resources
      }
    }, 1500); // Matches CSS transition duration of 1.5s
  }, 5500); // 5.5 seconds total time (2.2s curtain drawing + 3.3s name display)
});

/* ══ Countdown timer ══ */
const wedding = new Date('2026-07-09T11:30:00+05:30'); // Thursday, July 9, 2026 at 11:30 AM IST
function tick(){
  const diff = wedding - new Date();
  if (diff <= 0) {
    const gridEl = document.querySelector('.countdown-grid');
    if (gridEl) {
      gridEl.innerHTML = '<p style="color:#3c3022;font-family:Cinzel,serif;font-size:0.85rem;letter-spacing:0.15em;padding:1.5rem;text-align:center;width:100%">Alhamdulillah — The Big Day is Here!</p>';
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

/* ══ RSVP WhatsApp Submission ══ */
if (rsvpForm) {
  rsvpForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const guests = document.getElementById("guests").value;
    const attendance = document.querySelector('input[name="attendance"]:checked').value;

    if (!name) {
      alert("Please enter your name.");
      document.getElementById("name").focus();
      return;
    }

    const statusIcon = attendance === "Joyfully Accepts" ? "🎉" : "✉️";
    const guestPlural = guests === "1" ? "person" : "people";

    // Construct Anas & Ansila's RSVP Message
    const text = `Assalamu Alaikum! I would like to RSVP for Anas & Ansila's wedding on July 9, 2026.\n\n` +
                 `*Name:* ${name}\n` +
                 `*Attendance:* ${statusIcon} ${attendance}\n` +
                 `*Guests:* ${guests} ${guestPlural}\n\n` +
                 `Looking forward to celebrating this blessed union!`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`;

    window.open(whatsappUrl, "_blank");
  });
}
