// API-запит на отримання списку аніме
async function fetchAnimeList() {
  try {
    const response = await fetch("http://localhost:8000/anime_list");
    if (!response.ok) throw new Error("Помилка при завантаженні аніме");
    const data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
}

const MAX_PER_PAGE = 3;
let animeList = [];
let currentPage = 1;

async function renderAnimePage(page) {
  const container = document.getElementById("animeContainer");
  const pagination = document.getElementById("pagination");
  container.innerHTML = "";
  pagination.innerHTML = "";

  const start = (page - 1) * MAX_PER_PAGE;
  const end = start + MAX_PER_PAGE;
  const visibleItems = animeList.slice(start, end);

  for (const anime of visibleItems) {

    const item = document.createElement("div");
    item.className = "anime-item";

    const isOngoing = !anime.finished;
    const badgeHTML = isOngoing ? `<div class="badge"><strong>ОЗВУЧУЄТЬСЯ</strong></div>` : '';

    const itemHTML = `
      <div class="anime-summary">
        <img src="http://localhost:8000/poster/${anime.file_id}" class="poster" alt="Poster">
        <div class="info">
          ${badgeHTML}
          <div class="title">${anime.title} ${anime.season} сезон</div>
          <div class="subtitle">${anime.title_en} ${anime.season} season</div>
          <div class="meta-block">
            <div><strong>Рік:</strong> ${anime.year}</div>
            <div><strong>Жанр:</strong> ${anime.genre}</div>
          </div>
        </div>
      </div>
      <div class="details" id="details-${anime.id}">
        <a href="anime.html?id=${anime.id}" class="collapse-btn">Перейти</a>
      </div>
    `;

    item.innerHTML = itemHTML;

    item.querySelector(".anime-summary").addEventListener("click", () => {
      document.querySelectorAll(".anime-item.expanded").forEach(el => {
        if (el !== item) el.classList.remove("expanded");
      });
      item.classList.toggle("expanded");
    });

    container.appendChild(item);
  }

  const totalPages = Math.ceil(animeList.length / MAX_PER_PAGE);
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = "page-btn";
    if (i === page) btn.style.backgroundColor = "#444";
    btn.addEventListener("click", () => {
      currentPage = i;
      renderAnimePage(currentPage);
    });
    pagination.appendChild(btn);
  }
}

// Завантаження та відображення сторінки
(async () => {
  animeList = await fetchAnimeList();

  renderAnimePage(currentPage);
})();
