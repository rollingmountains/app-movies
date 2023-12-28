const global = {
  currentPage: window.location.pathname,
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
    overlayDiv.style.opacity = '0.1';

    if (type === 'movie') {
      console.log(document.querySelector('#movie-details'));
      document.querySelector('#movie-details').appendChild(overlayDiv);
      
    } else {
      document.querySelector('#show-details').appendChild(overlayDiv);
    }
  }

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

// fetch api for TMDB
async function fetchAPIData(endpoint) {
  const api_key = 'a8c6b8562cb3f14c24958ab98f97b910';
  const api_url = 'https://api.themoviedb.org/3/';

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
      break;
    case '/shows.html':
      displayPopularShows();
      break;
    case '/movie-details.html':
      displayMovieDetails();
      break;
    case '/tv-details.html':
      console.log('Tv show details');
      break;
    case '/search.html':
      console.log('Search');
      break;
  }

  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
