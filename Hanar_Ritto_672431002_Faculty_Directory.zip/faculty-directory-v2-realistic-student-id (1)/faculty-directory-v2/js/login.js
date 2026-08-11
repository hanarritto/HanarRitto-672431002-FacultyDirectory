// ===============================
// Login + 3 attempts / 10 minute lock
// ===============================
const MAX_ATTEMPTS = 3;
const LOCK_MS = 10 * 60 * 1000;

const form = document.getElementById('loginForm');
const studentIdInput = document.getElementById('studentId');
const passwordInput = document.getElementById('password');
const messageBox = document.getElementById('loginMessage');
const countdownBox = document.getElementById('lockCountdown');
const loginButton = document.getElementById('loginButton');
const togglePassword = document.getElementById('togglePassword');

let countdownTimer = null;

function getAuthState(id) {
  try {
    return JSON.parse(localStorage.getItem(`authState:${id}`)) || { attempts: 0, lockedUntil: 0 };
  } catch {
    return { attempts: 0, lockedUntil: 0 };
  }
}

function setAuthState(id, state) {
  localStorage.setItem(`authState:${id}`, JSON.stringify(state));
}

function formatRemaining(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const min = String(Math.floor(total / 60)).padStart(2, '0');
  const sec = String(total % 60).padStart(2, '0');
  return `${min}:${sec}`;
}

function startCountdown(id, lockedUntil) {
  clearInterval(countdownTimer);

  const tick = () => {
    const remaining = lockedUntil - Date.now();

    if (remaining <= 0) {
      clearInterval(countdownTimer);
      setAuthState(id, { attempts: 0, lockedUntil: 0 });
      countdownBox.classList.add('d-none');
      loginButton.disabled = false;
      messageBox.innerHTML = `
        <div class="alert alert-success mb-0">
          Account unlocked. You can try again. | ปลดล็อกบัญชีแล้ว สามารถลองเข้าสู่ระบบได้อีกครั้ง
        </div>`;
      return;
    }

    loginButton.disabled = true;
    countdownBox.classList.remove('d-none');
    countdownBox.innerHTML = `
      <div class="lock-card">
        <div class="fw-bold">Account Locked | บัญชีถูกล็อก</div>
        <div class="countdown-time">${formatRemaining(remaining)}</div>
        <div class="small">Please wait before trying again. | กรุณารอก่อนลองใหม่</div>
      </div>`;
  };

  tick();
  countdownTimer = setInterval(tick, 1000);
}

function checkCurrentLock() {
  const id = studentIdInput.value.trim();
  if (!id) return;
  const state = getAuthState(id);
  if (state.lockedUntil > Date.now()) startCountdown(id, state.lockedUntil);
}

studentIdInput.addEventListener('input', () => {
  clearInterval(countdownTimer);
  countdownBox.classList.add('d-none');
  loginButton.disabled = false;
  checkCurrentLock();
});

togglePassword.addEventListener('click', () => {
  const show = passwordInput.type === 'password';
  passwordInput.type = show ? 'text' : 'password';
  togglePassword.innerHTML = `<i class="bi ${show ? 'bi-eye-slash' : 'bi-eye'}"></i>`;
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const id = studentIdInput.value.trim();
  const password = passwordInput.value;
  const state = getAuthState(id);
  const now = Date.now();

  if (state.lockedUntil > now) {
    startCountdown(id, state.lockedUntil);
    return;
  }

  const parsed = parseStudentId(id);

  if (!parsed.valid) {
    messageBox.innerHTML = `
      <div class="alert alert-danger mb-0">
        ${parsed.reason}
      </div>`;
    return;
  }

  const student = getStudentById(id);
  const valid = student && student.password === password;

  if (valid) {
    setAuthState(id, { attempts: 0, lockedUntil: 0 });
    localStorage.setItem('currentUser', JSON.stringify({
      id: student.id,
      name: student.name
    }));
    window.location.href = 'welcome.html';
    return;
  }

  const attempts = (state.attempts || 0) + 1;

  if (attempts >= MAX_ATTEMPTS) {
    const lockedUntil = now + LOCK_MS;
    setAuthState(id, { attempts: 0, lockedUntil });
    messageBox.innerHTML = `
      <div class="alert alert-danger mb-0">
        Too many failed attempts. | กรอกรหัสผิดครบ 3 ครั้ง
      </div>`;
    startCountdown(id, lockedUntil);
    return;
  }

  setAuthState(id, { attempts, lockedUntil: 0 });
  const remaining = MAX_ATTEMPTS - attempts;
  messageBox.innerHTML = `
    <div class="alert alert-danger mb-0">
      Invalid Student ID or Password. ${remaining} attempt(s) remaining.
      | รหัสนักศึกษาหรือรหัสผ่านไม่ถูกต้อง เหลืออีก ${remaining} ครั้ง
    </div>`;
});

document.addEventListener('DOMContentLoaded', checkCurrentLock);
