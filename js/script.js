const global = {
  currentPage: window.location.pathname,
  search: {
    type: '',
    term: '',
    page: 1,
  },
  api: {
    apiKey: 'a8c6b8562cb3f14c24958ab98f97b910',
    apiUrl: 'https://api.themoviedb.org/3/',
  },
};

// Highlight tab
function highlightActiveLink() {
  const links = document.querySelectorAll('.nav-link');

  links.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    }
  });
}

// display now playing movies in slides
async function displayMovieSlides() {
  const { results } = await fetchAPIData('movie/now_playing');
  console.log(results);

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');

    div.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
              <img src="https://images.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
            </h4>
    `;

    document.querySelector('.swiper-wrapper').appendChild(div);
  });

  initSwiper();
}

// movie/tv search
async function search() {
  const queryString = window.location.search;
  console.log(queryString);
  const urlParams = new URLSearchParams(queryString);

  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');

  if (global.search.term !== '' && global.search.term !== null) {
    const result = await fetchSearchAPI();
    console.log(result);
  } else {
    showAlert('Please enter an search item', 'error');
  }
}

// show alert message
function showAlert(message, className) {
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert', className);
  alertEl.appendChild(document.createTextNode(message));

  document.querySelector('#alert').appendChild(alertEl);

  setTimeout(() => alertEl.remove(), 3000);
}

// initialise swiper library
function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 4,
      },
      1200: {
        slidesPerView: 5,
      },
    },
  });
}

// fetch popular movie to display in home page
async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular');

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
          <a href="/movie-details.html?id=${movie.id}">
         ${
           movie.poster_path
             ? `<img
              src="https://images.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt=${movie.title}
            />`
             : `<img
              src="images/no-image.jpg"
              class="card-img-top"
              alt=${movie.title}
            />`
         }
        
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">${movie.release_date}</small>
            </p>
          </div>
`;
    document.getElementById('popular-movies').appendChild(div);
  });
}

// fetch and display movie details
async function displayMovieDetails() {
  const movieId = window.location.search.split('=');

  const movie = await fetchAPIData(`movie/${movieId[1]}`);
  console.log(movie);

  displayBackgroundImage('movie', movie.backdrop_path);

  const div = document.createElement('div');
  div.innerHTML = `
  <div class="details-top">
          <div>
          ${
            movie.poster_path
              ? `<img
          src="https://images.tmdb.org/t/p/w500${movie.poster_path}"
          class="card-img-top"
          alt="${movie.title}"
        />`
              : ` <img
      src="images/no-image.jpg"
      class="card-img-top"
      alt="${movie.title}"
    />`
          }
            
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
            ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${
              movie.homepage
            }" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> ${
              movie.budget
                ? `${numberToCurrency(movie.budget)}`
                : `No data available`
            }</li>
            <li><span class="text-secondary">Revenue:</span> ${
              movie.revenue
                ? `${numberToCurrency(movie.revenue)}`
                : `No data available`
            } </li>
            <li><span class="text-secondary">Runtime:</span> ${
              movie.runtime
            } minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${
            movie.production_companies
              ? movie.production_companies
                  .map((comp) => `<span>${comp.name}</span>`)
                  .join(',')
              : `No data available`
          }</div>
        </div>`;

  // convert number to currency
  function numberToCurrency(n) {
    const dollar = n.toLocaleString('en-us', {
      style: 'currency',
      currency: 'USD',
    });

    return dollar;
  }
  document.querySelector('#movie-details').appendChild(div);
}

// fetch popular tv show to display in tv shows page
async function displayPopularShows() {
  const { results } = await fetchAPIData('tv/popular');
  console.log(results);

  results.forEach((show) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
  <a href="tv-details.html?id=${show.id}">
            ${
              show.poster_path
                ? `<img
              src="https://images.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
            />`
                : `<img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${show.name}"
            />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">${show.first_air_date}</small>
            </p>
          </div>
  `;

    document.getElementById('popular-shows').appendChild(div);
  });
}

async function displayShowDetails() {
  const showId = window.location.search.split('=');
  const show = await fetchAPIData(`tv/${showId[1]}`);
  console.log(show);

  displayBackgroundImage('show', `${show.backdrop_path}`);

  const div = document.createElement('div');
  div.innerHTML = `
  <div class="details-top">
          <div>
            ${
              show.poster_path
                ? `    <img
              src="https://images.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.original_name}"
            />`
                : `  <img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${show.original_name}"
            />`
            }
          </div>
          <div>
            <h2>${show.original_name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average} / 10
            </p>
            <p class="text-muted">Release Date: ${show.first_air_date}</p>
            <p>
                ${show.overview}
            </p>
            <h5>Genres</h5>
            ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            <a href="${
              show.homepage
            }" target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${
              show.number_of_episodes
            }</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${
                show.last_episode_to_air.air_date
              }
            </li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
          ${show.production_companies
            .map((company) => `<span>${company.name}</span>`)
            .join(', ')}
          </div>
        </div>`;

  document.querySelector('#show-details').appendChild(div);
}

// display background image
function displayBackgroundImage(type, path) {
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `url(https://images.tmdb.org/t/p/original/${path})`;
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.2';

  if (type === 'movie') {
    console.log(document.querySelector('#movie-details'));
    document.querySelector('#movie-details').appendChild(overlayDiv);
  } else {
    document.querySelector('#show-details').appendChild(overlayDiv);
  }
}

// fetch search api data
async function fetchSearchAPI() {
  const api_key = global.api.apiKey;
  const api_url = global.api.apiUrl;

  showSpinner();

  const response = await fetch(
    `${api_url}search/${global.search.type}?api_key=${api_key}&language=en-US&query=${global.search.term}`
  );

  const data = await response.json();

  hideSpinner();

  return data
}
// fetch api for TMDB
async function fetchAPIData(endpoint) {
  const api_key = global.api.apiKey;
  const api_url = global.api.apiUrl;

  showSpinner();

  const response = await fetch(
    `${api_url}${endpoint}?api_key=${api_key}&language=en-US`
  );

  const data = await response.json();

  hideSpinner();

  return data;
}

// show spinner
function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

// hide spinner
function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

// Initialize the app
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      displayPopularMovies();
      displayMovieSlides();
      break;
    case '/shows.html':
      displayPopularShows();
      break;
    case '/movie-details.html':
      displayMovieDetails();
      break;
    case '/tv-details.html':
      displayShowDetails();
      break;
    case '/search.html':
      search();
      break;
  }

  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
