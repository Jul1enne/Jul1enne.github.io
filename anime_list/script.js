const urlParams = new URLSearchParams(window.location.search);
let filter = urlParams.get("filter") || "all";
const pageFromUrl = parseInt(urlParams.get("page"), 10);
let currentPage = isNaN(pageFromUrl) ? 1 : pageFromUrl;
const userId = urlParams.get("userId") || null;

async function fetchAnimeList() {
  const loadingElement = document.getElementById("loadingIndicator");
  loadingElement.classList.remove("hidden");

  let url = "http://localhost:8000/anime_list";
  if (filter === "watched") url = `http://localhost:8000/watched_anime_list?user_id=${userId}`;
  else if (filter === "watch") url = `http://localhost:8000/watch_anime_list?user_id=${userId}`;
  else if (filter === "planned") url = `http://localhost:8000/planned_anime_list?user_id=${userId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Помилка при завантаженні аніме");
    const data = await response.json();

    if (data.length === 0) {
      const nullMessages = {
        watched: "У вашому списку переглянутого ще нічого немає.",
        watch: "У вашому списку перегляду ще нічого немає.",
        planned: "У вашому списку «на потім» ще нічого немає.",
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

const MAX_PER_PAGE = 3;
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
          <a href="anime.html?id=${anime.id}&userId=${String(userId)}&filter=${filter}&page=${currentPage}" class="collapse-btn">Перейти</a>
        </div>
      `;
    } else if (anime.type === "series") {
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
          <a href="anime.html?id=${anime.id}&userId=${String(userId)}&filter=${filter}&page=${currentPage}" class="collapse-btn">Перейти</a>
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

  const delta = 2; // скільки сторінок показувати ліворуч/праворуч від активної

  function createPageBtn(page) {
    const btn = document.createElement("button");
    btn.textContent = page;
    btn.className = "page-btn";
    if (page === currentPage) btn.style.backgroundColor = "#444";
    btn.disabled = (page === currentPage);
    btn.addEventListener("click", () => {
      if (currentPage === page) return;
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

  // "..." якщо треба між першою і лівим сусідом
  if (currentPage - delta > 2) {
    const dots = document.createElement("span");
    dots.textContent = "...";
    dots.style.margin = "0 8px";
    pagination.appendChild(dots);
  }

  // Сторінки навколо поточної
  for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
    pagination.appendChild(createPageBtn(i));
  }

  // "..." якщо треба між правим сусідом і останньою сторінкою
  if (currentPage + delta < totalPages - 1) {
    const dots = document.createElement("span");
    dots.textContent = "...";
    dots.style.margin = "0 8px";
    pagination.appendChild(dots);
  }

  // Остання сторінка, якщо їх більше 1
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

      const url = new URL(window.location);
      url.searchParams.set("filter", selectedFilter);
      url.searchParams.set("page", 1);
      window.history.replaceState({}, '', url);

      setActiveFilter(filter);

      currentPage = 1;
      loadAndRenderAnime();
    });
  });

  setActiveFilter(filter);
  loadAndRenderAnime();
});
