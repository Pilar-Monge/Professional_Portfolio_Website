
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1500);
});


const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

let mouseX = -100, mouseY = -100;
let ringX  = -100, ringY  = -100;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});


function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();


document.querySelectorAll('a, button, [data-scroll], .card, .filter-btn, .project-link').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});


const canvas = document.getElementById('particle-canvas');
const ctx    = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createParticles() {
  particles = [];
  const count = Math.floor(window.innerWidth / 18);
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.4 + 0.1
    });
  }
}
createParticles();
window.addEventListener('resize', createParticles);

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,255,0,${p.alpha})`;
    ctx.fill();
  });


  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 90) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,255,0,${0.06 * (1 - dist / 90)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

const phrases = [
  'Software Engineer',
  'Backend Developer',
  'Full Stack Developer',
  'Problem Solver',
  'Clean Code Advocate',
  'πlar — always 3.14159...',
];
let phraseIdx = 0, charIdx = 0, isDeleting = false;
const typingEl = document.getElementById('typing-text');

function typeEffect() {
  const current = phrases[phraseIdx];
  if (isDeleting) {
    typingEl.textContent = current.substring(0, --charIdx);
  } else {
    typingEl.textContent = current.substring(0, ++charIdx);
  }

  let delay = isDeleting ? 55 : 90;

  if (!isDeleting && charIdx === current.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    delay = 400;
  }
  setTimeout(typeEffect, delay);
}
typeEffect();


const body = document.body;

function getTheme() { return localStorage.getItem('theme') || 'dark'; }

function applyTheme(theme) {
  body.classList.toggle('light', theme === 'light');
  [['icon-moon','icon-sun'],['icon-moon-m','icon-sun-m']].forEach(([m,s]) => {
    const moon = document.getElementById(m);
    const sun  = document.getElementById(s);
    if (!moon || !sun) return;
    moon.style.display = theme === 'light' ? 'none'  : 'block';
    sun.style.display  = theme === 'light' ? 'block' : 'none';
  });
}

function toggleTheme() {
  const next = getTheme() === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', next);
  applyTheme(next);
}

applyTheme(getTheme());
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
const mtBtn = document.getElementById('theme-toggle-mobile');
if (mtBtn) mtBtn.addEventListener('click', toggleTheme);


function handleResponsive() {
  const mobile = window.innerWidth <= 768;
  const desktopLinks   = document.querySelector('.nav-links');
  const mobileControls = document.getElementById('mobile-controls');
  if (desktopLinks)   desktopLinks.style.display   = mobile ? 'none' : 'flex';
  if (mobileControls) mobileControls.style.display = mobile ? 'flex' : 'none';
}
handleResponsive();
window.addEventListener('resize', handleResponsive);


const progressBar = document.getElementById('scroll-progress');
function updateProgress() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
}


const navbar = document.getElementById('navbar');
function updateNavbar() {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}


const floatingTop = document.getElementById('floating-top');
function updateFloating() {
  floatingTop.classList.toggle('show', window.scrollY > 500);
}
floatingTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


window.addEventListener('scroll', () => {
  updateProgress();
  updateNavbar();
  updateFloating();
  animateSkillBars();
  animateCounters();
}, { passive: true });

updateProgress(); updateNavbar(); updateFloating();


function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
}

document.querySelectorAll('[data-scroll]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    scrollToSection(link.getAttribute('data-scroll'));
    closeMobileMenu();
  });
});


const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

function closeMobileMenu() {
  mobileNav.classList.remove('open');
  hamburger.classList.remove('open');
  body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  const open = mobileNav.classList.contains('open');
  if (open) { closeMobileMenu(); }
  else {
    mobileNav.classList.add('open');
    hamburger.classList.add('open');
    body.style.overflow = 'hidden';
  }
});


const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


let skillsDone = false;
const skillsSection = document.getElementById('skills');

function animateSkillBars() {
  if (skillsDone || !skillsSection) return;
  if (skillsSection.getBoundingClientRect().top < window.innerHeight * 0.85) {
    skillsDone = true;
    document.querySelectorAll('.skill-bar-fill').forEach((bar, i) => {
      setTimeout(() => { bar.style.width = bar.getAttribute('data-width') + '%'; }, 100 + i * 40);
    });
  }
}
animateSkillBars();


let countersDone = false;
const countersSection = document.getElementById('counters');

function animateCounters() {
  if (countersDone || !countersSection) return;
  if (countersSection.getBoundingClientRect().top < window.innerHeight * 0.9) {
    countersDone = true;
    document.querySelectorAll('.counter-number').forEach(el => {
      const target = parseInt(el.getAttribute('data-target'));
      const suffix = el.getAttribute('data-suffix') || '';
      let current = 0;
      const step  = Math.ceil(target / 40);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + suffix;
        if (current >= target) clearInterval(timer);
      }, 40);
    });
  }
}
animateCounters();

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');

 
    const grid = document.getElementById('projects-grid');
    grid.style.position = 'relative';

    document.querySelectorAll('.project-card').forEach(card => {
      const cats = card.getAttribute('data-category') || '';
      if (filter === 'all' || cats.includes(filter)) {
        card.classList.remove('hidden');
        card.style.position = '';
        card.style.visibility = '';
      } else {
        card.classList.add('hidden');
      }
    });

  
    setTimeout(() => {
      document.querySelectorAll('.project-card.hidden').forEach(card => {
        card.style.display = 'none';
      });
      document.querySelectorAll('.project-card:not(.hidden)').forEach(card => {
        card.style.display = '';
      });
    }, 350);
  });
});


const projectData = [
  {
    title: 'Task Management System',
    img: 'https://images.unsplash.com/photo-1692607431186-e8d7837ad65b?w=800&q=80',
    tech: 'Node.js · Express · PostgreSQL · React · REST API',
    desc: 'A comprehensive web application for managing internal tasks and team workflows. Features include task assignment, priority levels, deadlines, and real-time status updates. Built with Node.js backend and SQL database for efficient data management. The system supports role-based access control, email notifications, and a full audit trail.',
    tags: ['Node.js', 'Express', 'PostgreSQL', 'React', 'REST API'],
    github: 'https://github.com/Pilar-Monge'
  },
  {
    title: 'Cloud Inventory System',
    img: 'https://images.unsplash.com/photo-1636352656650-4baea3fd60e4?w=800&q=80',
    tech: 'Node.js · MongoDB · AWS · Docker · CI/CD',
    desc: 'Scalable inventory management system deployed on cloud infrastructure. Enables real-time inventory tracking, automated stock alerts, and comprehensive reporting. Leverages AWS services (S3, EC2, RDS) for high availability and performance. Containerized with Docker and deployed via automated CI/CD pipelines.',
    tags: ['Node.js', 'MongoDB', 'AWS', 'Docker', 'CI/CD'],
    github: 'https://github.com/Pilar-Monge'
  },
  {
    title: 'Data Analytics Dashboard',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    tech: 'React · Python · PostgreSQL · Chart.js · REST API',
    desc: 'Interactive dashboard for analyzing business data and generating actionable insights. Features dynamic charts (bar, line, pie, scatter), customizable date ranges, and export to PDF/Excel. Python backend handles heavy data processing and statistical analysis, while a React frontend delivers a smooth UX.',
    tags: ['React', 'Python', 'PostgreSQL', 'Chart.js', 'REST API'],
    github: 'https://github.com/Pilar-Monge'
  },
  {
    title: 'Expense Tracking Platform',
    img: 'https://images.unsplash.com/photo-1764231467896-73f0ef4438aa?w=800&q=80',
    tech: 'Node.js · React · MongoDB · JWT · Azure',
    desc: 'Full-stack application for tracking personal and business expenses. Includes budget management, expense categorization, receipt photo uploads, and financial reporting. Secure authentication with JWT, role-based access for teams, and deployed on Azure with auto-scaling.',
    tags: ['Node.js', 'React', 'MongoDB', 'JWT', 'Azure'],
    github: 'https://github.com/Pilar-Monge'
  },
  {
    title: 'Employee Management System',
    img: 'https://images.unsplash.com/photo-1620221905485-86b2e9e1b594?w=800&q=80',
    tech: 'Java · Spring Boot · MySQL · React · REST API',
    desc: 'Comprehensive HR management platform for tracking employee information, attendance, performance reviews, and payroll processing. Features secure data handling, automated email notifications for reviews, and detailed analytics reports. Built with Java/Spring Boot for robust backend performance.',
    tags: ['Java', 'Spring Boot', 'MySQL', 'React', 'REST API'],
    github: 'https://github.com/Pilar-Monge'
  },
  {
    title: 'REST API for Business Operations',
    img: 'https://images.unsplash.com/photo-1564865878688-9a244444042a?w=800&q=80',
    tech: 'Node.js · Express · PostgreSQL · JWT · Swagger',
    desc: 'Robust and scalable RESTful API designed for business operations and third-party integration. Implements JWT authentication, API key management, rate limiting, comprehensive error handling, and full Swagger/OpenAPI documentation. Optimized for high throughput with Redis caching and connection pooling.',
    tags: ['Node.js', 'Express', 'PostgreSQL', 'JWT', 'Swagger'],
    github: 'https://github.com/Pilar-Monge'
  }
];

const modal = document.getElementById('project-modal');

function openModal(idx) {
  const p = projectData[idx];
  document.getElementById('modal-img').src   = p.img;
  document.getElementById('modal-img').alt   = p.title;
  document.getElementById('modal-title').textContent = p.title;
  document.getElementById('modal-tech').textContent  = p.tech;
  document.getElementById('modal-desc').textContent  = p.desc;
  document.getElementById('modal-github').href       = p.github;
  const tagsEl = document.getElementById('modal-tags');
  tagsEl.innerHTML = p.tags.map(t => `<span class="tag">${t}</span>`).join('');
  modal.classList.add('open');
  body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});


function handleFormSubmit(e) {
  e.preventDefault();
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

  form.style.opacity = '0.5';
  form.style.pointerEvents = 'none';
  setTimeout(() => {
    form.style.display   = 'none';
    success.classList.add('show');
  }, 800);
}

function handleDownloadCV() {
  alert('Conecta tu archivo CV aquí — reemplaza esta función en js/main.js con:\nwindow.open("assets/cv.pdf", "_blank")');
}

const contactTopBtn = document.getElementById('contact-top-btn');
if (contactTopBtn) {
  contactTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}