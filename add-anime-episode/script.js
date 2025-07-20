const tg = window.Telegram.WebApp;
tg.expand();

function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.form').forEach(el => el.style.display = 'none');
    document.querySelector(`.tab[onclick*="${tab}"]`).classList.add('active');
    document.getElementById(tab).style.display = 'flex';
}

function collectFormData(prefix, type) {
    const voicers = Array.from(document.querySelectorAll(`input[name="voicers_${prefix}"]:checked`)).map(cb => cb.value);
    const sounds = Array.from(document.querySelectorAll(`input[name="sounds_${prefix}"]:checked`)).map(cb => cb.value);
    const translators = Array.from(document.querySelectorAll(`input[name="translators_${prefix}"]:checked`)).map(cb => cb.value);

    return {
        type,
        user_id: tg.initDataUnsafe?.user?.id,
        name: document.getElementById(`anime_list_${prefix}`)?.value,
        season: document.getElementById(`season_list_${prefix}`)?.value,
        episode: document.getElementById(`episode_num_${prefix}`)?.value,
        episode_title: document.getElementById(`episode_title_${prefix}`)?.value.trim(),

        voiced_by: voicers,
        any_voiced_by: document.getElementById(`any_voiced_${prefix}`)?.value.trim(),
        sound_by: sounds,
        any_sound_by: document.getElementById(`any_sound_${prefix}`)?.value.trim(),
        translated_by: translators,
        any_translated_by: document.getElementById(`any_translated_${prefix}`)?.value.trim(),

        description: document.getElementById(`description_${prefix}`)?.value.trim(),

        include_finished: document.getElementById(`include_finished_switch_${prefix}`)?.checked ?? false,
        include_sound: document.getElementById(`include_sound_switch_${prefix}`)?.checked ?? true,
        tag: document.getElementById(`anime_list_${prefix}`)?.value.trim(),
    };
}

function sendData(prefix, type) {
    const data = collectFormData(prefix, type);

    fetch("http://localhost:8000/submit_episode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(response => {
        if (response.status === "anime exist") {
            alert("Серія цього аніме вже існує!");
        } else if (response.status === "anime added") {
            tg.close();
        } else {
            alert("Щось пішло не так!");
        }
    })
    .catch(error => {
        alert("Помилка при надсиланні!");
        console.error(error);
    });
}

// Прив’язуємо кнопки до функцій
document.getElementById("submit_episode").onclick = () => sendData("episode", "episode");
document.getElementById("submit_ova").onclick = () => sendData("ova", "ova");
document.getElementById("submit_special").onclick = () => sendData("special", "special");

// Завантаження даберів
fetch("http://localhost:8000/voicers")
    .then(res => res.json())
    .then(voicers => {
        ["episode", "ova", "special"].forEach(prefix => {
            const container = document.getElementById(`voiced_by_container_${prefix}`);
            voicers.forEach(voicer => {
                const name = typeof voicer === "string" ? voicer : voicer.name;
                const wrapper = document.createElement("div");
                wrapper.className = "switch-wrapper";
                wrapper.innerHTML = `
                    <label class="switch-label">
                        <label class="switch">
                            <input type="checkbox" name="voicers_${prefix}" value="${name}">
                            <span class="slider"></span>
                        </label>
                        ${name}
                    </label>
                `;
                container.appendChild(wrapper);
            });
        });
    });

// Завантаження звукарів
fetch("http://localhost:8000/sounds")
    .then(res => res.json())
    .then(voicers => {
        ["episode", "ova", "special"].forEach(prefix => {
            const container = document.getElementById(`sound_by_container_${prefix}`);
            voicers.forEach(voicer => {
                const name = typeof voicer === "string" ? voicer : voicer.name;
                const wrapper = document.createElement("div");
                wrapper.className = "switch-wrapper";
                wrapper.innerHTML = `
                    <label class="switch-label">
                        <label class="switch">
                            <input type="checkbox" name="sounds_${prefix}" value="${name}">
                            <span class="slider"></span>
                        </label>
                        ${name}
                    </label>
                `;
                container.appendChild(wrapper);
            });
        });
    });

// Завантаження звукарів
fetch("http://localhost:8000/translators")
    .then(res => res.json())
    .then(voicers => {
        ["episode", "ova", "special"].forEach(prefix => {
            const container = document.getElementById(`translated_by_container_${prefix}`);
            voicers.forEach(voicer => {
                const name = typeof voicer === "string" ? voicer : voicer.name;
                const wrapper = document.createElement("div");
                wrapper.className = "switch-wrapper";
                wrapper.innerHTML = `
                    <label class="switch-label">
                        <label class="switch">
                            <input type="checkbox" name="translators_${prefix}" value="${name}">
                            <span class="slider"></span>
                        </label>
                        ${name}
                    </label>
                `;
                container.appendChild(wrapper);
            });
        });
    });

// Завантаження аніме та сезонів
let animeData = [];

fetch("http://localhost:8000/anime")
    .then(res => res.json())
    .then(data => {
        animeData = data;
        ["episode", "ova", "special"].forEach(prefix => {
            const animeSelect = document.getElementById(`anime_list_${prefix}`);
            const seasonSelect = document.getElementById(`season_list_${prefix}`);

            data.forEach(anime => {
                const option = document.createElement("option");
                option.value = anime.tag;
                option.textContent = anime.name;
                animeSelect.appendChild(option);
            });

            animeSelect.addEventListener("change", () => {
                const selectedTag = animeSelect.value;
                const selectedAnime = animeData.find(a => a.tag === selectedTag);
                seasonSelect.innerHTML = "";
                if (!selectedAnime || !selectedAnime.seasons) return;

                selectedAnime.seasons.forEach(season => {
                    const opt = document.createElement("option");
                    opt.value = season;
                    opt.textContent = `Сезон ${season}`;
                    seasonSelect.appendChild(opt);
                });
            });
        });
    });
