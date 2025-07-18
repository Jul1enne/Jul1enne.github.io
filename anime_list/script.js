

const urlParams = new URLSearchParams(window.location.search);
const filter = urlParams.get("filter") || "all";
const userId = urlParams.get("userId") || null;

alert(userId)

// API-запит на отримання списку аніме
async function fetchAnimeList() {
  let url = "http://localhost:8000/anime_list"; // all за замовчуванням

  if (filter === "watched") {
    url = `http://localhost:8000/watched_anime_list?user_id=${userId}`;
  } else if (filter === "watch") {
    url = `http://localhost:8000/watch_anime_list?user_id=${userId}`;
  } else if (filter === "planned") {
    url = `http://localhost:8000/planned_anime_list?user_id=${userId}`;
  }


  try {
    const response = await fetch(url);
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

    let badgeHTML = '';
    if (anime.type === "series" && !anime.finished) {
      badgeHTML = `<div class="badge"><strong>ОЗВУЧУЄТЬСЯ</strong></div>`;
    }

    let itemHTML = '';

    //<div class="meta-block"><strong>Тип:</strong> ${anime.type === "movie" ? "Фільм" : "Серіал"}</div>
    if (anime.type === "movie") {
      itemHTML = `
        <div class="anime-summary">
          <img src="http://localhost:8000/poster/${anime.file_id}" class="poster" alt="Poster">
          <div class="info">
            <div class="title">${anime.title}</div>
            <div class="subtitle">${anime.title_en}</div>

            <div class="meta-block">
              <div><strong>Рік:</strong> ${anime.year}</div>
              <div><strong>Жанр:</strong> ${anime.genre}</div>
            </div>
          </div>
        </div>
        <div class="details" id="details-${anime.id}">
          <a href="anime.html?id=${anime.id}&userId=${String(userId)}" class="collapse-btn">Перейти</a>
        </div>
      `;
    } else {
      // Серіали
      itemHTML = `
        <div class="anime-summary">
          <img src="http://localhost:8000/poster/${anime.file_id}" class="poster" alt="Poster">
          <div class="info">
            ${badgeHTML}
            <div class="title">${anime.title} ${anime.season} сезон</div>
            <div class="subtitle">${anime.title_en} ${anime.season} season</div>
            
            <div class="meta-block">
              <div><strong>Рік:</strong> ${anime.year}</div>
              <div><strong>Жанр:</strong> ${anime.genre}</div>
              <div><strong>Кількість серій:</strong> ${anime.episodes}</div>
            </div>
          </div>
        </div>
        <div class="details" id="details-${anime.id}">
          <a href="anime.html?id=${anime.id}&userId=${String(userId)}" class="collapse-btn">Перейти</a>
        </div>
      `;
    }

    item.innerHTML = itemHTML;

    item.querySelector(".anime-summary").addEventListener("click", () => {
      localStorage.setItem('animeListReturnUrl', window.location.href);
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
