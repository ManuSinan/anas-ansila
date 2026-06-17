// Wedding Configuration Details
const WEDDING_DATE = new Date("2026-07-09T11:30:00+05:30"); // Thursday, July 9, 2026 at 11:30 AM IST
const WHATSAPP_PHONE = "919645244441"; // Default RSVP number from original invitation

// Elements
const splash = document.getElementById("splash");
const splashTapHint = document.getElementById("splash-tap-hint");
const splashNames = document.getElementById("splash-names");
const appContainer = document.getElementById("app");
const curtainVideo = document.getElementById("curtain-video");

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

const rsvpForm = document.getElementById("rsvp-form");

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

  // Fade in Anas & Ansila's names overlay ONLY after the curtain has completely opened (2.2 seconds)
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

    // Completely remove the splash from layout and pause resources after transition finishes
    setTimeout(() => {
      splash.style.display = "none";
      if (curtainVideo) {
        curtainVideo.pause(); // Stop video playback to conserve resources
      }
    }, 1500); // Matches CSS transition duration of 1.5s
  }, 5500); // 5.5 seconds total time (2.2s curtain drawing + 3.3s name display)
});



// 2. Countdown Clock Ticker
function pad(num) {
  return String(num).padStart(2, "0");
}

function updateCountdown() {
  const now = new Date().getTime();
  const difference = WEDDING_DATE.getTime() - now;

  if (difference <= 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    return;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  daysEl.textContent = pad(days);
  hoursEl.textContent = pad(hours);
  minutesEl.textContent = pad(minutes);
  secondsEl.textContent = pad(seconds);
}

// Start countdown
updateCountdown();
setInterval(updateCountdown, 1000);

// 3. Intersection Observer Scroll reveals
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: "0px 0px -40px 0px"
});

revealElements.forEach(element => {
  revealObserver.observe(element);
});

// 4. RSVP Form Submission via WhatsApp
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
