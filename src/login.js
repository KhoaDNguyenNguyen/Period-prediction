(function () {
  const qs = new URLSearchParams(window.location.search);
  const jwt = qs.get('token');
  if (jwt) {
    localStorage.setItem('token', jwt);
    localStorage.setItem('loggedIn', 'true');
    window.history.replaceState({}, document.title, '/'); //delete token from URL
    window.location.href = './survey.html'; // direct to survey page
    return;
  }
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const showMsg = (el, text, color = 'red') => {
    if (!el) return;
    el.textContent = text;
    el.style.color = color;
  };

  async function postJSON(url, payload) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch (_) {
      //body is not JSON, maybe HTML or plain text or empty, I think it's fine or not
    }

    if (!res.ok) {
      const msg = data.error || data.message || res.statusText;
      throw new Error(msg);
    }
    return data;
  }

  /* ---------------------------------------------------------------------------
   *  Detect API Base URL
   * -------------------------------------------------------------------------*/
  const DEV_HOSTS = ['localhost', '127.0.0.1'];
  const API_BASE = DEV_HOSTS.includes(window.location.hostname)
    ? 'http://localhost:3000/api'
    : `${window.location.origin}/api`;

  /* ---------------------------------------------------------------------------
   *  DOMContentLoaded logic
   * -------------------------------------------------------------------------*/
  document.addEventListener('DOMContentLoaded', () => {
    // Toggle between login and register panels
    const container = $('.container');
    const registerBtn = $('.register-btn');
    const loginBtn = $('.login-btn');

    if (container && registerBtn && loginBtn) {
      registerBtn.addEventListener('click', () => container.classList.add('active'));
      loginBtn.addEventListener('click', () => container.classList.remove('active'));
    }

   // Toggle password visibility
    $$('.toggle-eye').forEach((toggle) => {
      const form = toggle.closest('form');
      const pwdInput = form?.querySelector('input[type="password"]');
      if (!pwdInput) return;
      toggle.addEventListener('click', () => {
        pwdInput.type = pwdInput.type === 'password' ? 'text' : 'password';
      });
    });

    //register and login forms
    const registerForm = $('#registerForm');
    const regMsg = $('#regMessage');
    registerForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = $('#regUsername').value.trim();
      const email = $('#regEmail').value.trim();
      const password = $('#regPassword').value;

      if (!username || !email || !password) {
        return showMsg(regMsg, 'Vui lòng điền đầy đủ thông tin.');
      }

      try {
        await postJSON(`${API_BASE}/register`, {username, email, password});
        showMsg(regMsg, 'Đăng ký thành công! Vui lòng đăng nhập.', 'green');
        // move to login panel
        loginBtn?.click();
        ``;
      } catch (err) {
        showMsg(regMsg, err.message || 'Đăng ký thất bại');
      }
    });

    const loginForm = $('#loginForm');
    const loginMsg = $('#loginMessage');
    loginForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = $('#loginEmail').value.trim();
      const password = $('#loginPassword').value;

      if (!email || !password) {
        return showMsg(loginMsg, 'Vui lòng điền đầy đủ thông tin.');
      }

      try {
        const data = await postJSON(`${API_BASE}/login`, {email, password});
        if (!data.token) throw new Error('Token không hợp lệ');
        localStorage.setItem('token', data.token);
        localStorage.setItem('loggedIn', 'true'); // flag for logged in state
        window.location.replace('survey.html');
      } catch (err) {
        showMsg(loginMsg, err.message || 'Đăng nhập thất bại');
      }
    });
  });
})();
