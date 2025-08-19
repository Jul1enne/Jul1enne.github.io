// Додано на початку
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")                        // Розділяємо літери та діакритичні знаки
    .replace(/ґ/g, "г")                      // Ґ → г
    .replace(/є/g, "е")                      // є → е
    .replace(/ї/g, "і")                      // ї → і
    .replace(/и/g, "і")                      // и → і (іноді замінюють)
    .replace(/[’'`´]/g, "")                  // Видаляємо апострофи
    .replace(/й/g, "і")                      // й → і (іноді)
    // Англ. заміни, які зазвичай плутають з українськими літерами:
    .replace(/q/g, "к")
    .replace(/w/g, "в")
    .replace(/e/g, "е")
    .replace(/r/g, "р")
    .replace(/t/g, "т")
    .replace(/y/g, "у")
    .replace(/u/g, "и")
    .replace(/i/g, "і")
    .replace(/o/g, "о")
    .replace(/p/g, "п")
    .replace(/a/g, "а")
    .replace(/s/g, "с")
    .replace(/d/g, "д")
    .replace(/f/g, "ф")
    .replace(/g/g, "г")
    .replace(/h/g, "х")
    .replace(/j/g, "й")
    .replace(/k/g, "к")
    .replace(/l/g, "л")
    .replace(/z/g, "з")
    .replace(/x/g, "кс")
    .replace(/c/g, "ц")
    .replace(/v/g, "в")
    .replace(/b/g, "б")
    .replace(/n/g, "н")
    .replace(/m/g, "м")
    // Додатково очищаємо зайві пробіли
    .replace(/\s+/g, " ")
    .trim();
}



const urlParams = new URLSearchParams(window.location.search);
let filter = urlParams.get("filter") || "all";
let searchQuery = "";
const pageFromUrl = parseInt(urlParams.get("page"), 10);
let currentPage = isNaN(pageFromUrl) ? 1 : pageFromUrl;
const userId = urlParams.get("userId") || null;

async function fetchAnimeList() {
  const loadingElement = document.getElementById("loadingIndicator");
  loadingElement.classList.remove("hidden");

  let url = `${config.serverUrl}/anime_list`;
  if (filter === "watched") url = `${config.serverUrl}/watched_anime_list?user_id=${userId}`;
  else if (filter === "watch") url = `${config.serverUrl}/watch_anime_list?user_id=${userId}`;
  else if (filter === "planned") url = `${config.serverUrl}/planned_anime_list?user_id=${userId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Помилка при завантаженні аніме");
    const data = await response.json();

    if (data.length === 0) {
      const nullMessages = {
        watched: "У вашому списку «Переглянуто» ще нічого немає.",
        watch: "У вашому списку «Дивлюсь» ще нічого немає.",
        planned: "У вашому списку «На потім» ще нічого немає.",
        all: "Список аніме порожній.",
      };
      const message = nullMessages[filter] || nullMessages["all"];
      const nullAnimeListHTML = `<div class="anime-card empty-card">${message}</div>`;
      return { list: [], html: nullAnimeListHTML };
    }
    return { list: data, html: null };

  } catch (e) {
    console.error(e);
    const errorHTML = `<div class="anime-card empty-card error">Сталася помилка при завантаженні аніме.</div>`;
    return { list: [], html: errorHTML };
  } finally {
    loadingElement.classList.add("hidden");
  }
}

const MAX_PER_PAGE = 5;
let animeList = [];
let nullAnimeListHTML = '';

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
          <img src="${config.serverUrl}/poster/${anime.file_id}" class="poster" alt="Poster">
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
          <a href="anime.html?userId=${userId}&id=${anime.id}" class="collapse-btn">Перейти</a>
        </div>
      `;
    } else if (anime.type === "series") {
      itemHTML = `
        <div class="anime-summary">
          <img src="${config.serverUrl}/poster/${anime.file_id}" class="poster" alt="Poster">
          <div class="info">
            ${badgeHTML}
            <div class="title">${anime.title}</div>
            <div class="subtitle">${anime.title_en}</div>
            <div class="meta-block">
              <div><strong>Рік:</strong> ${anime.year}</div>
              <div><strong>Жанр:</strong> ${anime.genre}</div>
              <div><strong>Кількість серій:</strong> ${anime.episodes}</div>
            </div>
          </div>
        </div>
        <div class="details" id="details-${anime.id}">
          <a href="anime.html?userId=${userId}&id=${anime.id}" class="collapse-btn">Перейти</a>
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
      renderPagination(totalPages, page);
    }



function renderPagination(totalPages, currentPage) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const delta = 1;

  function createPageBtn(page) {
    const btn = document.createElement("button");
    btn.textContent = page;
    btn.className = "page-btn";
    if (page === currentPage) {
      btn.style.backgroundColor = "#444";
      btn.disabled = true;
    }
    btn.addEventListener("click", () => {
      if (page === currentPage) return;
      currentPage = page;

      // Оновити URL параметр page
      const url = new URL(window.location);
      url.searchParams.set("page", currentPage);
      window.history.replaceState({}, '', url);

      renderAnimePage(currentPage);
    });
    return btn;
  }

  // Перша сторінка
  pagination.appendChild(createPageBtn(1));

  // "..." між першою і лівим сусідом
  if (currentPage - delta > 2) {
    const dots = document.createElement("span");
    dots.textContent = "...";
    dots.style.margin = "0 8px";
    pagination.appendChild(dots);
  }

  // Лівий сусід
  if (currentPage - 1 > 1) {
    pagination.appendChild(createPageBtn(currentPage - 1));
  }

  // Поточна сторінка (якщо вона не перша і не остання)
  if (currentPage !== 1 && currentPage !== totalPages) {
    pagination.appendChild(createPageBtn(currentPage));
  }

  // Правий сусід
  if (currentPage + 1 < totalPages) {
    pagination.appendChild(createPageBtn(currentPage + 1));
  }

  // "..." між правим сусідом і останньою сторінкою
  if (currentPage + delta < totalPages - 1) {
    const dots = document.createElement("span");
    dots.textContent = "...";
    dots.style.margin = "0 8px";
    pagination.appendChild(dots);
  }

  // Остання сторінка (якщо їх більше 1)
  if (totalPages > 1) {
    pagination.appendChild(createPageBtn(totalPages));
  }
}


function setActiveFilter(newFilter) {
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    const isActive = btn.dataset.filter === newFilter;
    btn.classList.toggle('active', isActive);
    if (isActive) {
      btn.setAttribute("disabled", "disabled");
    } else {
      btn.removeAttribute("disabled");
    }
  });
}

async function loadAndRenderAnime() {
  const result = await fetchAnimeList();
  animeList = result.list;
  
  if (searchQuery) {
    const normalizedSearch = normalizeText(searchQuery);
    animeList = animeList.filter((anime) =>
      normalizeText(anime.title).includes(normalizedSearch) ||
      (anime.title_en && normalizeText(anime.title_en).includes(normalizedSearch))
    );
  }

  nullAnimeListHTML = result.html;

  const container = document.getElementById("animeContainer");
  const pagination = document.getElementById("pagination");

  if (animeList.length === 0 && nullAnimeListHTML) {
    container.innerHTML = nullAnimeListHTML;
    pagination.innerHTML = "";
  } else {
    renderAnimePage(currentPage);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedFilter = btn.dataset.filter;

      if (selectedFilter === filter) return;

      filter = selectedFilter;
      searchQuery = "";  // очищаємо пошук при перемиканні фільтра
      document.getElementById("searchInput").value = "";

      const url = new URL(window.location);
      url.searchParams.set("filter", selectedFilter);
      url.searchParams.set("page", 1);
      url.searchParams.delete("search");
      window.history.replaceState({}, '', url);

      setActiveFilter(filter);

      currentPage = 1;
      loadAndRenderAnime();
    });
  });

  setActiveFilter(filter);
  loadAndRenderAnime();
});

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value.trim().toLowerCase();
  currentPage = 1;

  const url = new URL(window.location);
  if (searchQuery) {
    url.searchParams.set("search", searchQuery);
  } else {
    url.searchParams.delete("search");
  }
  url.searchParams.set("page", 1);
  window.history.replaceState({}, "", url);

  setActiveFilter(filter); // заново підсвічує кнопку
  loadAndRenderAnime();
});

