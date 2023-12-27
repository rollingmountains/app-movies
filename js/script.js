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
              alt="Movie Title"
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

// fetch api for TMDB
async function fetchAPIData(endpoint) {
  const api_key = 'a8c6b8562cb3f14c24958ab98f97b910';
  const api_url = 'https://api.themoviedb.org/3/';

  const response = await fetch(
    `${api_url}${endpoint}?api_key=${api_key}&language=en-US`
  );

  const data = await response.json();

  return data;
}

// Initialize the app
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      displayPopularMovies();
      break;
    case '/shows.html':
      console.log('Shows');
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
