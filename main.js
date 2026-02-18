/**
 * main.js — interactivity for cynthiacxzhang.me
 * Typing animation, scroll reveal, active nav tracking, and contact form.
 */

// ---------- typing animation for hero ----------

const TypeWriter = (() => {
  const CHAR_DELAY = 60;
  const START_DELAY = 400;

  function animate(element) {
    const text = element.textContent;
    element.textContent = '';
    element.style.visibility = 'visible';

    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.textContent = '_';
    element.appendChild(cursor);

    setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          element.insertBefore(document.createTextNode(text[i]), cursor);
          i++;
        } else {
          clearInterval(interval);
          // blink cursor then remove
          setTimeout(() => cursor.remove(), 2000);
        }
      }, CHAR_DELAY);
    }, START_DELAY);
  }

  return { animate };
})();


// ---------- scroll reveal ----------

const ScrollReveal = (() => {
  const THRESHOLD = 0.15;

  function init() {
    const sections = document.querySelectorAll('section');
    sections.forEach(s => s.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: THRESHOLD });

    sections.forEach(s => observer.observe(s));
  }

  return { init };
})();


// ---------- active nav link on scroll ----------

const NavHighlight = (() => {
  function init() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav ul a[href^="#"]');

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -60% 0px' });

    sections.forEach(s => observer.observe(s));
  }

  return { init };
})();


// ---------- trivia hover effect ----------

const TriviaInteraction = (() => {
  function init() {
    const items = document.querySelectorAll('.trivia-item');
    items.forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.classList.add('trivia-hover');
      });
      item.addEventListener('mouseleave', () => {
        item.classList.remove('trivia-hover');
      });
    });
  }

  return { init };
})();


// ---------- command palette (easter egg) ----------

const CommandPalette = (() => {
  const COMMANDS = {
    help: () => 'Available commands: help, about, skills, contact, clear, theme',
    about: () => 'Cynthia — ML Software Engineer @ UWaterloo',
    skills: () => 'Python, C++, SQL | PyTorch, TensorFlow, HF | Docker, AWS, Git, Linux',
    contact: () => { scrollToSection('contact'); return 'Scrolling to contact...'; },
    clear: () => { closePalette(); return ''; },
    theme: () => { toggleTheme(); return 'Theme toggled!'; },
  };

  let overlay = null;
  let input = null;
  let output = null;

  function create() {
    overlay = document.createElement('div');
    overlay.className = 'cmd-overlay';
    overlay.innerHTML = `
      <div class="cmd-palette">
        <div class="cmd-header">
          <span class="cmd-title">terminal</span>
          <span class="cmd-close">&times;</span>
        </div>
        <div class="cmd-output"></div>
        <div class="cmd-input-row">
          <span class="cmd-prompt">$</span>
          <input type="text" class="cmd-input" placeholder="type a command..." autofocus>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    input = overlay.querySelector('.cmd-input');
    output = overlay.querySelector('.cmd-output');

    input.addEventListener('keydown', handleInput);
    overlay.querySelector('.cmd-close').addEventListener('click', closePalette);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closePalette();
    });

    printLine('Type "help" for available commands.', 'dim');
    input.focus();
  }

  function handleInput(e) {
    if (e.key !== 'Enter') return;
    const cmd = input.value.trim().toLowerCase();
    input.value = '';

    if (!cmd) return;

    printLine('$ ' + cmd, 'input');

    if (COMMANDS[cmd]) {
      const result = COMMANDS[cmd]();
      if (result) printLine(result, 'result');
    } else {
      printLine(`command not found: ${cmd}`, 'error');
    }

    output.scrollTop = output.scrollHeight;
  }

  function printLine(text, type) {
    const line = document.createElement('p');
    line.className = 'cmd-line cmd-' + type;
    line.textContent = text;
    output.appendChild(line);
  }

  function closePalette() {
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
  }

  function scrollToSection(id) {
    closePalette();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  function toggleTheme() {
    document.body.classList.toggle('dark-mode');
  }

  function init() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+K or Cmd+K to open
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (overlay) {
          closePalette();
        } else {
          create();
        }
      }
      // Escape to close
      if (e.key === 'Escape' && overlay) {
        closePalette();
      }
    });
  }

  return { init };
})();


// ---------- work experiences (Supabase) ----------
// Supabase anon key is designed to be public — safe to commit.
// Replace these after creating your Supabase project.
// Docs: https://supabase.com/docs/guides/api/api-keys

const WorkExperiences = (() => {
  const SUPABASE_URL = 'https://jihajwesrgdflakhkbbg.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppaGFqd2VzcmdkZmxha2hrYmJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNjY1NjAsImV4cCI6MjA4Njk0MjU2MH0.bHPch8P8MPho6_ZxXP9L2Pd4u2cKwqhKCGrCzzp8QaQ';

  function render(container, experiences) {
    if (!experiences.length) {
      container.innerHTML = '<p class="fetch-status">no experiences listed.</p>';
      return;
    }
    container.innerHTML = experiences.map(exp => `
      <div class="exp-item">
        <div class="exp-header">
          <h3>${exp.company}</h3>
          <span class="date">${exp.date_range || ''}</span>
        </div>
        <p class="role">${exp.role}</p>
        <ul>
          ${(exp.bullets || []).map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    `).join('');
  }

  async function init() {
    const container = document.getElementById('work-list');
    if (!container) return;

    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/work_experiences?select=*&order=display_order.asc`,
        {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
        }
      );
      if (!res.ok) throw new Error('fetch failed');
      render(container, await res.json());
    } catch {
      container.innerHTML = '<p class="fetch-status error">// error loading work experiences</p>';
    }
  }

  return { init };
})();


// ---------- blog (Notion via /api/blog) ----------

const Blog = (() => {
  function formatDate(str) {
    if (!str) return '';
    return new Date(str + 'T00:00:00').toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  }

  function tagsHtml(tags) {
    if (!tags.length) return '';
    return `<div class="tags">${tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>`;
  }

  async function renderList() {
    const container = document.getElementById('blog-list');
    if (!container) return;

    try {
      const res = await fetch('/api/blog');
      if (!res.ok) throw new Error('fetch failed');
      const { posts } = await res.json();

      if (!posts.length) {
        container.innerHTML = '<p class="fetch-status">no posts yet.</p>';
        return;
      }

      container.innerHTML = posts.map(p => `
        <div class="blog-card">
          <div class="blog-card-header">
            <a href="blog.html?post=${encodeURIComponent(p.slug)}" class="blog-title">${p.title}</a>
            <span class="date">${formatDate(p.date)}</span>
          </div>
          ${tagsHtml(p.tags)}
        </div>
      `).join('');
    } catch {
      container.innerHTML = '<p class="fetch-status error">// error fetching posts</p>';
    }
  }

  async function renderPost(slug) {
    const listEl = document.getElementById('blog-list');
    const postEl = document.getElementById('blog-post');
    if (!postEl) return;

    if (listEl) listEl.style.display = 'none';
    postEl.style.display = 'block';
    postEl.innerHTML = '<p class="fetch-status">$ fetching post...</p>';

    try {
      const res = await fetch(`/api/blog/${encodeURIComponent(slug)}`);
      if (!res.ok) throw new Error('not found');
      const post = await res.json();

      const md = window.marked ? marked.parse(post.markdown || '') : post.markdown;

      postEl.innerHTML = `
        <a href="blog.html" class="back-link">← back to posts</a>
        <article class="blog-post">
          <h2 class="blog-post-title">${post.title}</h2>
          <div class="blog-post-meta">
            <span class="date">${formatDate(post.date)}</span>
            ${tagsHtml(post.tags)}
          </div>
          <div class="blog-content">${md}</div>
        </article>
      `;
    } catch {
      postEl.innerHTML = `
        <a href="blog.html" class="back-link">← back to posts</a>
        <p class="fetch-status error">// post not found</p>
      `;
    }
  }

  function init() {
    const slug = new URLSearchParams(window.location.search).get('post');
    if (slug) renderPost(slug);
    else renderList();
  }

  return { init };
})();


// ---------- contact form ----------

const ContactForm = (() => {
  function init() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;

      const subject = encodeURIComponent('Hello from ' + name);
      const body = encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message);

      window.location.href = 'mailto:cczhang@uwaterloo.ca?subject=' + subject + '&body=' + body;

      const status = document.getElementById('formStatus');
      if (status) status.textContent = 'Opening your email client...';
      form.reset();
    });
  }

  return { init };
})();


// ---------- init ----------

document.addEventListener('DOMContentLoaded', () => {
  // typing effect on hero tagline
  const tagline = document.querySelector('.hero .tagline');
  if (tagline) {
    tagline.style.visibility = 'hidden';
    TypeWriter.animate(tagline);
  }

  ScrollReveal.init();
  NavHighlight.init();
  TriviaInteraction.init();
  CommandPalette.init();
  ContactForm.init();
  WorkExperiences.init();
  Blog.init();
});
