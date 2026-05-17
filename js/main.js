/* =========================================================
   NEXUS SHIELD — Main JavaScript
   Description: Custom cursor, scroll animations, 
                terminal typewriter, nav behavior, 
                canvas particle network
   ========================================================= */

// ── Preloader + Page Transitions ─────────────────────────────────────────────
document.body.classList.add('is-loading');

const preloader = document.createElement('div');
preloader.id = 'preloader';
preloader.innerHTML = `
  <div class="preloader-core" aria-label="Loading NexusShield interface">
    <div class="preloader-ring"></div>
    <div class="preloader-ring"></div>
    <div class="preloader-ring"></div>
    <div class="preloader-mark">
      <svg viewBox="0 0 36 36" width="52" height="52" fill="none" aria-hidden="true">
        <path d="M18 2L4 8v10c0 8.284 6.048 15.396 14 17 7.952-1.604 14-8.716 14-17V8L18 2z" stroke="#00ffc8" stroke-width="1.5" fill="rgba(0,255,200,0.08)"/>
        <path d="M14 17l3 3 5-6" stroke="#00ffc8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="preloader-text">Initializing Shield</div>
    <div class="preloader-bar"></div>
  </div>
`;
document.body.prepend(preloader);

function finishPreloader() {
  window.setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.classList.remove('is-loading');
    document.body.classList.add('page-ready');
  }, 520);
  window.setTimeout(() => preloader.remove(), 1200);
}

if (document.readyState === 'complete') finishPreloader();
else window.addEventListener('load', finishPreloader, { once: true });

document.addEventListener('click', e => {
  const link = e.target.closest('a[href]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) return;
  if (link.target && link.target !== '_self') return;
  e.preventDefault();
  document.body.classList.add('page-leaving');
  window.setTimeout(() => {
    window.location.href = href;
  }, 220);
});

// ── Dummy AI Chat Assistant ─────────────────────────────────────────────────
const aiChat = document.createElement('div');
aiChat.innerHTML = `
  <section class="ai-chat-section" aria-label="NexusShield AI chat assistant">
    <div class="container">
      <div class="mb-10">
        <div class="section-label">AI Command Console</div>
        <h2 class="section-heading">Ask <span class="accent">Nexus AI</span></h2>
        <p class="section-sub">A working demo assistant for services, Sri Lankan offices, login help, and the simulated threat dashboard.</p>
      </div>
      <div class="ai-chat-panel open">
        <div class="ai-chat-head">
          <div>
            <div class="ai-chat-title">nexus-ai.exe</div>
            <div class="ai-chat-sub">Sri Lanka SOC command console</div>
          </div>
        </div>
        <div class="ai-chat-log" role="log" aria-live="polite"></div>
        <div>
          <div class="ai-chat-suggestions">
            <button class="ai-chip" type="button">What services do you offer?</button>
            <button class="ai-chip" type="button">Show Sri Lanka offices</button>
            <button class="ai-chip" type="button">How does pricing work?</button>
          </div>
          <form class="ai-chat-form">
            <input class="ai-chat-input" type="text" placeholder="type a command or question..." autocomplete="off">
            <button class="ai-chat-send" type="submit" aria-label="Send message">run</button>
          </form>
        </div>
      </div>
    </div>
  </section>
`;
const footerEl = document.querySelector('footer');
if (footerEl) footerEl.before(aiChat);
else document.body.append(aiChat);

const chatLog = aiChat.querySelector('.ai-chat-log');
const chatForm = aiChat.querySelector('.ai-chat-form');
const chatInput = aiChat.querySelector('.ai-chat-input');

function addChatMessage(text, who = 'bot') {
  const msg = document.createElement('div');
  msg.className = `ai-msg ${who}`;
  msg.textContent = text;
  chatLog.append(msg);
  chatLog.scrollTop = chatLog.scrollHeight;
  return msg;
}

function getAiReply(rawText) {
  const text = rawText.toLowerCase();
  if (text.includes('price') || text.includes('cost') || text.includes('plan')) {
    return 'Our dummy pricing starts with Starter at $2,400/month, Professional at $7,800/month, and Enterprise as custom. For Sri Lankan clients, the Contact page can simulate a sales inquiry.';
  }
  if (text.includes('office') || text.includes('address') || text.includes('sri') || text.includes('lanka')) {
    return 'NexusShield Sri Lanka has fictional offices in Colombo 03, Kandy, Galle Fort, and Jaffna. The HQ address is No. 42, Galle Road, Colombo 03.';
  }
  if (text.includes('service') || text.includes('protect') || text.includes('security')) {
    return 'The main services are AI Threat Detection, Zero-Trust Architecture, SOC as a Service, Penetration Testing, and Cloud Security. I can point you to the Services page for the full catalog.';
  }
  if (text.includes('threat') || text.includes('map') || text.includes('attack') || text.includes('cve')) {
    return 'The Threat Intel page shows a simulated global attack map, live-style threat feed, CVE tracker, and attack category charts. All data is fictional for the web competition.';
  }
  if (text.includes('login') || text.includes('portal') || text.includes('password')) {
    return 'The Login page is a dummy portal. Use demo@nexusshield.lk and any password. It creates a fake success message only, with no real backend.';
  }
  if (text.includes('contact') || text.includes('email') || text.includes('phone')) {
    return 'You can use the Contact page form, email hello@nexusshield.lk, or call the fictional hotline +94 11 639 0911 for emergency response.';
  }
  if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
    return 'Ayubowan. I am Nexus AI, a working demo assistant for this site. Ask me about services, pricing, Sri Lankan offices, login, or the threat map.';
  }
  return 'I can help with this NexusShield site demo: services, pricing, Sri Lankan office details, dummy login, contact info, and the simulated threat intelligence dashboard.';
}

function submitChat(text) {
  const clean = text.trim();
  if (!clean) return;
  addChatMessage(clean, 'user');
  chatInput.value = '';
  const typing = addChatMessage('', 'bot');
  typing.innerHTML = '<span class="ai-typing"><span></span><span></span><span></span></span>';
  window.setTimeout(() => {
    typing.textContent = getAiReply(clean);
    chatLog.scrollTop = chatLog.scrollHeight;
  }, 650 + Math.min(clean.length * 12, 700));
}

chatForm.addEventListener('submit', e => {
  e.preventDefault();
  submitChat(chatInput.value);
});
aiChat.querySelectorAll('.ai-chip').forEach(chip => {
  chip.addEventListener('click', () => submitChat(chip.textContent));
});

addChatMessage('Ayubowan. I am Nexus AI, your cyber assistant for this demo site. Ask me about services, Sri Lankan offices, the threat map, or the demo login.');


// ── Lightweight UI Sound Effects ─────────────────────────────────────────────
// Uses Web Audio so the site does not need separate sound files.
let soundCtx = null;
let soundReady = false;

function unlockSound() {
  if (soundReady) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  soundCtx = new AudioContextClass();
  if (soundCtx.state === 'suspended') soundCtx.resume();
  soundReady = true;
  playTone(660, 0.025, 'sine', 0.018);
}

function playTone(freq = 520, duration = 0.045, type = 'sine', volume = 0.025) {
  if (!soundReady || !soundCtx) return;
  const osc = soundCtx.createOscillator();
  const gain = soundCtx.createGain();
  const now = soundCtx.currentTime;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(gain);
  gain.connect(soundCtx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.01);
}

function playClickSound() {
  playTone(720, 0.035, 'triangle', 0.026);
  setTimeout(() => playTone(980, 0.03, 'sine', 0.018), 35);
}

function playHoverSound() {
  playTone(420, 0.025, 'sine', 0.012);
}

window.addEventListener('pointerdown', unlockSound, { once: true });
window.addEventListener('keydown', unlockSound, { once: true });

document.querySelectorAll('a, button, .card, input, textarea, select, video').forEach(el => {
  el.addEventListener('mouseenter', playHoverSound);
});
document.querySelectorAll('a, button, input, textarea, select').forEach(el => {
  el.addEventListener('click', playClickSound);
});
document.querySelectorAll('video').forEach(video => {
  video.addEventListener('play', () => playTone(260, 0.12, 'sawtooth', 0.018));
  video.addEventListener('pause', () => playTone(180, 0.08, 'triangle', 0.014));
});

// ── Navigation Scroll State ────────────────────────────────
const navEl = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (navEl) navEl.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Mobile Menu ────────────────────────────────────────────
const menuToggle = document.querySelector('.menu-toggle');
const navLinks   = document.querySelector('.nav-links');
if (menuToggle && navLinks) {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-controls', 'primary-navigation');
  navLinks.id = navLinks.id || 'primary-navigation';

  function setMenuOpen(isOpen) {
    navLinks.classList.toggle('open', isOpen);
    menuToggle.classList.toggle('active', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  }

  menuToggle.addEventListener('click', () => {
    setMenuOpen(!navLinks.classList.contains('open'));
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      setMenuOpen(false);
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });
  document.addEventListener('click', e => {
    if (!navLinks.classList.contains('open')) return;
    if (navLinks.contains(e.target) || menuToggle.contains(e.target)) return;
    setMenuOpen(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) setMenuOpen(false);
  });
}

// ── Scroll Fade-Up Observer ────────────────────────────────
const fadeEls = document.querySelectorAll('.fade-up');
if (fadeEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay based on sibling position
        const siblings = Array.from(entry.target.parentElement?.children || []);
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 80}ms`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  fadeEls.forEach(el => observer.observe(el));
}

const revealEls = document.querySelectorAll('section, footer, .terminal, .card');
if (revealEls.length) {
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  revealEls.forEach(el => {
    if (!el.classList.contains('fade-up')) {
      el.classList.add('reveal-soft');
      revealObs.observe(el);
    }
  });
}

// ── Particle Network Canvas ────────────────────────────────
const canvas = document.getElementById('particle-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  const PARTICLE_COUNT = 60;
  const MAX_DIST = 130;
  const CYAN = '0,255,200';

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 1.5 + 0.5;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CYAN},0.5)`;
      ctx.fill();
    }
  }

  function init() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${CYAN},${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(animate);
  }

  resize();
  init();
  animate();
  window.addEventListener('resize', () => { resize(); init(); });
}

// ── Typewriter Effect ─────────────────────────────────────
function typewriter(el, text, speed = 45, delay = 0) {
  if (!el) return;
  setTimeout(() => {
    el.textContent = '';
    let i = 0;
    const timer = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) clearInterval(timer);
    }, speed);
  }, delay);
}

// Trigger typewriters on elements with data-type attribute
document.querySelectorAll('[data-type]').forEach((el, idx) => {
  const text = el.getAttribute('data-type');
  const delay = parseInt(el.getAttribute('data-delay') || '0');
  typewriter(el, text, 38, delay);
});

// ── Animated Stat Counters ────────────────────────────────
function animateCounter(el, target, duration = 1800) {
  let start = null;
  const isDecimal = target % 1 !== 0;

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value = eased * target;
    el.textContent = isDecimal ? value.toFixed(1) : Math.floor(value).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
  }
  requestAnimationFrame(step);
}

const counterEls = document.querySelectorAll('[data-count]');
if (counterEls.length) {
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseFloat(entry.target.getAttribute('data-count'));
        animateCounter(entry.target, target);
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counterEls.forEach(el => counterObs.observe(el));
}

// ── Active Nav Highlight ──────────────────────────────────
(function highlightNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === path || (path === 'index.html' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// ── Threat Level Ticker ───────────────────────────────────
const tickerEl = document.getElementById('threat-ticker');
if (tickerEl) {
  const threats = [
    'SCANNING: 0.0.0.0/0 — NO ACTIVE INTRUSIONS DETECTED',
    'FIREWALL STATUS: ALL NODES OPERATIONAL',
    'ENCRYPTION LAYER: AES-256 + CHACHA20 ACTIVE',
    'THREAT INTEL UPDATE: 2,847 NEW IOCs LOADED',
    'DDoS SHIELD: 99.99% UPTIME — HOLDING PERIMETER',
    'ZERO-DAY WATCH: MONITORING 14 ACTIVE CVEs',
  ];
  let ti = 0;
  function rotateThreat() {
    tickerEl.style.opacity = '0';
    setTimeout(() => {
      ti = (ti + 1) % threats.length;
      tickerEl.textContent = threats[ti];
      tickerEl.style.opacity = '1';
    }, 400);
  }
  tickerEl.textContent = threats[0];
  setInterval(rotateThreat, 3500);
}

// Demo preview visualizer used when no bundled video asset is available
const demoCanvas = document.getElementById('demo-visualizer');
if (demoCanvas) {
  const demoCtx = demoCanvas.getContext('2d');
  let demoW = 0, demoH = 0, demoFrame = 0;

  function resizeDemo() {
    demoW = demoCanvas.width = demoCanvas.offsetWidth;
    demoH = demoCanvas.height = demoCanvas.offsetHeight;
  }

  function drawDemo() {
    demoCtx.clearRect(0, 0, demoW, demoH);
    demoCtx.strokeStyle = 'rgba(0,255,200,0.08)';
    demoCtx.lineWidth = 1;
    for (let x = 0; x < demoW; x += 48) {
      demoCtx.beginPath();
      demoCtx.moveTo(x, 0);
      demoCtx.lineTo(x, demoH);
      demoCtx.stroke();
    }
    for (let y = 0; y < demoH; y += 48) {
      demoCtx.beginPath();
      demoCtx.moveTo(0, y);
      demoCtx.lineTo(demoW, y);
      demoCtx.stroke();
    }

    const nodes = [
      [0.18, 0.36], [0.36, 0.24], [0.55, 0.44],
      [0.72, 0.30], [0.82, 0.58], [0.42, 0.68], [0.22, 0.62]
    ];
    demoCtx.strokeStyle = 'rgba(0,255,200,0.28)';
    nodes.forEach((node, i) => {
      const next = nodes[(i + 2) % nodes.length];
      demoCtx.beginPath();
      demoCtx.moveTo(node[0] * demoW, node[1] * demoH);
      demoCtx.lineTo(next[0] * demoW, next[1] * demoH);
      demoCtx.stroke();
    });

    nodes.forEach((node, i) => {
      const pulse = 4 + Math.sin((demoFrame + i * 18) / 18) * 2;
      demoCtx.beginPath();
      demoCtx.arc(node[0] * demoW, node[1] * demoH, pulse, 0, Math.PI * 2);
      demoCtx.fillStyle = i % 3 === 0 ? 'rgba(255,45,85,0.85)' : 'rgba(0,255,200,0.85)';
      demoCtx.fill();
    });

    demoFrame++;
    requestAnimationFrame(drawDemo);
  }

  resizeDemo();
  drawDemo();
  window.addEventListener('resize', resizeDemo);
}
