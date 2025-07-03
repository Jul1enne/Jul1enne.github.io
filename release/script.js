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
    const voicers = Array.from(document.querySelectorAll('input[name="voicers"]:checked')).map(cb => cb.value);
    
    const data = {
        type: 'episode',
        user_id: tg.initDataUnsafe?.user?.id,
        name: document.getElementById('anime_list')?.value,
        season: document.getElementById('season_list').value,
        episode: document.getElementById('episode_num').value,
        episode_title: document.getElementById('episode_title').value,
        voiced_by: voicers,
        description: document.getElementById('description').value,
        include_sound: document.getElementById('include_sound_switch')?.checked ?? false
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
        if (response.status === "anime exist") {
            alert("Це аніме вже існує!");
            return;
        }

        if (response.status === "anime added") {
            alert("Успішно надіслано!");
            tg.close();
            return;
        }

        // Будь-який інший статус
        alert("Щось пішло не так!");
        })
        .catch(error => {
            alert("Помилка при надсиланні!");
            console.error(error);
    });
}

fetch("http://localhost:8000/voicers")
  .then(res => res.json())
  .then(voicers => {
    const voicedContainer = document.getElementById("voiced_by_container");

    voicers.forEach(voicer => {
        const name = typeof voicer === "string" ? voicer : voicer.name; // на випадок, якщо це обʼєкт

        const wrapper = document.createElement("div");
        wrapper.className = "switch-wrapper";
        wrapper.innerHTML = `
            <label class="switch-label">
                <label class="switch">
                    <input type="checkbox" name="voicers" value="${name}">
                    <span class="slider"></span>
                </label>
                ${name}
            </label>
    `;
    voicedContainer.appendChild(wrapper);
});
  });

let animeData = [];

fetch("http://localhost:8000/anime")
    .then(res => res.json())
    .then(data => {
        animeData = data;

        const animeSelect = document.getElementById("anime_list");
        data.forEach(anime => {
            const option = document.createElement("option");
            option.value = anime.tag;
            option.textContent = anime.name;
            animeSelect.appendChild(option);
        });

        animeSelect.addEventListener("change", () => {
            const selectedTag = animeSelect.value;
            const selectedAnime = animeData.find(a => a.tag === selectedTag);

            const seasonSelect = document.getElementById("season_list");
            seasonSelect.innerHTML = ""; // Очистити список сезонів

             if (!selectedAnime || !selectedAnime.seasons) return;

            selectedAnime.seasons.forEach(season => {
                const opt = document.createElement("option");
                opt.value = season;
                opt.textContent = `Сезон ${season}`;
                seasonSelect.appendChild(opt);
            });
        });
    });
