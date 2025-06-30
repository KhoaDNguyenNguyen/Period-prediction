// signupform.js

document.addEventListener('DOMContentLoaded', () => {
  // 1) Toggle Sign up / Login panels
  const container   = document.querySelector('.container');
  const registerBtn = document.querySelector('.register-btn');
  const loginBtn    = document.querySelector('.login-btn');
  if (registerBtn && loginBtn && container) {
    registerBtn.addEventListener('click', () => {
      container.classList.add('active');
    });
    loginBtn.addEventListener('click', () => {
      container.classList.remove('active');
    });
  }

  // 2) Show/hide password icons
  //    (Assuming you add a <span class="toggle-eye">👁️</span> next to each <input type="password">)
  document.querySelectorAll('.toggle-eye').forEach(toggle => {
    const input = toggle.closest('form').querySelector('input[type="password"]');
    if (!input) return;
    toggle.addEventListener('click', () => {
      input.type = input.type === 'password' ? 'text' : 'password';
    });
  });

  // 3) API base URL
  // const API = 'http://localhost:3000/api';
  const API = '/api';


  // 4) Registration
  const registerForm = document.getElementById('registerForm');
  const regMsgEl     = document.getElementById('regMessage');
  if (registerForm && regMsgEl) {
    registerForm.addEventListener('submit', async e => {
      e.preventDefault();
      const username = document.getElementById('regUsername').value.trim();
      const email    = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value;
      try {
        const res = await fetch(`${API}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Đăng ký thất bại');
        regMsgEl.style.color = 'green';
        regMsgEl.textContent = 'Đăng ký thành công! Vui lòng đăng nhập.';
      } catch (err) {
        regMsgEl.style.color = 'red';
        regMsgEl.textContent = err.message;
      }
    });
  }

  // 5) Login
  const loginForm  = document.getElementById('loginForm');
  const loginMsgEl = document.getElementById('loginMessage');
  if (loginForm && loginMsgEl) {
    loginForm.addEventListener('submit', async e => {
      e.preventDefault();
      const email    = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      try {
        const res = await fetch(`${API}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok || !data.token) throw new Error(data.error || 'Đăng nhập thất bại');
        localStorage.setItem('jwt', data.token);
        window.location.href = 'survey.html';
      } catch (err) {
        loginMsgEl.style.color = 'red';
        loginMsgEl.textContent = err.message;
      }
    });
  }
});
