let imgPath = `https://image.tmdb.org/t/p/w500`;
let totalPage = 0;
let currentPage = 1;

async function getMovieList() {
    const urlParams = new URLSearchParams(window.location.search);
    const genre = urlParams.get('genre') || 18;
    const API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=03f3fa53ab9f0b658cf37093aba68e8c&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${currentPage}&with_genres=${genre}`;
    console.log(genre);
    const conn = await fetch(API_URL);
    const data = await conn.json();


    // const results = data.results;
    
    let movieList = document.getElementById("movie_list");
    // console.log(data);

    totalPage = data.total_pages;

    movieList.textContent = '';
    
    for(i = 0; i < 20; i++) {
        const result = data.results[i];
        const title = result.title;
        const overview = result.overview;
        const posterPath = result.poster_path;

        movieList.insertAdjacentHTML('beforeend', `
            <div>
                <div>${title}</div>
                <div>${overview}</div>
                <img src="${imgPath + '/' + posterPath}" >
            </div>
        `);
    };
}

function setupEvents() {
    let next = document.getElementById("next");
    next.addEventListener("click", async function() {
        currentPage++;
        await getMovieList();
    });
    // next => click => tang currentPage => getMovieList();
};
setupEvents();
getMovieList();