// script.js
const tg = window.Telegram.WebApp;
tg.expand();

function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.form').forEach(el => el.style.display = 'none');
    document.querySelector('.tab[onclick*="' + tab + '"]').classList.add('active');
    document.getElementById(tab).style.display = 'flex';
}

let toggleState = false;

document.getElementById("toggle_sound").addEventListener("click", () => {
    toggleState = !toggleState;
    document.getElementById("toggle_sound").textContent = toggleState ? "Так" : "Ні";
});

function sendEpisode() {
    const data = {
        type: 'episode',
        name: document.getElementById('anime_list')?.value,
        episode_num: document.getElementById('episode_num').value,
        episode_title: document.getElementById('episode_title').value,
        voiced_by: document.getElementById('voiced_by').value,
        description: document.getElementById('description').value,
        include_sound_3: document.getElementById('include_sound_switch')?.checked ?? false,
    };

    console.log(data); // тимчасово
    tg.sendData(JSON.stringify(data));
}
