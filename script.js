/* ============================================================
   Aya — Cybersecurity Portfolio
   Vanilla JS: scroll reveals, terminal typing, canvas backgrounds
   ============================================================ */

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- scroll reveal ---------- */

function initReveal(){
  const items = document.querySelectorAll('.reveal');
  if (prefersReduced){
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => io.observe(el));
}

/* ---------- terminal boot sequence ---------- */

function initTerminal(){
  const el = document.getElementById('terminal');
  if (!el) return;

  const lines = [
    '> whoami',
    'aya khiouat: cybersecurity analyst in training',
    '> scan --skills',
    'network defense · threat management · endpoint security · OT security',
  ];

  if (prefersReduced){
    el.innerHTML = lines.join('<br>');
    return;
  }

  let lineIndex = 0;
  let charIndex = 0;
  let current = '';

  function tick(){
    if (lineIndex >= lines.length){
      el.innerHTML = current + '<span class="cursor"></span>';
      return;
    }
    const line = lines[lineIndex];
    charIndex++;
    const partial = current + line.slice(0, charIndex);
    el.innerHTML = partial + '<span class="cursor"></span>';

    if (charIndex >= line.length){
      current += line + '<br>';
      lineIndex++;
      charIndex = 0;
      setTimeout(tick, 340);
    } else {
      setTimeout(tick, 22);
    }
  }
  tick();
}

/* ---------- ambient grid canvas (fixed background) ---------- */

function initGridCanvas(){
  const canvas = document.getElementById('grid-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, dpr;
  let nodes = [];

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = window.innerWidth * dpr;
    h = canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    const count = Math.floor((window.innerWidth * window.innerHeight) / 26000);
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.15 * dpr,
      vy: (Math.random() - 0.5) * 0.15 * dpr,
    }));
  }

  function step(){
    ctx.clearRect(0, 0, w, h);
    const maxDist = 130 * dpr;

    for (const n of nodes){
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    }

    for (let i = 0; i < nodes.length; i++){
      for (let j = i + 1; j < nodes.length; j++){
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < maxDist){
          const alpha = (1 - dist / maxDist) * 0.35;
          ctx.strokeStyle = `rgba(123,47,247,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const n of nodes){
      ctx.fillStyle = 'rgba(77,232,224,0.55)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.4 * dpr, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!prefersReduced) requestAnimationFrame(step);
  }

  resize();
  window.addEventListener('resize', resize);
  step();
}

/* ---------- small project canvas visuals ---------- */

function initProjectVisuals(){
  document.querySelectorAll('canvas[data-visual]').forEach(canvas => {
    const type = canvas.dataset.visual;
    const ctx = canvas.getContext('2d');
    let raf;

    function resize(){
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
    resize();
    window.addEventListener('resize', resize);

    let t = 0;

    function radar(){
      const { width: w, height: h } = canvas;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2 - 10;

      ctx.strokeStyle = 'rgba(201,184,224,0.18)';
      for (let i = 1; i <= 3; i++){
        ctx.beginPath();
        ctx.arc(cx, cy, (r / 3) * i, 0, Math.PI * 2);
        ctx.stroke();
      }

      const angle = t * 0.02;
      const grad = ctx.createConicGradient ? ctx.createConicGradient(angle, cx, cy) : null;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angle, angle + 0.6);
      ctx.closePath();
      ctx.fillStyle = 'rgba(77,232,224,0.18)';
      ctx.fill();
      ctx.restore();

      ctx.strokeStyle = 'rgba(77,232,224,0.8)';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
      ctx.stroke();

      t++;
      raf = requestAnimationFrame(radar);
    }

    function scan(){
      const { width: w, height: h } = canvas;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(123,47,247,0.25)';
      for (let x = 0; x < w; x += 24){
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 24){
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      const y = (t % (h + 60)) - 30;
      const gradient = ctx.createLinearGradient(0, y - 30, 0, y + 30);
      gradient.addColorStop(0, 'rgba(77,232,224,0)');
      gradient.addColorStop(0.5, 'rgba(77,232,224,0.35)');
      gradient.addColorStop(1, 'rgba(77,232,224,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, y - 30, w, 60);

      t += 1.6;
      raf = requestAnimationFrame(scan);
    }

    function grid(){
      const { width: w, height: h } = canvas;
      ctx.clearRect(0, 0, w, h);
      const cols = 10, rows = 8;
      const cw = w / cols, ch = h / rows;
      for (let i = 0; i < cols; i++){
        for (let j = 0; j < rows; j++){
          const phase = (i * 0.6 + j * 0.4 + t * 0.03);
          const pulse = (Math.sin(phase) + 1) / 2;
          ctx.fillStyle = `rgba(123,47,247,${0.05 + pulse * 0.18})`;
          ctx.fillRect(i * cw + 2, j * ch + 2, cw - 4, ch - 4);
        }
      }
      t++;
      raf = requestAnimationFrame(grid);
    }

    const renderers = { radar, scan, grid };
    const render = renderers[type] || renderers.grid;

    if (prefersReduced){
      render();
      cancelAnimationFrame(raf);
    } else {
      render();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initTerminal();
  initGridCanvas();
  initProjectVisuals();
});
