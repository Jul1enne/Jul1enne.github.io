const tg = window.Telegram.WebApp;
tg.expand();

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
    body: JSON.stringify({ anonymous, message })
  })
    .then(res => res.json())
    .then(data => {
      alert("Повідомлення надіслано!");
      tg.close();
    })
    .catch(err => {
      alert("Помилка при надсиланні.");
      console.error(err);
    });
});