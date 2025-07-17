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

    let badgeHTML = '';
    if (anime.type === "series" && !anime.finished) {
      badgeHTML = `<div class="badge"><strong>ОЗВУЧУЄТЬСЯ</strong></div>`;
    }

    let itemHTML = '';

    if (anime.type === "movie") {
      itemHTML = `
        <div class="anime-summary">
          <img src="http://localhost:8000/poster/${anime.file_id}" class="poster" alt="Poster">
          <div class="info">
            <div class="title">${anime.title}</div>
            <div class="subtitle">${anime.title_en}</div>
            <div class="meta-block"><strong>Тип:</strong> ${anime.type === "movie" ? "Фільм" : "Серіал"}</div>
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
    } else {
      // Серіали
      itemHTML = `
        <div class="anime-summary">
          <img src="http://localhost:8000/poster/${anime.file_id}" class="poster" alt="Poster">
          <div class="info">
            ${badgeHTML}
            <div class="title">${anime.title} ${anime.season} сезон</div>
            <div class="subtitle">${anime.title_en} ${anime.season} season</div>
            <div class="meta-block"><strong>Тип:</strong> ${anime.type === "movie" ? "Фільм" : "Серіал"}</div>
            <div class="meta-block">
              <div><strong>Рік:</strong> ${anime.year}</div>
              <div><strong>Жанр:</strong> ${anime.genre}</div>
              <div><strong>Кількість серій:</strong> ${anime.episodes}</div>
            </div>
          </div>
        </div>
        <div class="details" id="details-${anime.id}">
          <a href="anime.html?id=${anime.id}" class="collapse-btn">Перейти</a>
        </div>
      `;
    }

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
  animeList = [
  {
    id: 1,
    type: 'series',
    title: "Дядечко з іншого світу",
    title_en: "Uncle from another world",
    description: `Сімнадцять років тому 17-річний дядько Такафумі впав у кому через те, що його збила вантажівка, але тепер він повернувся, як людина, що піднялася з могили.
Поки дядько мешкає разом із Такафумі, хлопець дізнається про його фантастичні пригоди й безмежну любов до ігор на SEGA. Але інколи історії дядька, часто сповнені самотності й жорстокості, викликають у Такафумі як радість, так і смуток.
Двоє чоловіків різних поколінь старанно працюють над створенням відеоконтенту в новій захопливій комедії про інший світ, дія якої відбувається в кутку багатоквартирного будинку.`,
    file_id: "AgACAgIAAxkBAAMdaHPhVCvW8wVNcBTvS0fgdjUSJXsAAnT3MRvvwKBLAmOi_LCskpEBAAMCAAN5AAM2BA",
    season: 1,
    year: 2022,
    episodes: 13,
    genre: "Екшн, Пригоди",
    finished: true,
  },
  {
    id: 2,
    type: 'series',
    title: "Дядечко з іншого світу",
    title_en: "Uncle from another world",
    description: `Сімнадцять років тому 17-річний дядько Такафумі впав у кому через те, що його збила вантажівка, але тепер він повернувся, як людина, що піднялася з могили.
Поки дядько мешкає разом із Такафумі, хлопець дізнається про його фантастичні пригоди й безмежну любов до ігор на SEGA. Але інколи історії дядька, часто сповнені самотності й жорстокості, викликають у Такафумі як радість, так і смуток.
Двоє чоловіків різних поколінь старанно працюють над створенням відеоконтенту в новій захопливій комедії про інший світ, дія якої відбувається в кутку багатоквартирного будинку.`,
    file_id: "AgACAgIAAxkBAAMdaHPhVCvW8wVNcBTvS0fgdjUSJXsAAnT3MRvvwKBLAmOi_LCskpEBAAMCAAN5AAM2BA",
    season: 2,
    year: 2022,
    episodes: 13,
    genre: "Екшн, Пригоди",
    finished: false,
  },
  {
    id: 3,
    type: 'movie',
    title: "Дядечко з іншого світу",
    title_en: "Uncle from another world",
    description: `Сімнадцять років тому 17-річний дядько Такафумі впав у кому через те, що його збила вантажівка, але тепер він повернувся, як людина, що піднялася з могили.
Поки дядько мешкає разом із Такафумі, хлопець дізнається про його фантастичні пригоди й безмежну любов до ігор на SEGA. Але інколи історії дядька, часто сповнені самотності й жорстокості, викликають у Такафумі як радість, так і смуток.
Двоє чоловіків різних поколінь старанно працюють над створенням відеоконтенту в новій захопливій комедії про інший світ, дія якої відбувається в кутку багатоквартирного будинку.`,
    file_id: "AgACAgIAAxkBAAMdaHPhVCvW8wVNcBTvS0fgdjUSJXsAAnT3MRvvwKBLAmOi_LCskpEBAAMCAAN5AAM2BA",
    season: 2,
    year: 2022,
    episodes: 13,
    genre: "Екшн, Пригоди",
    finished: false,
  },
];


  renderAnimePage(currentPage);
})();
