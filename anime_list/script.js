const MAX_PER_PAGE = 3;

const animeList = [
  {
    id: 1,
    title: 'Наруто',
    description: `Сімнадцять років тому 17-річний дядько Такафумі впав у кому через те, що його збила вантажівка, але тепер він повернувся, як людина, що піднялася з могили.
Поки дядько мешкає разом із Такафумі, хлопець дізнається про його фантастичні пригоди й безмежну любов до ігор на SEGA. Але інколи історії дядька, часто сповнені самотності й жорстокості, викликають у Такафумі як радість, так і смуток.
Двоє чоловіків різних поколінь старанно працюють над створенням відеоконтенту в новій захопливій комедії про інший світ, дія якої відбувається в кутку багатоквартирного будинку.`,
    file_id: 'AgACAgIAAxkBAAMdaHPhVCvW8wVNcBTvS0fgdjUSJXsAAnT3MRvvwKBLAmOi_LCskpEBAAMCAAN5AAM2BA',
    seasons: [
      {
        number: 1,
        year: 2002,
        episodes: 220,
        genre: 'Екшн, Пригоди',
        episodeLinks: [
          { title: 'Серія 1', url: '#' },
          { title: 'Серія 2', url: '#' }
        ]
      },
      {
        number: 2,
        year: 2005,
        episodes: 50,
        genre: 'Екшн, Комедія',
        episodeLinks: [
          { title: 'Серія 1', url: '#' },
          { title: 'Серія 2', url: '#' },
          { title: 'Серія 3', url: '#' }
        ]
      }
    ]
  },
  {
    id: 1,
    title: 'Наруто',
    description: `Сімнадцять років тому 17-річний дядько Такафумі впав у кому через те, що його збила вантажівка, але тепер він повернувся, як людина, що піднялася з могили.
Поки дядько мешкає разом із Такафумі, хлопець дізнається про його фантастичні пригоди й безмежну любов до ігор на SEGA. Але інколи історії дядька, часто сповнені самотності й жорстокості, викликають у Такафумі як радість, так і смуток.
Двоє чоловіків різних поколінь старанно працюють над створенням відеоконтенту в новій захопливій комедії про інший світ, дія якої відбувається в кутку багатоквартирного будинку.`,
    file_id: 'AgACAgIAAxkBAAMdaHPhVCvW8wVNcBTvS0fgdjUSJXsAAnT3MRvvwKBLAmOi_LCskpEBAAMCAAN5AAM2BA',
    seasons: [
      {
        number: 1,
        year: 2002,
        episodes: 220,
        genre: 'Екшн, Пригоди',
        episodeLinks: [
          { title: 'Серія 1', url: '#' },
          { title: 'Серія 2', url: '#' }
        ]
      },
      {
        number: 2,
        year: 2005,
        episodes: 50,
        genre: 'Екшн, Комедія',
        episodeLinks: [
          { title: 'Серія 1', url: '#' },
          { title: 'Серія 2', url: '#' },
          { title: 'Серія 3', url: '#' }
        ]
      }
    ]
  },
  {
    id: 1,
    title: 'Наруто',
    description: `Сімнадцять років тому 17-річний дядько Такафумі впав у кому через те, що його збила вантажівка, але тепер він повернувся, як людина, що піднялася з могили.
Поки дядько мешкає разом із Такафумі, хлопець дізнається про його фантастичні пригоди й безмежну любов до ігор на SEGA. Але інколи історії дядька, часто сповнені самотності й жорстокості, викликають у Такафумі як радість, так і смуток.
Двоє чоловіків різних поколінь старанно працюють над створенням відеоконтенту в новій захопливій комедії про інший світ, дія якої відбувається в кутку багатоквартирного будинку.`,
    file_id: 'AgACAgIAAxkBAAMdaHPhVCvW8wVNcBTvS0fgdjUSJXsAAnT3MRvvwKBLAmOi_LCskpEBAAMCAAN5AAM2BA',
    seasons: [
      {
        number: 1,
        year: 2002,
        episodes: 220,
        genre: 'Екшн, Пригоди',
        episodeLinks: [
          { title: 'Серія 1', url: '#' },
          { title: 'Серія 2', url: '#' }
        ]
      },
      {
        number: 2,
        year: 2005,
        episodes: 50,
        genre: 'Екшн, Комедія',
        episodeLinks: [
          { title: 'Серія 1', url: '#' },
          { title: 'Серія 2', url: '#' },
          { title: 'Серія 3', url: '#' }
        ]
      }
    ]
  },
  {
    id: 1,
    title: 'Наруто',
    description: `Сімнадцять років тому 17-річний дядько Такафумі впав у кому через те, що його збила вантажівка, але тепер він повернувся, як людина, що піднялася з могили.
Поки дядько мешкає разом із Такафумі, хлопець дізнається про його фантастичні пригоди й безмежну любов до ігор на SEGA. Але інколи історії дядька, часто сповнені самотності й жорстокості, викликають у Такафумі як радість, так і смуток.
Двоє чоловіків різних поколінь старанно працюють над створенням відеоконтенту в новій захопливій комедії про інший світ, дія якої відбувається в кутку багатоквартирного будинку.`,
    file_id: 'AgACAgIAAxkBAAMdaHPhVCvW8wVNcBTvS0fgdjUSJXsAAnT3MRvvwKBLAmOi_LCskpEBAAMCAAN5AAM2BA',
    seasons: [
      {
        number: 1,
        year: 2002,
        episodes: 220,
        genre: 'Екшн, Пригоди',
        episodeLinks: [
          { title: 'Серія 1', url: '#' },
          { title: 'Серія 2', url: '#' }
        ]
      },
      {
        number: 2,
        year: 2005,
        episodes: 50,
        genre: 'Екшн, Комедія',
        episodeLinks: [
          { title: 'Серія 1', url: '#' },
          { title: 'Серія 2', url: '#' },
          { title: 'Серія 3', url: '#' }
        ]
      }
    ]
  },
];

let currentPage = 1;

async function renderAnimePage(page) {
  const container = document.getElementById('animeContainer');
  const pagination = document.getElementById('pagination');
  container.innerHTML = '';
  pagination.innerHTML = '';

  const start = (page - 1) * MAX_PER_PAGE;
  const end = start + MAX_PER_PAGE;
  const visibleItems = animeList.slice(start, end);

  for (const anime of visibleItems) {
    let currentSeason = anime.seasons[0];

    const item = document.createElement('div');
    item.className = 'anime-item';

    const renderDetails = () => `
      <div class="dropdown">
        <div class="dropdown-header" onclick="this.parentNode.classList.toggle('open')">Сезони</div>
        <div class="dropdown-content">
          ${anime.seasons.map(s => `<a href="#" onclick="event.preventDefault(); switchSeason(${anime.id}, ${s.number})">Сезон ${s.number}</a>`).join('')}
        </div>
      </div>
      <div class="dropdown">
        <div class="dropdown-header" onclick="this.parentNode.classList.toggle('open')">Серії</div>
        <div class="dropdown-content" id="episodes-${anime.id}">
          ${currentSeason.episodeLinks.map(e => `<a href="${e.url}">${e.title}</a>`).join('')}
        </div>
      </div>
      <button class="collapse-btn">Згорнути</button>
    `;

    item.innerHTML = `
      <div class="anime-summary">
        <img src="http://localhost:8000/poster/${anime.file_id}" class="poster" alt="Poster">
        <div class="info">
          <div class="title">${anime.title}</div>
          <div class="description">${anime.description}</div>
        </div>
      </div>
      <div class="details" id="details-${anime.id}">
        <div class="meta" id="meta-${anime.id}">
          <div><strong>Жанр:</strong> ${currentSeason.genre}</div>
          <div><strong>Кількість серій:</strong> ${currentSeason.episodes}</div>
          <div><strong>Рік:</strong> ${currentSeason.year}</div>
        </div>
        ${renderDetails()}
      </div>
    `;

    item.querySelector('.anime-summary').addEventListener('click', () => {
      document.querySelectorAll('.anime-item.expanded').forEach(el => {
        if (el !== item) el.classList.remove('expanded');
      });
      item.classList.toggle('expanded');
    });

    item.querySelector('.collapse-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      item.classList.remove('expanded');
    });

    container.appendChild(item);
  }

  const totalPages = Math.ceil(animeList.length / MAX_PER_PAGE);
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = 'page-btn';
    if (i === page) btn.style.backgroundColor = '#444';
    btn.addEventListener('click', () => {
      currentPage = i;
      renderAnimePage(currentPage);
    });
    pagination.appendChild(btn);
  }
}

function switchSeason(animeId, seasonNumber) {
  const anime = animeList.find(a => a.id === animeId);
  const season = anime.seasons.find(s => s.number === seasonNumber);
  const metaBlock = document.getElementById(`meta-${animeId}`);
  const episodesBlock = document.getElementById(`episodes-${animeId}`);

  metaBlock.innerHTML = `
    <div><strong>Жанр:</strong> ${season.genre}</div>
    <div><strong>Кількість серій:</strong> ${season.episodes}</div>
    <div><strong>Рік:</strong> ${season.year}</div>
  `;

  episodesBlock.innerHTML = season.episodeLinks.map(e => `<a href="${e.url}">${e.title}</a>`).join('');
}

renderAnimePage(currentPage);
