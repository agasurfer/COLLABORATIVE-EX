//VARIABLES
const apiKey = 'e50596e06f08ff0f93d070c9e32d65a0';



//DOM VARIABLES
const searchButton = document.querySelector(".search-button");
const input = document.querySelector(".search-input");
const message = document.querySelector(".result-text");
const comedyBtn = document.querySelector(".comedy")
const dramaBtn = document.querySelector(".drama")
const actionBtn = document.querySelector(".action")
const romanceBtn = document.querySelector(".romance")
const fantasyBtn = document.querySelector(".fantasy")
const animationBtn = document.querySelector(".animation")
const popUp = document.querySelector(".popup")
const loginForm = document.querySelector(".login");
const swSlide = document.querySelector(".swiper-slide");
const loginBtn = document.querySelector(".login-btn");
const submitBtn = document.querySelector("#loginForm button");


//EVENT LISTENERS
searchButton.addEventListener("click", () => {
    const query = document.querySelector(".search-input").value
    fetchFilm(query);
    clearSearch();
});

input.addEventListener('keypress',(event) => {
    if (event.key === "Enter") {
        const query = document.querySelector(".search-input").value;
    fetchFilm(query);
    clearSearch();
    
    }
})

loginBtn.addEventListener('click', ()=> {
    loginForm.style.display = "block"

     submitBtn.addEventListener('click', () => {
    loginForm.style.display ="none"
})
});

comedyBtn.addEventListener("click", () => fetchMoviesByGenre("comedy"));
dramaBtn.addEventListener("click", () => fetchMoviesByGenre("drama"));
actionBtn.addEventListener("click", () => fetchMoviesByGenre("action"));
romanceBtn.addEventListener("click", () => fetchMoviesByGenre("romance"));
fantasyBtn.addEventListener("click", () => fetchMoviesByGenre("fantasy"));
animationBtn.addEventListener("click", () => fetchMoviesByGenre("animation"));



// ASYNC FUNCTION THAT FETCHES A MOVIE BY INPUT

// ASYNC FUNCTION THAT FETCHES A MOVIE BY INPUT
let fetchFilm = async (query) => {
    if (!query || query === "")
        return;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
    const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;

    try {
        // Fetch the list of genres
        const genreResponse = await fetch(genreUrl);
        const genreData = await genreResponse.json();

        // Create a map of genre ID to genre name
        const genreMap = {};
        genreData.genres.forEach((genre) => {
            genreMap[genre.id] = genre.name;
        });
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

        // Function to fetch credits
        const fetchCredits = async (movieId) => {
            const creditUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`;

            try { 
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

        if (data.results && data.results.length > 0) {
            // Clear existing slides
            const swiperWrapper = document.querySelector(".swiper-wrapper");
            swiperWrapper.innerHTML = '';
             message.innerText = `These are the results for "${query}"`

            // Loop through the movie results and create slides
            data.results.forEach((movie) => {
                if (movie.poster_path) { // Check if poster is available
                    const slide = document.createElement("div");
                    slide.classList.add("swiper-slide", "movie-card");

                    // Create image element for the movie poster
                    const img = document.createElement("img");
                    img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                    img.alt = `${movie.title} Poster`;

                    // Overlay content
                    const overlay = document.createElement("div");
                    overlay.classList.add("movie-info");

                    // Synopsis
                    const overview = document.createElement("p");
                    overview.innerText = movie.overview;

                    // Movie title
                    const title = document.createElement("h3");
                    title.textContent = movie.title;

                    // Release year
                    const year = document.createElement("p");
                    year.textContent = `${new Date(movie.release_date).getFullYear()}`;

                    // Genres
                    const styles = document.createElement("p");
                    if (movie.genre_ids && movie.genre_ids.length > 0) {
                        const genreNames = movie.genre_ids.map((id) => genreMap[id] || "Unknown").join(", ");
                        styles.textContent = genreNames;
                    } else {
                        styles.textContent = "Genres: N/A";
                    }
    
                    // IMDb rating
                    const rating = document.createElement("h2");
                    rating.innerHTML = "<img src='Vector.png'> <br><br>" + `${movie.vote_average || "N/A"}`;

                    // POPUP EVENTLISTENER
                    slide.addEventListener('click', async () => {
                        popUp.style.display = "block";

                        // Clear previous popup content
                        popUp.innerHTML = ''; 

                        const cast = await fetchCredits(movie.id);

                        // Create content div
                        const popUpContent = document.createElement("div");
                        popUpContent.classList.add("popup-content");

                        // Create info div
                        const popUpInfo = document.createElement("div");
                        popUpInfo.classList.add("movie-info-popup");

                        // Image create
                        const popUpImg = document.createElement("img");
                        popUpImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                        popUpImg.alt = `${movie.title} Poster`;

                        // Add title year and genres
                        const popUpTitle = document.createElement("h3");
                        popUpTitle.textContent = movie.title;

                        const popUpYear = document.createElement("p");
                        popUpYear.textContent = `${new Date(movie.release_date).getFullYear()}`;

                        const popUpStyles = document.createElement("p");
                        if (movie.genre_ids && movie.genre_ids.length > 0) {
                            const genreNames = movie.genre_ids.map((id) => genreMap[id] || "Unknown").join(", ");
                            popUpStyles.textContent = `${genreNames}`;
                        } else {
                            popUpStyles.textContent = "Genres: N/A";
                        }

                        const popUpRating = document.createElement("h2");
                        popUpRating.innerHTML = "<img src='Vector.png'>" + ` ${movie.vote_average || "N/A"}`;

                        // Create and append cast element
                        const castElement = document.createElement("p");
                        castElement.textContent = `Cast: ${cast}`;

                        // Append the infos
                        popUpInfo.appendChild(popUpTitle);
                        popUpInfo.appendChild(popUpYear);
                        popUpInfo.appendChild(popUpRating);
                        popUpInfo.appendChild(popUpStyles);
                        popUpInfo.appendChild(overview);
                        popUpInfo.appendChild(castElement);

                        // Adds image and infos
                        popUpContent.appendChild(popUpImg);
                        popUpContent.appendChild(popUpInfo);

                        // add to pop up
                        popUp.appendChild(popUpContent);
                    });

                    // Append all movie info to overlay
                    overlay.appendChild(title);
                    overlay.appendChild(year);
                    overlay.appendChild(styles);
                    overlay.appendChild(rating);

                    // Append image to slide
                    slide.appendChild(img);
                    slide.appendChild(overlay)

                    // Add slide to the swiper wrapper
                    swiperWrapper.appendChild(slide);
                }
            });
        }
        else {
            message.innerText = `There are no results for "${query}"`
        }
    } catch (error) {
        console.error("Error fetching movie data:", error);
    }
};


// ASYNC FUNCTION THAT FETCHES LATEST RELEASES
let fetchLatestReleases = async () => {
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`;
    const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;

    try {
        // Fetch the list of genres
        const genreResponse = await fetch(genreUrl);
        const genreData = await genreResponse.json();

        // Create a map of genre ID to genre name
        const genreMap = {};
        genreData.genres.forEach((genre) => {
            genreMap[genre.id] = genre.name;
        });
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            // Clear existing slides
            const swiperWrapperReleases = document.querySelector(".latest-swiper .swiper-wrapper");
            swiperWrapperReleases.innerHTML = '';

            // Loop through the movie results and create slides
            data.results.forEach((movie) => {
                if (movie.poster_path) { // Check if poster is available
                    const slide = document.createElement("div");
                    slide.classList.add("swiper-slide", "movie-card");

                    // Fetch credits function moved inside the loop
                    const fetchCredits = async (movieId) => {
                        const creditUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`;

                        try { 
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

                    // Create image element for the movie poster
                    const img = document.createElement("img");
                    img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                    img.alt = `${movie.title} Poster`;

                    // Overlay content
                    const overlay = document.createElement("div");
                    overlay.classList.add("movie-info");

                    // Synopsis
                    const overview = document.createElement("p");
                    overview.innerText = movie.overview;

                    // Movie title
                    const title = document.createElement("h3");
                    title.textContent = movie.title;

                    // Release year
                    const year = document.createElement("p");
                    year.textContent = `${new Date(movie.release_date).getFullYear()}`;

                    // Genres
                    const styles = document.createElement("p");
                    if (movie.genre_ids && movie.genre_ids.length > 0) {
                        const genreNames = movie.genre_ids.map((id) => genreMap[id] || "Unknown").join(", ");
                        styles.textContent = genreNames;
                    } else {
                        styles.textContent = "Genres: N/A";
                    }
                    
                    // IMDb rating
                    const rating = document.createElement("h2");
                    rating.innerHTML = "<img src='Vector.png'> <br><br>" + `${movie.vote_average || "N/A"}`;

                    // POPUP EVENTLISTENER
                    slide.addEventListener('click', async () => {
                        popUp.style.display = "block";

                        // Clear previous popup content
                        popUp.innerHTML = ''; 

                        const cast = await fetchCredits(movie.id);

                        // Create content div
                        const popUpContent = document.createElement("div");
                        popUpContent.classList.add("popup-content");

                        // Create info div
                        const popUpInfo = document.createElement("div");
                        popUpInfo.classList.add("movie-info-popup");

                        // Image create
                        const popUpImg = document.createElement("img");
                        popUpImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                        popUpImg.alt = `${movie.title} Poster`;

                        // Add title year and genres
                        const popUpTitle = document.createElement("h3");
                        popUpTitle.textContent = movie.title;

                        const popUpYear = document.createElement("p");
                        popUpYear.textContent = `${new Date(movie.release_date).getFullYear()}`;

                        const popUpStyles = document.createElement("p");
                        if (movie.genre_ids && movie.genre_ids.length > 0) {
                            const genreNames = movie.genre_ids.map((id) => genreMap[id] || "Unknown").join(", ");
                            popUpStyles.textContent = `${genreNames}`;
                        } else {
                            popUpStyles.textContent = "Genres: N/A";
                        }

                        const popUpRating = document.createElement("h2");
                        popUpRating.innerHTML = "<img src='Vector.png'>" + ` ${movie.vote_average || "N/A"}`;

                        // Append the infos
                        popUpInfo.appendChild(popUpTitle);
                        popUpInfo.appendChild(popUpYear);
                        popUpInfo.appendChild(popUpRating);
                        popUpInfo.appendChild(popUpStyles);
                        popUpInfo.appendChild(overview)
                        
                        // Create and append cast element
                        const castElement = document.createElement("p");
                        castElement.textContent = `Cast: ${cast}`;
                        popUpInfo.appendChild(castElement);

                        // Adds image and infos
                        popUpContent.appendChild(popUpImg);
                        popUpContent.appendChild(popUpInfo);

                        // add to pop up
                        popUp.appendChild(popUpContent);
                    });

                    // Append all movie info to overlay
                    overlay.appendChild(title);
                    overlay.appendChild(year);
                    overlay.appendChild(styles);
                    overlay.appendChild(rating);

                    // Append image and release date to slide
                    slide.appendChild(img);
                    slide.appendChild(overlay);

                    // Add slide to the swiper wrapper
                    swiperWrapperReleases.appendChild(slide);
                }
            });
        }
    } catch (error) {
        console.error("Error fetching movie data:", error);
    }
};

// Call the function to fetch the latest movie releases
fetchLatestReleases();

// ASYNC FUCTION THAT FETCHES MOVIES BY GENRES

let fetchMoviesByGenre = async (genre) => {
    let genreId;
    switch (genre) {
        case 'comedy':
            genreId = 35;
            break;
        case 'drama':
            genreId = 18;
            break;
        case 'action':
            genreId = 28;
            break;
        case 'romance':
            genreId = 10749;
            break;
        case 'fantasy':
            genreId = 14;
            break;
        case 'animation':
            genreId = 16;
            break;
        default:
            console.error('Invalid genre');
            return;
    }
  
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&language=en-US&page=1&region=US`;
    const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;

    try {
        // Fetch the list of genres
        const genreResponse = await fetch(genreUrl);
        const genreData = await genreResponse.json();

        // Create a map of genre ID to genre name
        const genreMap = {};
        genreData.genres.forEach((genre) => {
            genreMap[genre.id] = genre.name;
        });
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

        // Function to fetch credits
        const fetchCredits = async (movieId) => {
            const creditUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`;

            try { 
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

        if (data.results && data.results.length > 0) {
            // Clear existing slides
            const swiperWrapperGenre = document.querySelector(".genre-swiper .swiper-wrapper");
            swiperWrapperGenre.innerHTML = '';

            // Loop through the movie results and create slides
            data.results.forEach((movie) => {
                if (movie.poster_path) { // Check if poster is available
                    const slide = document.createElement("div");
                    slide.classList.add("swiper-slide", "movie-card");

                    // Create image element for the movie poster
                    const img = document.createElement("img");
                    img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                    img.alt = `${movie.title} Poster`;

                    // Overlay content
                    const overlay = document.createElement("div");
                    overlay.classList.add("movie-info");

                    // Synopsis
                    const overview = document.createElement("p");
                    overview.innerText = movie.overview;

                    // Movie title
                    const title = document.createElement("h3");
                    title.textContent = movie.title;

                    // Release year
                    const year = document.createElement("p");
                    year.textContent = `${new Date(movie.release_date).getFullYear()}`;

                    // Genres
                    const styles = document.createElement("p");
                    if (movie.genre_ids && movie.genre_ids.length > 0) {
                        const genreNames = movie.genre_ids.map((id) => genreMap[id] || "Unknown").join(", ");
                        styles.textContent = genreNames;
                    } else {
                        styles.textContent = "Genres: N/A";
                    }
    
                    // IMDb rating
                    const rating = document.createElement("h2");
                    rating.innerHTML = "<img src='Vector.png'> <br><br>" + `${movie.vote_average || "N/A"}`;

                    // POPUP EVENTLISTENER
                    slide.addEventListener('click', async () => {
                        popUp.style.display = "block";

                        // Clear previous popup content
                        popUp.innerHTML = ''; 

                        const cast = await fetchCredits(movie.id);

                        // Create content div
                        const popUpContent = document.createElement("div");
                        popUpContent.classList.add("popup-content");

                        // Create info div
                        const popUpInfo = document.createElement("div");
                        popUpInfo.classList.add("movie-info-popup");

                        // Image create
                        const popUpImg = document.createElement("img");
                        popUpImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                        popUpImg.alt = `${movie.title} Poster`;

                        // Add title year and genres
                        const popUpTitle = document.createElement("h3");
                        popUpTitle.textContent = movie.title;

                        const popUpYear = document.createElement("p");
                        popUpYear.textContent = `${new Date(movie.release_date).getFullYear()}`;

                        const popUpStyles = document.createElement("p");
                        if (movie.genre_ids && movie.genre_ids.length > 0) {
                            const genreNames = movie.genre_ids.map((id) => genreMap[id] || "Unknown").join(", ");
                            popUpStyles.textContent = `${genreNames}`;
                        } else {
                            popUpStyles.textContent = "Genres: N/A";
                        }

                        const popUpRating = document.createElement("h2");
                        popUpRating.innerHTML = "<img src='Vector.png'>" + ` ${movie.vote_average || "N/A"}`;

                        // Create and append cast element
                        const castElement = document.createElement("p");
                        castElement.textContent = `Cast: ${cast}`;

                        // Append the infos
                        popUpInfo.appendChild(popUpTitle);
                        popUpInfo.appendChild(popUpYear);
                        popUpInfo.appendChild(popUpRating);
                        popUpInfo.appendChild(popUpStyles);
                        popUpInfo.appendChild(overview);
                        popUpInfo.appendChild(castElement);

                        // Adds image and infos
                        popUpContent.appendChild(popUpImg);
                        popUpContent.appendChild(popUpInfo);

                        // add to pop up
                        popUp.appendChild(popUpContent);
                    });

                    // Append all movie info to overlay
                    overlay.appendChild(title);
                    overlay.appendChild(year);
                    overlay.appendChild(styles);
                    overlay.appendChild(rating);

                    // Append image and release date to slide
                    slide.appendChild(img);
                    slide.appendChild(overlay);

                    // Add slide to the swiper wrapper
                    swiperWrapperGenre.appendChild(slide);
                }
            });
        }
    } catch (error) {
        console.error("Error fetching movie data:", error);
    }
};


        



// SWIPER HANDELING

//SWIPER RESULT
const swiper = new Swiper('.results-swiper', {
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
   /*  loop: true, */
    preventClicks: false,
    spaceBetween: 10,
    watchOverflow: true,
    simulateTouch: true,
    slidesPerView: 4,
});

//SWIPER LATEST RELEASES

const swiperRealease = new Swiper('.latest-swiper', {
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    /* loop: true, */
    preventClicks: false,
    spaceBetween: 10,
    watchOverflow: true,
    simulateTouch: true,
    slidesPerView: 4,
});

//SWIPER GENRES
const genreSwiper = new Swiper('.genre-swiper', {
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                /* loop: true, */
                preventClicks: false,
                spaceBetween: 10,
                watchOverflow: true,
                simulateTouch: true,
                slidesPerView: 4,
})

//FUNCTION THAT CLEARS THE SEARCHBAR
const clearSearch = () => {
    document.querySelector(".search-input").value = "";
};

//POUBELLE TEST

/* let fetchCredits = async () => {
    const creditUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=e50596e06f08ff0f93d070c9e32d65a0`

    try { 
    const creditResponse = await fetch(creditUrl)
    const creditData = await creditResponse.json()
    console.log(creditData);
    }

    catch (error) {
        console.error("Error fetching movie data:", error);
    }
    
} */

