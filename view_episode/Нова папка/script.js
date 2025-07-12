// script.js

const seasons = {
    '1': ['1', '2', '3', '4'],
    '2': ['1', '2', '3']
};

const videoLinks = {
    '1': {
        '1': 'https://Underground-Voice.b-cdn.net/Uncle-From-Another-World%20S01e01.mp4',
        '2': 'https://Underground-Voice.b-cdn.net/Uncle-From-Another-World%20S01e02.mp4',
        '3': 'https://Underground-Voice.b-cdn.net/Uncle-From-Another-World%20S01e03.mp4',
        '4': 'https://Underground-Voice.b-cdn.net/Uncle-From-Another-World%20S01e04.mp4'
    },
    '2': {
        '1': 'https://Underground-Voice.b-cdn.net/Uncle-From-Another-World%20S02e01.mp4',
        '2': 'https://Underground-Voice.b-cdn.net/Uncle-From-Another-World%20S02e02.mp4',
        '3': 'https://Underground-Voice.b-cdn.net/Uncle-From-Another-World%20S02e03.mp4'
    }
};

let currentSeason = '1';
let currentEpisode = '1';

function toggleDropdown(id) {
    const el = document.getElementById(id);
    el.classList.toggle('open');
}

function loadSeasons() {
    const seasonList = document.getElementById('season-list');
    seasonList.innerHTML = '';
    for (const season in seasons) {
        const li = document.createElement('li');
        li.textContent = `Сезон ${season}`;
        li.onclick = () => {
            currentSeason = season;
            currentEpisode = '1';
            updateVideo();
            loadEpisodes();
        };
        seasonList.appendChild(li);
    }
}

function loadEpisodes() {
    const episodeList = document.getElementById('episode-list');
    episodeList.innerHTML = '';
    for (const episode of seasons[currentSeason]) {
        const li = document.createElement('li');
        li.textContent = `Серія ${episode}`;
        li.onclick = () => {
            currentEpisode = episode;
            updateVideo();
        };
        episodeList.appendChild(li);
    }
}

function updateVideo() {
    const video = document.getElementById('anime-player');
    const source = document.getElementById('video-source');
    const url = videoLinks[currentSeason][currentEpisode];
    source.src = url;
    video.load();
    video.play();
}

document.addEventListener('DOMContentLoaded', () => {
    loadSeasons();
    loadEpisodes();
    updateVideo();
});
