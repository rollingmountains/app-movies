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
          <a href="/movie-details.html?id=1">
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

// fetch popular tv show to display in tv shows page
async function displayPopularShows() {
  const { results } = await fetchAPIData('tv/popular');
  console.log(results);

  results.forEach((show) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
  <a href="tv-details.html?id=1">
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
      console.log('Movie Details');
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
