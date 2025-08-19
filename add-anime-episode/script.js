const tg = window.Telegram.WebApp;
tg.expand();

function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.form').forEach(el => el.style.display = 'none');
    document.querySelector(`.tab[onclick*="${tab}"]`).classList.add('active');
    document.getElementById(tab).style.display = 'flex';
}

function collectFormData(prefix, type) {
    if (!confirm("Впевнені, що все вірно?")) {
        return; // користувач натиснув "Ні" — зупинити виконання
      }

    const voicers = Array.from(document.querySelectorAll(`input[name="voicers_${prefix}"]:checked`)).map(cb => cb.value);
    const sounds = Array.from(document.querySelectorAll(`input[name="sounds_${prefix}"]:checked`)).map(cb => cb.value);
    const translators = Array.from(document.querySelectorAll(`input[name="translators_${prefix}"]:checked`)).map(cb => cb.value);

    const animeSelect = document.getElementById(`anime_list_${prefix}`);
    const seasonSelect = document.getElementById(`season_list_${prefix}`);

    const animeSelectedOption = animeSelect.selectedOptions[0];
    const seasonSelectedOption = seasonSelect.selectedOptions[0];

    return {
        type,
        user_id: tg.initDataUnsafe?.user?.id,
    
        name: document.getElementById(`anime_list_${prefix}`)?.value,

        anime_id: animeSelectedOption ? animeSelectedOption.getAttribute("data-id") : null,
        season_id: seasonSelectedOption ? seasonSelectedOption.getAttribute("data-id") : null,
        
        season: seasonSelect.value,
        //part: document.getElementById(`part_list_${prefix}`)?.value || null,

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
        include_translator: document.getElementById(`include_translator_switch_${prefix}`)?.checked ?? true,
        tag:animeSelect.value.trim(),
    };
}

function sendData(prefix, type) {
    const data = collectFormData(prefix, type);

    fetch(`${config.serverUrl}/submit_episode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(async res => {
          const result = await res.json();
        
          if (!res.ok) {
            // Якщо відповідь з помилкою — покажи повідомлення
            throw new Error(result.detail || result.error || "Невідома помилка");
          }
        
          // Якщо все добре — закриваємо WebApp
          tg.close();
        })
        .catch(error => {
          alert(error.message);
          console.error("Server error:", error);
        });
    }

// Прив’язуємо кнопки до функцій
document.getElementById("submit_episode").onclick = () => sendData("episode", "episode");
document.getElementById("submit_ova").onclick = () => sendData("ova", "ova");
document.getElementById("submit_special").onclick = () => sendData("special", "special");

// Завантаження даберів
fetch(`${config.serverUrl}/voicers`)
    .then(res => res.json())
    .then(voicers => {
        ["episode", "ova", "special"].forEach(prefix => {
            const container = document.getElementById(`voiced_by_container_${prefix}`);
            if (!container) return;

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
    })
    .catch(error => console.error("Voicers fetch error:", error));

// Завантаження звукарів
fetch(`${config.serverUrl}/sounds`)
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
fetch(`${config.serverUrl}/translators`)
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

fetch(`${config.serverUrl}/anime`)
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
                option.setAttribute("data-id", anime.id);
                animeSelect.appendChild(option);
            });

            animeSelect.addEventListener("change", () => {
                const selectedTag = animeSelect.value;
                const selectedAnime = animeData.find(a => a.tag === selectedTag);
                seasonSelect.innerHTML = "<option value=''></option>";
                //document.getElementById(`part_list_${prefix}`).innerHTML = "<option value=''></option>";

                if (!selectedAnime || !selectedAnime.seasons) return;

                // Додаємо сезони
                selectedAnime.seasons.forEach(season => {
                    const opt = document.createElement("option");
                    opt.value = season.number;
                    opt.textContent = `Сезон ${season.lable}`;
                    opt.setAttribute("data-id", season.season_id);
                    seasonSelect.appendChild(opt);
                });
              
                // При зміні сезону — оновлюємо список частин
                //seasonSelect.addEventListener("change", () => {
                //    const selectedSeasonNumber = parseInt(seasonSelect.value, 10);
                //    const selectedSeason = selectedAnime.seasons.find(s => s.number === selectedSeasonNumber);
                //    const partSelect = document.getElementById(`part_list_${prefix}`);
                //    partSelect.innerHTML = "<option value=''></option>";
                //    
                //    if (selectedSeason && selectedSeason.chapters) {
                //        selectedSeason.chapters.forEach(ch => {
                //            const partOpt = document.createElement("option");
                //            partOpt.value = ch.number;
                //            partOpt.textContent = `Частина ${ch.number}`;
                //            partSelect.appendChild(partOpt);
                //        });
                //    }
                //});
            });
        });
    });
