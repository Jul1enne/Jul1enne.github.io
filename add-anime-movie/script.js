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

    const data = {
        type: 'movie',
        user_id: tg.initDataUnsafe?.user?.id,
        title_ua: document.getElementById('title_ua').value,
        title_en: document.getElementById('title_en').value,
        year: document.getElementById('year').value,
        genre: document.getElementById('genres').value,
        director: document.getElementById('director').value,
        studio_publisher: document.getElementById('studio_publisher').value,
        description: document.getElementById('description').value,
        voiced_by: voicers,
        sound: document.getElementById('sound').value,
        tag: document.getElementById('tag').value,
        include_sound: document.getElementById('include_sound_switch')?.checked ?? true,
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
