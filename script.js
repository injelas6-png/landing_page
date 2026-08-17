// =========================================================
// Mobile nav toggle
// =========================================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('is-open');
  navToggle.classList.toggle('is-active');
});

navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('is-open'));
});

// =========================================================
// Scroll reveal animation
// =========================================================
const revealEls = document.querySelectorAll('[data-reveal]');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// =========================================================
// Hero preview: typing indicator resolves into a reply
// =========================================================
const heroBody = document.querySelector('.hero .chat-body');

if (heroBody) {
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          const typing = document.getElementById('heroTyping');
          if (!typing) return;
          const reply = document.createElement('div');
          reply.className = 'bubble bubble-bot';
          reply.style.opacity = '0';
          reply.innerHTML = `
            <span class="bubble-avatar">🤖</span>
            <p>Want me to go deeper on any section, or turn this into action items?</p>
          `;
          typing.replaceWith(reply);
          requestAnimationFrame(() => {
            reply.style.transition = 'opacity 0.4s ease';
            reply.style.opacity = '1';
          });
        }, 1600);
        heroObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  heroObserver.observe(heroBody);
}

// =========================================================
// AI Workspace: interactive demo chat
// =========================================================
const wsBody = document.getElementById('wsBody');
const wsInput = document.getElementById('wsInput');
const wsSend = document.getElementById('wsSend');
const actionBtns = document.querySelectorAll('.ws-action-btn');

const wsAnswers = {
  write: "Here's a draft: \"We're excited to share what we've been building — a faster, smarter way to get things done. Try it today.\" Want a longer version?",
  analyze: "Growth is up 18% quarter-over-quarter, driven mainly by returning users. The one thing to watch: new signups have flattened over the last two weeks.",
  code: "Here's a simple debounce:\n\nfunction debounce(fn, delay) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n}",
  default: "Got it — let me put that together for you. Here's a clear, structured take based on what you asked."
};

function pickAnswer(prompt) {
  const p = prompt.toLowerCase();
  if (p.includes('code') || p.includes('function') || p.includes('debounce')) return wsAnswers.code;
  if (p.includes('analyz') || p.includes('growth') || p.includes('trend')) return wsAnswers.analyze;
  if (p.includes('email') || p.includes('write') || p.includes('announcement')) return wsAnswers.write;
  return wsAnswers.default;
}

function addWsBubble(role, text) {
  const bubble = document.createElement('div');
  bubble.className = role === 'user' ? 'bubble bubble-user' : 'bubble bubble-bot';
  const avatar = role === 'user' ? '👤' : '🤖';
  bubble.innerHTML = `<span class="bubble-avatar">${avatar}</span><p></p>`;
  wsBody.appendChild(bubble);
  wsBody.scrollTop = wsBody.scrollHeight;
  return bubble.querySelector('p');
}

function addWsTyping() {
  const typing = document.createElement('div');
  typing.className = 'typing-indicator';
  typing.innerHTML = `<span class="bubble-avatar">🤖</span><span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
  wsBody.appendChild(typing);
  wsBody.scrollTop = wsBody.scrollHeight;
  return typing;
}

function typeText(el, text, speed = 12) {
  let i = 0;
  return new Promise(resolve => {
    const interval = setInterval(() => {
      el.textContent += text.charAt(i);
      i++;
      wsBody.scrollTop = wsBody.scrollHeight;
      if (i >= text.length) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

async function runWsPrompt(promptText) {
  addWsBubble('user', promptText).textContent = promptText;
  const typing = addWsTyping();
  await new Promise(r => setTimeout(r, 800));
  typing.remove();
  const answerEl = addWsBubble('bot', '');
  await typeText(answerEl, pickAnswer(promptText));
}

actionBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const prompt = btn.dataset.prompt;
    if (prompt) runWsPrompt(prompt);
  });
});

function handleWsSend() {
  const value = wsInput.value.trim();
  if (!value) return;
  wsInput.value = '';
  runWsPrompt(value);
}

wsSend?.addEventListener('click', handleWsSend);
wsInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleWsSend();
});

// =========================================================
// FAQ accordion
// =========================================================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');
    faqItems.forEach(other => other.classList.remove('is-open'));
    if (!isOpen) item.classList.add('is-open');
  });
});
