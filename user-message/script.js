const tg = window.Telegram.WebApp;
tg.expand();

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("userId") || null;
const username = urlParams.get("username") || null;

document.getElementById('sendBtn').addEventListener('click', () => {
  const message = document.getElementById("message").value.trim();
  const anonymous = document.getElementById("anonSwitch")?.checked ?? false;

  if (!message) {
    alert("Введіть повідомлення.");
    return;
  }

  fetch('http://localhost:8000/send-feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ anonymous, message, userId, username})
  })
    .then(res => res.json())
    .then(data => {
      tg.close();
    })
    .catch(err => {
      alert("Помилка при надсиланні.");
      console.error(err);
    });
});