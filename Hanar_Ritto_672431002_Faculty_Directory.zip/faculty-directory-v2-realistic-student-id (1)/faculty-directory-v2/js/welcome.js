const user = requireLogin();

if (user) {
  const name = document.getElementById('welcomeName');
  if (name) name.textContent = `Welcome ${user.name} | สวัสดีคุณ ${user.name}`;

  setTimeout(() => {
    window.location.replace('index.html');
  }, 3000);
}
