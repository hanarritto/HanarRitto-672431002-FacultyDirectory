// ===============================
// Shared Auth / User Helpers
// ===============================
window.getCurrentUser = function () {
  try {
    return JSON.parse(localStorage.getItem('currentUser'));
  } catch {
    return null;
  }
};

window.requireLogin = function () {
  const user = getCurrentUser();
  if (!user) {
    window.location.replace('login.html');
    return null;
  }
  return user;
};

window.logout = function () {
  localStorage.removeItem('currentUser');
  window.location.replace('login.html');
};

document.addEventListener('DOMContentLoaded', () => {
  const greeting = document.getElementById('userGreeting');
  if (greeting) {
    const user = getCurrentUser();
    if (user) {
      greeting.textContent = `Welcome ${user.name} | สวัสดีคุณ ${user.name}`;
    }
  }
});
