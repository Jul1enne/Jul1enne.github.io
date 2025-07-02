// script.js
const tg = window.Telegram.WebApp;
tg.expand();

function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.form').forEach(el => el.style.display = 'none');
    document.querySelector('.tab[onclick*="' + tab + '"]').classList.add('active');
    document.getElementById(tab).style.display = 'flex';
}

function sendEpisode() {
    const data = {
        type: 'episode',
        user_id: tg.initDataUnsafe?.user?.id,
        name: document.getElementById('anime_list')?.textContent,
        episode: document.getElementById('episode_num').value,
        episode_title: document.getElementById('episode_title').value,
        voiced_by: document.getElementById('voiced_by').value,
        description: document.getElementById('description').value,
        include_sound: document.getElementById('include_sound')?.checked ?? false
    };
    fetch("http://localhost:8000/submit_episode", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(response => {
        //alert("Успішно відправлено!");
        tg.close(); // Закрити WebApp
    })
    .catch(error => {
        alert("Помилка при надсиланні!");
        console.error(error);
    });
}

fetch("http://localhost:8000/anime")
    .then(res => res.json())
    .then(animeList => {
      animeList.forEach(anime => {
        const option = document.createElement("option");
        option.value = anime.tag;
        option.textContent = anime.name;
        document.getElementById("anime_list").appendChild(option);
      });
    });
