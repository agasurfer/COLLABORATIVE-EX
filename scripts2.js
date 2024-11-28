//VARIABLES
const apiKey = 'e50596e06f08ff0f93d070c9e32d65a0';

//DOM VARIABLES
const searchButton = document.querySelector(".search-button");
const input = document.querySelector(".search-input");
const message = document.querySelector(".result-text");
const popUp = document.querySelector(".popup");
const loginForm = document.querySelector(".login");
const loginBtn = document.querySelector(".login-btn");
const submitBtn = document.querySelector("#loginForm button");
const cross = document.querySelector(".close-pop")


// Genre Buttons
const genreButtons = {
    'comedy': document.querySelector(".comedy"),
    'drama': document.querySelector(".drama"),
    'action': document.querySelector(".action"),
    'romance': document.querySelector(".romance"),
    'fantasy': document.querySelector(".fantasy"),
    'animation': document.querySelector(".animation")
};

// Genre ID Map
const GENRE_IDS = {
    'comedy': 35,
    'drama': 18,
    'action': 28,
    'romance': 10749,
    'fantasy': 14,
    'animation': 16
};

// Utility Functions
async function fetchGenreMap(apiKey) {
    const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;
    const genreResponse = await fetch(genreUrl);
    const genreData = await genreResponse.json();
    
    const genreMap = {};
    genreData.genres.forEach((genre) => {
        genreMap[genre.id] = genre.name;
    });
    return genreMap;
}

async function fetchMovieCredits(movieId, apiKey) {
    try { 
        const creditUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`;
        const creditResponse = await fetch(creditUrl);
        const creditData = await creditResponse.json();

        const castList = creditData.cast
            .slice(0, 4)
            .map(actor => actor.name);

        return castList.join(", ") || "Cast not available"; 
    }
    catch (error) {
        console.error("Error fetching movie credits:", error);
        return "Cast not available";
    }
}

function createMovieSlide(movie, genreMap, apiKey) {
    if (!movie.poster_path) return null;

    const slide = document.createElement("div");
    slide.classList.add("swiper-slide", "movie-card");

    const img = document.createElement("img");
    img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    img.alt = `${movie.title} Poster`;

    const overlay = document.createElement("div");
    overlay.classList.add("movie-info");

    const overview = document.createElement("p");
    overview.innerText = movie.overview;

    const title = document.createElement("h3");
    title.textContent = movie.title;

    const year = document.createElement("p");
    year.textContent = `${new Date(movie.release_date).getFullYear()}`;

    const styles = document.createElement("p");
    if (movie.genre_ids && movie.genre_ids.length > 0) {
        const genreNames = movie.genre_ids.map((id) => genreMap[id] || "Unknown").join("/ ");
        styles.textContent = genreNames;
    } else {
        styles.textContent = "Genres: N/A";
    }

    const rating = document.createElement("h2");
    rating.innerHTML = "<img src='Vector.png'> <br><br>" + `${movie.vote_average || "N/A"}`;

    slide.addEventListener('click', async () => {
        popUp.style.display = "block";
        popUp.innerHTML = ''; 
    





        const cast = await fetchMovieCredits(movie.id, apiKey);

        const closePop = document.createElement("div");
        closePop.classList.add("close-pop");
        closePop.innerHTML = "&times;"

        const popUpContent = document.createElement("div");
        popUpContent.classList.add("popup-content");

        const popUpInfo = document.createElement("div");
        popUpInfo.classList.add("movie-info-popup");

        const popUpImg = document.createElement("img");
        popUpImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        popUpImg.alt = `${movie.title} Poster`;

        const popUpTitle = document.createElement("h3");
        popUpTitle.textContent = movie.title;

        const popUpYear = document.createElement("p");
        popUpYear.textContent = `${new Date(movie.release_date).getFullYear()}`;

        const popUpStyles = document.createElement("p");
        if (movie.genre_ids && movie.genre_ids.length > 0) {
            const genreNames = movie.genre_ids.map((id) => genreMap[id] || "Unknown").join("/ ");
            popUpStyles.textContent = `${genreNames}`;
        } else {
            popUpStyles.textContent = "Genres: N/A";
        }

        const popUpRating = document.createElement("h2");
        popUpRating.innerHTML = "<img src='Vector.png'>" + ` ${movie.vote_average || "N/A"}`;

        const castElement = document.createElement("p");
        castElement.textContent = `Cast: ${cast}`;

  

        popUpInfo.append(popUpTitle, popUpYear, popUpRating, popUpStyles, overview, castElement);
        popUpContent.append(popUpImg, popUpInfo);
        popUp.appendChild(closePop)
        popUp.appendChild(popUpContent);

        //Event Listener to close popup

        document.addEventListener("click", (event) => {
    if (event.target.classList.contains("close-pop")) {
        popUp.style.display = "none";
    }
});

  
    });





    overlay.append(title, year, styles, rating);
    slide.append(img, overlay);

    return slide;
}



async function fetchMovies(url, swiperSelector, messageText = '') {
    try {
        const genreMap = await fetchGenreMap(apiKey);
        const response = await fetch(url);
        const data = await response.json();

        const swiperWrapper = document.querySelector(swiperSelector);
        swiperWrapper.innerHTML = '';

        if (data.results && data.results.length > 0) {
            if (messageText) message.innerText = messageText;

            data.results.forEach((movie) => {
                const slide = createMovieSlide(movie, genreMap, apiKey);
                if (slide) swiperWrapper.appendChild(slide);
            });
        } else if (messageText) {
            message.innerText = "No results found";
        }
    } catch (error) {
        console.error("Error fetching movie data:", error);
    }
}

// Search Function
async function fetchFilm(query) {
    if (!query || query.trim() === "") return;
    
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
    await fetchMovies(url, '.swiper-wrapper', `These are the results for "${query}"`);
}

// Latest Releases Function
async function fetchLatestReleases() {
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`;
    await fetchMovies(url, '.latest-swiper .swiper-wrapper');
}

// Genre Movies Function
async function fetchMoviesByGenre(genre) {
    const genreId = GENRE_IDS[genre];
    if (!genreId) {
        console.error('Invalid genre');
        return;
    }
    
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&language=en-US&page=1&region=US`;
    await fetchMovies(url, '.genre-swiper .swiper-wrapper');
}

// Event Listeners
searchButton.addEventListener("click", () => {
    fetchFilm(input.value);
    input.value = "";
});

input.addEventListener('keypress', (event) => {
    if (event.key === "Enter") {
        fetchFilm(input.value);
        input.value = "";
    }
});

loginBtn.addEventListener('click', () => {
    loginForm.style.display = "block";
    submitBtn.addEventListener('click', () => {
        loginForm.style.display = "none";
    });
});

// Add event listeners for genre buttons
Object.entries(genreButtons).forEach(([genre, button]) => {
    button.addEventListener("click", () => fetchMoviesByGenre(genre));
});



// Initialize Latest Releases on Page Load
fetchLatestReleases();
fetchMoviesByGenre('comedy');

// Swiper Initialization
const swiperOptions = {
   /*  navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    }, */
    preventClicks: false,
    spaceBetween: 10,
    watchOverflow: true,
    simulateTouch: true,
    slidesPerView: 4,
};

new Swiper('.results-swiper', swiperOptions);
new Swiper('.latest-swiper', swiperOptions);
new Swiper('.genre-swiper', swiperOptions);