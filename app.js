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
  
  class WaveLayer {
    constructor(yPercent, length, amplitude, speed, colors) {
      this.yPercent = yPercent;
      this.length = length;
      this.amplitude = amplitude;
      this.speed = speed;
      this.colors = colors;
      this.phase = Math.random() * 100;
    }
    
    update() {
      this.phase += this.speed;
    }
    
    draw(ctx, w, h) {
      const centerY = h * this.yPercent;
      ctx.beginPath();
      ctx.moveTo(0, h);
      
      for (let x = 0; x <= w; x += 4) {
        const angle = x * this.length + this.phase;
        const y = centerY + Math.sin(angle) * this.amplitude + Math.cos(angle * 0.6) * (this.amplitude * 0.4);
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      
      const grad = ctx.createLinearGradient(0, centerY - this.amplitude * 1.5, 0, h);
      grad.addColorStop(0, this.colors[0]);
      grad.addColorStop(1, this.colors[1]);
      
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }
  
  const waves = [
    new WaveLayer(0.60, 0.003, 30, 0.006, ['rgba(235, 214, 164, 0.15)', 'rgba(250, 246, 238, 0.05)']),
    new WaveLayer(0.70, 0.004, 24, 0.008, ['rgba(255, 255, 255, 0.4)', 'rgba(250, 246, 238, 0.1)']),
    new WaveLayer(0.80, 0.005, 18, 0.010, ['rgba(175, 146, 93, 0.15)', 'rgba(235, 214, 164, 0.03)'])
  ];
  
  function drawBackground() {
    const grad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height));
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(1, '#faf6ee');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }
  
  function loop() {
    drawBackground();
    waves.forEach(w => {
      w.update();
      w.draw(ctx, width, height);
    });
    requestAnimationFrame(loop);
  }
  loop();
})();
