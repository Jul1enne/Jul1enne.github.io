const tg = window.Telegram.WebApp;
tg.expand();

function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.form').forEach(el => el.style.display = 'none');
    document.querySelector('.tab[onclick*="' + tab + '"]').classList.add('active');
    document.getElementById(tab).style.display = 'flex';
}

function sendMovie() {
    const voicers = Array.from(document.querySelectorAll('input[name="voicers"]:checked')).map(cb => cb.value);
    const translators = Array.from(document.querySelectorAll('input[name="translators"]:checked')).map(cb => cb.value);
    const sounds = Array.from(document.querySelectorAll('input[name="sounds"]:checked')).map(cb => cb.value);

    const data = {
        type: 'movie',
        user_id: tg.initDataUnsafe?.user?.id,
        title_ua: document.getElementById('title_ua').value.trim(),
        title_en: document.getElementById('title_en').value.trim(),
        chapter: document.getElementById('chapter').value,
        year: document.getElementById('year').value,
        genre: document.getElementById('genres').value.trim(),
        director: document.getElementById('director').value.trim(),
        studio_publisher: document.getElementById('studio_publisher').value.trim(),
        description: document.getElementById('description').value.trim(),

        voiced_by: voicers,
        any_voiced_by: document.getElementById('any_voiced_by').value.trim(),
        translated_by: translators,
        any_translated_by: document.getElementById('any_translated_by').value.trim(),
        sounds: sounds,
        any_sound_by: document.getElementById('any_sound_by').value.trim(),

        tag: document.getElementById('tag').value.trim(),
        include_sound: document.getElementById('include_sound_switch')?.checked ?? true,
        include_translator: document.getElementById('include_translator_switch')?.checked ?? true,
        include_exist_official_dub: document.getElementById('include_exist_official_dub')?.checked ?? false,
    };

    fetch("http://localhost:8000/submit_movie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(response => {
        if (response.status === "movie exist") {
            alert("Такий фільм вже існує!");
            return;
        }

        if (response.status === "movie added") {
            tg.close();
            return;
        }

        alert("Щось пішло не так!");
    })
    .catch(error => {
        alert("Помилка при надсиланні!");
        console.error(error);
    });
}

// Завантажити список озвучувачів
fetch("http://localhost:8000/voicers")
    .then(res => res.json())
    .then(voicers => {
        const voicedContainer = document.getElementById("voiced_by_container");

        voicers.forEach(voicer => {
            const name = typeof voicer === "string" ? voicer : voicer.name;

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

// Завантаження звукарів
fetch("http://localhost:8000/sounds")
    .then(res => res.json())
    .then(sounders => {
        const soundContainer = document.getElementById("sound_by_container");

        sounders.forEach(sounder => {
            const name = typeof sounder === "string" ? sounder : sounder.name;

            const wrapper = document.createElement("div");
            wrapper.className = "switch-wrapper";
            wrapper.innerHTML = `
                <label class="switch-label">
                    <label class="switch">
                        <input type="checkbox" name="sounds" value="${name}">
                        <span class="slider"></span>
                    </label>
                    ${name}
                </label>
            `;
            soundContainer.appendChild(wrapper);
        });
    });

// Завантаження звукарів
fetch("http://localhost:8000/translators")
    .then(res => res.json())
    .then(translators => {
        const translatedContainer = document.getElementById(`translated_by_container`);

        translators.forEach(translator => {
            const name = typeof translator === "string" ? translator : translator.name;
            const wrapper = document.createElement("div");
            wrapper.className = "switch-wrapper";
            wrapper.innerHTML = `
                <label class="switch-label">
                    <label class="switch">
                        <input type="checkbox" name="translators" value="${name}">
                        <span class="slider"></span>
                    </label>
                    ${name}
                </label>
            `;
            translatedContainer.appendChild(wrapper);
        });
    });


