const container = document.getElementById('animeView');
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

async function loadAnime() {
  try {
    const res = await fetch(`http://localhost:8000/anime_id/${id}`);
    if (!res.ok) {
      container.innerHTML = "<p>Аніме не знайдено</p>";
      return;
    }
    const anime = await res.json();
    renderAnime(anime);
  } catch (err) {
    container.innerHTML = "<p>Помилка завантаження</p>";
  }
}

function renderAnime(anime) {
  const season = anime.seasons[0];

  container.innerHTML = `
    <div class="anime-item expanded">
      <div class="anime-summary">
        <img src="/poster/${anime.file_id}" class="poster" alt="Poster">
        <div class="info">
          <div class="title">${anime.title}</div>
          <div class="description">${anime.description}</div>
        </div>
      </div>
      <div class="details">
        <div class="meta">
          <div><strong>Жанр:</strong> ${season.genre}</div>
          <div><strong>Кількість серій:</strong> ${season.episodes}</div>
          <div><strong>Рік:</strong> ${season.year}</div>
        </div>
        <div class="dropdown">
          <div class="dropdown-header" onclick="this.parentNode.classList.toggle('open')">Сезони</div>
          <div class="dropdown-content">
            ${anime.seasons.map(s => `
              <a href="#" onclick="event.preventDefault(); switchSeason(${anime.id}, ${s.number})">Сезон ${s.number}</a>
            `).join('')}
          </div>
        </div>
        <div class="dropdown">
          <div class="dropdown-header" onclick="this.parentNode.classList.toggle('open')">Серії</div>
          <div class="dropdown-content" id="episodes">
            ${season.episodeLinks.map(e => `<a href="${e.url}">${e.title}</a>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function switchSeason(animeId, seasonNumber) {
  fetch(`http://localhost:8000/anime_id/${animeId}`)
    .then(res => res.json())
    .then(anime => {
      const season = anime.seasons.find(s => s.number === seasonNumber);
      const meta = document.querySelector('.meta');
      const episodes = document.getElementById('episodes');

      meta.innerHTML = `
        <div><strong>Жанр:</strong> ${season.genre}</div>
        <div><strong>Кількість серій:</strong> ${season.episodes}</div>
        <div><strong>Рік:</strong> ${season.year}</div>
      `;
      episodes.innerHTML = season.episodeLinks.map(e => `<a href="${e.url}">${e.title}</a>`).join('');
    });
}

loadAnime();
