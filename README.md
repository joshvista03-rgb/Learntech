# Create LearnTech website files and zip them for the user to download
import os, zipfile, textwrap, json, pathlib

base = "/mnt/data/learntech-site"
os.makedirs(base, exist_ok=True)

index_html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LearnTech</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <!-- Login Screen -->
  <div id="login" class="login-screen">
    <div class="login-box">
      <h1>LearnTech</h1>
      <p class="muted">Log in to access your learning space.</p>

      <label for="username">Username</label>
      <input id="username" type="text" autocomplete="username" placeholder="e.g., admin" />

      <label for="password">Password</label>
      <input id="password" type="password" autocomplete="current-password" placeholder="e.g., 1234" />

      <button id="loginBtn">Login</button>
      <p id="loginError" class="error"></p>

      <details class="hint">
        <summary>Show demo credentials</summary>
        <code>Username: admin</code><br />
        <code>Password: 1234</code>
      </details>
    </div>
  </div>

  <!-- App -->
  <div id="app" class="app hidden">
    <header class="site-header">
      <div class="brand">
        <span class="logo">LT</span>
        <h2>LearnTech</h2>
      </div>
      <nav class="nav">
        <a href="#features">Features</a>
        <a href="#progress">Progress</a>
        <a href="#quiz">Quiz</a>
        <a href="#contact">Contact</a>
        <button id="logoutBtn" class="outline">Logout</button>
      </nav>
    </header>

    <main>
      <section class="hero" id="home">
        <h1>Engage. Learn. Achieve.</h1>
        <p>Your interactive platform for smarter learning.</p>
        <a href="#features" class="cta">Explore Features</a>
      </section>

      <section class="cards" id="features">
        <article class="card">
          <h3>Interactive Lessons</h3>
          <p>Engage with activities and materials designed for focus and fun.</p>
        </article>
        <article class="card">
          <h3>Progress Tracking</h3>
          <p>See your learning journey at a glance with visual progress.</p>
        </article>
        <article class="card">
          <h3>Rewards System</h3>
          <p>Earn points and badges as you complete tasks and quizzes.</p>
        </article>
      </section>

      <section class="progress" id="progress">
        <h2>Your Progress</h2>
        <div class="progress-bar" aria-label="Course progress">
          <div id="progressFill" class="progress-fill" style="width:0%"></div>
        </div>
        <button id="completeLessonBtn">Complete Lesson (+20%)</button>
      </section>

      <section class="rewards" id="rewards">
        <h2>Your Rewards</h2>
        <p id="rewardPoints" class="points">Points: 0</p>
        <button id="earnPointsBtn">Earn Points (+10)</button>
      </section>

      <section class="quiz" id="quiz">
        <h2>Quick Quiz</h2>
        <p>What does HTML stand for?</p>
        <div class="choices">
          <button class="choice" data-choice="a">a) Hyper Text Markup Language</button>
          <button class="choice" data-choice="b">b) Home Tool Markup Language</button>
          <button class="choice" data-choice="c">c) Hyperlinks and Text Management Language</button>
        </div>
        <p id="quizResult" class="quiz-result"></p>
      </section>
    </main>

    <footer id="contact" class="site-footer">
      <p>Contact us: <a href="mailto:learntech@email.com">learntech@email.com</a></p>
      <p>© 2025 LearnTech. All rights reserved.</p>
    </footer>
  </div>

  <script src="script.js" defer></script>
</body>
</html>
"""

style_css = """/* Simple, clean styling */
:root{
  --bg: #f6f8fc;
  --text: #1f2937;
  --primary: #2563eb;
  --primary-dark: #1e40af;
  --muted: #6b7280;
  --card: #ffffff;
  --shadow: 0 8px 20px rgba(0,0,0,.08);
  --radius: 14px;
}

*{ box-sizing: border-box; }
html, body { height: 100%; }
body{
  margin: 0;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.5;
}

.hidden{ display: none !important; }

/* Header */
.site-header{
  display:flex; align-items:center; justify-content:space-between;
  padding: 16px 24px;
  background: var(--primary);
  color: #fff;
  position: sticky; top: 0; z-index: 10;
}
.brand{ display:flex; align-items:center; gap:10px; }
.logo{
  display:inline-grid; place-items:center;
  width:36px; height:36px; border-radius:12px;
  background:#fff; color:var(--primary); font-weight:700;
  box-shadow: var(--shadow);
}
.nav{ display:flex; gap:12px; align-items:center; flex-wrap: wrap; }
.nav a{
  color:#fff; text-decoration:none; font-weight:600; padding:6px 10px; border-radius:8px;
}
.nav a:hover{ background: rgba(255,255,255,.15); }
button{
  padding:10px 14px; border:none; border-radius:10px;
  background:#fff; color:var(--primary); font-weight:700; cursor:pointer;
  box-shadow: var(--shadow);
}
button:hover{ filter: brightness(0.97); }
button.outline{
  background: transparent; color: #fff; border: 2px solid #fff; box-shadow: none;
}
button.outline:hover{ background: rgba(255,255,255,.15); }

/* Hero */
.hero{
  text-align:center; padding: 64px 20px;
  background: linear-gradient(120deg, var(--primary), var(--primary-dark));
  color:#fff;
}
.hero h1{ font-size: clamp(28px, 4vw, 44px); margin:0 0 6px; }
.hero p{ opacity:.95; margin:0 0 18px; }
.cta{
  display:inline-block; background:#fff; color:var(--primary);
  padding:12px 18px; border-radius:12px; font-weight:800; text-decoration:none;
}

/* Cards */
.cards{
  display:grid; gap:16px; padding: 28px 20px; max-width: 1100px; margin: 0 auto;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}
.card{
  background: var(--card); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow);
}

/* Progress */
.progress{ padding: 28px 20px; text-align:center; }
.progress-bar{
  width:min(720px, 90%); height:22px; background:#e5e7eb; border-radius:999px; margin: 10px auto 14px; overflow:hidden;
}
.progress-fill{
  height:100%; width:0%; background: #fff; background: #2563eb;
  transition: width .4s ease;
}

/* Rewards */
.rewards{ padding: 28px 20px; text-align:center; }
.points{ font-size: 22px; font-weight: 800; color: var(--primary); }

/* Quiz */
.quiz{ padding: 28px 20px; text-align:center; }
.choices{ display:flex; gap:10px; flex-wrap:wrap; justify-content:center; }
.choice{ background: var(--card); }
.quiz-result{ font-weight:700; margin-top:8px; }

/* Footer */
.site-footer{
  text-align:center; padding: 18px; background:#111827; color:#e5e7eb; margin-top: 40px;
}
.site-footer a{ color:#c7d2fe; }

/* Login Screen */
.login-screen{
  min-height: 100vh; display:grid; place-items:center;
  background: linear-gradient(120deg, var(--primary), var(--primary-dark));
  padding: 20px;
}
.login-box{
  width:100%; max-width:360px; background:#fff; border-radius: var(--radius);
  box-shadow: var(--shadow); padding: 22px; display:flex; flex-direction:column; gap:10px;
}
.login-box h1{ margin:0 0 4px; }
.login-box label{ font-size: 14px; color: var(--muted); }
.login-box input{
  width:100%; padding:12px; border:1px solid #e5e7eb; border-radius:10px;
}
.login-box .error{ color:#b91c1c; min-height: 20px; }
.login-box .hint{ color: var(--muted); }
"""

script_js = """// Basic client-side app with localStorage persistence
const APP_KEYS = {
  CURRENT_USER: 'learntech-currentUser',
  userKey: (user, key) => `learntech:${user}:${key}`
};

let state = {
  user: null,
  progress: 0,
  points: 0
};

// DOM
const loginScreen = document.getElementById('login');
const app = document.getElementById('app');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

const usernameEl = document.getElementById('username');
const passwordEl = document.getElementById('password');
const loginError = document.getElementById('loginError');

const progressFill = document.getElementById('progressFill');
const completeLessonBtn = document.getElementById('completeLessonBtn');
const rewardPoints = document.getElementById('rewardPoints');
const earnPointsBtn = document.getElementById('earnPointsBtn');
const quizResult = document.getElementById('quizResult');

// Restore session on load
document.addEventListener('DOMContentLoaded', () => {
  const u = localStorage.getItem(APP_KEYS.CURRENT_USER);
  if (u) {
    state.user = u;
    loadUserState();
    showApp();
  } else {
    showLogin();
  }
});

// Login (demo: admin/1234)
loginBtn.addEventListener('click', () => {
  const user = usernameEl.value.trim();
  const pass = passwordEl.value;

  if (!user || !pass) {
    loginError.textContent = 'Please enter username and password.';
    return;
  }

  if (user === 'admin' && pass === '1234') {
    state.user = user;
    localStorage.setItem(APP_KEYS.CURRENT_USER, user);
    loadUserState();
    showApp();
  } else {
    loginError.textContent = 'Invalid username or password.';
  }
});

// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem(APP_KEYS.CURRENT_USER);
  state.user = null;
  showLogin();
});

// Progress & Rewards
completeLessonBtn.addEventListener('click', () => {
  if (state.progress < 100) {
    state.progress = Math.min(100, state.progress + 20);
    updateProgressUI();
    persist('progress', state.progress);
  }
});

earnPointsBtn.addEventListener('click', () => {
  state.points += 10;
  updatePointsUI();
  persist('points', state.points);
});

// Quiz
document.querySelectorAll('.choice').forEach(btn => {
  btn.addEventListener('click', () => {
    const choice = btn.dataset.choice;
    if (choice === 'a') {
      quizResult.textContent = '✅ Correct! HTML means Hyper Text Markup Language.';
      state.points += 10;
      updatePointsUI();
      persist('points', state.points);
    } else {
      quizResult.textContent = '❌ Wrong! Try again.';
    }
  });
});

// Helpers
function showApp(){
  loginScreen.classList.add('hidden');
  app.classList.remove('hidden');
  updateProgressUI();
  updatePointsUI();
}
function showLogin(){
  app.classList.add('hidden');
  loginScreen.classList.remove('hidden');
  usernameEl.value = '';
  passwordEl.value = '';
  loginError.textContent = '';
}

function updateProgressUI(){
  progressFill.style.width = `${state.progress}%`;
}
function updatePointsUI(){
  rewardPoints.textContent = `Points: ${state.points}`;
}

function persist(key, value){
  if (!state.user) return;
  localStorage.setItem(APP_KEYS.userKey(state.user, key), JSON.stringify(value));
}
function loadUserState(){
  const p = JSON.parse(localStorage.getItem(APP_KEYS.userKey(state.user, 'points')) || '0');
  const g = JSON.parse(localStorage.getItem(APP_KEYS.userKey(state.user, 'progress')) || '0');
  state.points = Number.isFinite(p) ? p : 0;
  state.progress = Number.isFinite(g) ? g : 0;
}
"""

readme_md = """# LearnTech (Static Demo)

A simple static demo of a learning site with:
- Login/Logout (client-side demo only)
- Progress bar (+20% per lesson)
- Rewards system (+10 points)
- One-question quiz (adds points when correct)
- Persistence using `localStorage` per user

> **Note:** This is a front-end only demo (no real database). The login is hardcoded: `admin / 1234`.

## Quick Start (GitHub Pages)
1. Create a new repo (e.g., `learntech-site`) on GitHub.
2. Upload `index.html`, `style.css`, `script.js` (or upload the ZIP and extract in the repo).
3. Commit to the `main` branch.
4. Go to **Settings → Pages**.
   - **Source:** Deploy from a branch
   - **Branch:** `main` / `/root`
5. Your site will be published at `https://<your-username>.github.io/learntech-site/`.

## Local Testing
Just open `index.html` in your browser.
"""

# Write files
with open(os.path.join(base, "index.html"), "w", encoding="utf-8") as f:
    f.write(index_html)
with open(os.path.join(base, "style.css"), "w", encoding="utf-8") as f:
    f.write(style_css)
with open(os.path.join(base, "script.js"), "w", encoding="utf-8") as f:
    f.write(script_js)
with open(os.path.join(base, "README.md"), "w", encoding="utf-8") as f:
    f.write(readme_md)

# Zip them
zip_path = "/mnt/data/learntech-site.zip"
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
    for filename in ["index.html", "style.css", "script.js", "README.md"]:
        z.write(os.path.join(base, filename), arcname=filename)

zip_path
