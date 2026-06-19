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

// ══ Animated Live Wallpaper Canvas Background ══
(function() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = window.innerWidth;
  let height = window.innerHeight;
  
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }
  
  window.addEventListener('resize', resize);
  resize();
  
  class GoldParticle {
    constructor() {
      this.reset(true);
    }
    
    reset(init = false) {
      this.x = Math.random() * width;
      this.y = init ? Math.random() * height : height + 10;
      this.size = Math.random() * 3 + 1; // 1px to 4px
      this.speedY = -(Math.random() * 0.4 + 0.15); // Very slow drift
      this.speedX = Math.random() * 0.2 - 0.1;
      this.maxOpacity = Math.random() * 0.35 + 0.15;
      this.opacity = init ? Math.random() * this.maxOpacity : 0;
      this.fadeSpeed = Math.random() * 0.005 + 0.002;
      this.fadingIn = true;
    }
    
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      
      // Floating sinusoidal motion
      this.x += Math.sin(this.y * 0.01) * 0.05;
      
      if (this.fadingIn) {
        this.opacity += this.fadeSpeed;
        if (this.opacity >= this.maxOpacity) {
          this.opacity = this.maxOpacity;
          this.fadingIn = false;
        }
      } else {
        if (this.y < height * 0.2) {
          this.opacity -= this.fadeSpeed * 1.5;
        }
      }
      
      if (this.y < -10 || this.opacity <= 0 || this.x < -10 || this.x > width + 10) {
        this.reset(false);
      }
    }
    
    draw(ctx) {
      if (this.opacity <= 0) return;
      ctx.beginPath();
      // Draw radial gold glow
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
      grad.addColorStop(0, `rgba(212, 175, 55, ${this.opacity})`);
      grad.addColorStop(0.3, `rgba(235, 214, 164, ${this.opacity * 0.6})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = grad;
      ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  const particles = Array.from({ length: 35 }, () => new GoldParticle());
  
  function drawBackground() {
    const grad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height));
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(1, '#faf6ee');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }
  
  function loop() {
    drawBackground();
    particles.forEach(p => {
      p.update();
      p.draw(ctx);
    });
    requestAnimationFrame(loop);
  }
  loop();
})();
