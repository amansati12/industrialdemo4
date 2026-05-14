/* =============================================
   VoltEdge EV Components - Main JavaScript
   ============================================= */

// === Loader ===
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 2200);
});

// === Custom Cursor ===
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
if (cursor && cursorRing && window.innerWidth > 991) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    setTimeout(() => {
      cursorRing.style.left = e.clientX + 'px';
      cursorRing.style.top = e.clientY + 'px';
    }, 60);
  });
  document.querySelectorAll('a, button, .glass-card, .industry-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2)';
      cursorRing.style.transform = 'translate(-50%,-50%) scale(1.5)';
      cursorRing.style.borderColor = 'rgba(0,255,136,0.6)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
      cursorRing.style.borderColor = 'rgba(0,212,255,0.5)';
    });
  });
}

// === Navbar scroll effect ===
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// === Back to top ===
const btt = document.getElementById('back-to-top');
if (btt) {
  window.addEventListener('scroll', () => {
    btt.classList.toggle('visible', window.scrollY > 400);
  });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// === Mobile Nav ===
const overlay = document.getElementById('nav-overlay');
const toggler = document.querySelector('.navbar-toggler');
const navCollapse = document.getElementById('navbarNav');

if (overlay && toggler && navCollapse) {
  toggler.addEventListener('click', () => {
    const isOpen = navCollapse.classList.contains('show');
    if (!isOpen) {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });
  overlay.addEventListener('click', () => {
    const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
    if (bsCollapse) bsCollapse.hide();
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  });
  navCollapse.addEventListener('hidden.bs.collapse', () => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  });
  // Close on nav link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
      if (bsCollapse && window.innerWidth < 992) { bsCollapse.hide(); }
    });
  });
}

// === Particles ===
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.6 + 0.1;
      this.color = Math.random() > 0.5 ? '0,212,255' : '0,255,136';
    }
    update() {
      this.x += this.speedX; this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
      ctx.fill();
    }
  }

  const count = Math.min(120, Math.floor(canvas.width * canvas.height / 8000));
  for (let i = 0; i < count; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    // Draw connections
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,212,255,${0.1 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });
    });
    requestAnimationFrame(animate);
  }
  animate();
}
initParticles();

// === Counter Animation ===
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const suffix = el.getAttribute('data-suffix') || '';
  const prefix = el.getAttribute('data-prefix') || '';
  const duration = 2000;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = prefix + Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// === Scroll Reveal + Counters ===
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// === Progress Bars ===
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target.querySelector('.progress-volt-bar');
      if (bar) bar.style.width = bar.getAttribute('data-width') + '%';
      progressObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.progress-volt').forEach(el => progressObserver.observe(el));

// === FAQ ===
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('active');
      i.querySelector('.faq-answer').style.maxHeight = '0';
    });
    if (!isActive) {
      item.classList.add('active');
      answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
    }
  });
});

// === Testimonials Slider ===
let currentSlide = 0;
function showSlide(n) {
  const slides = document.querySelectorAll('.testimonial-slide');
  if (!slides.length) return;
  slides.forEach(s => s.style.display = 'none');
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].style.display = 'block';
}
function nextSlide() { showSlide(currentSlide + 1); }
function prevSlide() { showSlide(currentSlide - 1); }
if (document.querySelector('.testimonial-slide')) {
  showSlide(0);
  setInterval(nextSlide, 5000);
}
const prevBtn = document.getElementById('prev-slide');
const nextBtn = document.getElementById('next-slide');
if (prevBtn) prevBtn.addEventListener('click', prevSlide);
if (nextBtn) nextBtn.addEventListener('click', nextSlide);

// === Newsletter form ===
document.querySelectorAll('.newsletter-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input');
    const btn = form.querySelector('button');
    if (input && btn && input.value.includes('@')) {
      btn.textContent = '✓ Subscribed!';
      btn.style.background = 'linear-gradient(135deg,var(--secondary),#00cc66)';
      input.value = '';
      setTimeout(() => { btn.textContent = 'Subscribe'; btn.style.background = ''; }, 3000);
    }
  });
});

// === Contact Form ===
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = '✓ Message Sent!';
    btn.style.background = 'linear-gradient(135deg,var(--secondary),#00cc66)';
    setTimeout(() => { btn.textContent = 'Send Message'; btn.style.background = ''; contactForm.reset(); }, 3000);
  });
}

// === Career Form ===
const careerForm = document.getElementById('career-form');
if (careerForm) {
  careerForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = careerForm.querySelector('button[type="submit"]');
    btn.textContent = '✓ Application Submitted!';
    setTimeout(() => { btn.textContent = 'Submit Application'; careerForm.reset(); }, 3000);
  });
}

// === Active nav link ===
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// === Stagger reveal delays ===
document.querySelectorAll('.stagger-children > *').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.1}s`;
  el.classList.add('reveal');
  revealObserver.observe(el);
});

console.log('%cVoltEdge EV Components', 'color:#00d4ff;font-family:monospace;font-size:20px;font-weight:bold');
console.log('%cPowering the Electric Future of India 🔋⚡', 'color:#00ff88;font-family:monospace;font-size:12px');
