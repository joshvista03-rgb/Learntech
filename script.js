// Basic client-side app with localStorage persistence
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
