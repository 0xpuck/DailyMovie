console.log("chay thu");


let apiKey = 'f76721155e447dcac0661690313beb95';
let url = 'https://api.themoviedb.org/3';
let discoverMovie = `${url}/discover/movie`;
let imgPath = `https://image.tmdb.org/t/p/w500`;
let movie_url = `https://api.themoviedb.org/3/movie/?api_key=&language=en-US`;
let trailer_path =`https://api.themoviedb.org/3/movie//videos?api_key=03f3fa53ab9f0b658cf37093aba68e8c`;


let loading_page = document.getElementById("loading_page");
let movie_randomed_page = document.getElementById("movie_randomed_page");
let button = document.getElementsByClassName("btn");
let main = document.getElementById("main");
let titleDisplay = document.getElementById("titleContent");
let overviewDisplay = document.getElementById("content-overview");
let popularityDisplay = document.getElementById("popularitySpan2");
let genresDisplay = document.getElementById("genresDisplay");
let runtimeDisplay = document.getElementById("runtimeDisplaySpan2");
let releaseDateDisplay = document.getElementById("releaseDateDisplaySpan2");
let poster_image = document.getElementById("poster_image");
let background_image = document.getElementById("background-image");
let list_genres = document.getElementById("list-genres"); 
let trailer_div = document.getElementById("ytbTrailer");
let randomAgainButton = document.getElementById("randomAgainButton");
let selectButton = document.getElementById("select");
let hompage_button = document.getElementById("homepageButton");

let logoGoogle = document.getElementById("logoGoogle");
let logoNetflix = document.getElementById("logoNetflix");
let logoPhimmoi = document.getElementById("logoPhimmoi");



movie_randomed_page.style.display = "none";
loading_page.style.display = "none";

function showLoading() {
    loading_page.style.display = "flex";
}

function hideLoading() {
    loading_page.style.display ="none";
}

function hideMain() {
    main.style.display = "none";
}

const EARLIEST_POSSIBLE_DATE = new Date("1888/01/01");
const LATEST_POSSIBLE_DATE = new Date("3000/01/01");

function getDateRange() {
  const earliest = document.getElementById("earliest-date").value;
  const latest = document.getElementById("latest-date").value;
  const earliestDate = new Date(earliest);
  const latestDate = new Date(latest);
  return [
    isNaN(earliestDate) ? EARLIEST_POSSIBLE_DATE : earliestDate,
    isNaN(latestDate) ? LATEST_POSSIBLE_DATE : latestDate,
  ];
}

function formattedDate(date) {
  const toPart = (options) => date.toLocaleDateString("en-US", options);
  const year = toPart({ year: "numeric" });
  const month = toPart({ month: "2-digit" });
  const day = toPart({ day: "2-digit" });
  return `${year}-${month}-${day}`;
}

function makeGenreFetchUrl(genre, pageNumber) {
  const [earliest, latest] = getDateRange();
  const params = new URLSearchParams([
    ["api_key", apiKey],
    ["language", "en-US"],
    ["sort_by", "popularity.desc"],
    ["include_adult", false],
    ["include_video", false],
    ["page", pageNumber],
    ["primary_release_date.gte", formattedDate(earliest)],
    ["primary_release_date.lte", formattedDate(latest)],
  ]);

  if (genre) {
    params.set("with_genres", genre);
  }

  return params.toString();
}

async function getGenres() {
    let genresRequest = await fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=03f3fa53ab9f0b658cf37093aba68e8c&language=en-US");
    let genresList = await genresRequest.json();
    console.log(genresList.genres.length);
    for (i=0; i < genresList.genres.length; i++) {
        optionValue = `<option value="&with_genres=${genresList.genres[i]["id"]}">${genresList.genres[i]["name"]}</option>`
        selectButton.insertAdjacentHTML('beforeend', optionValue);
    };
    styleButtonSelect();
}

getGenres();

async function APIkey(genre, year) {

    let genreParam = "";
    //1
    if(genre) {
        genreParam = `&with_genres=${genre}`;
//        console.log('Genre: ' + genre);
    };


    let yearParam = "";
    if(year) {
        yearParam = `&primary_release_year=${year}`;
    };

    console.log(year);
    showLoading();

  let pageNumber = Math.floor(Math.random() * 500) + 1;
  let filmNumber = Math.floor(Math.random() * 20);

  const results = await fetch(
    discoverMovie + "?" + makeGenreFetchUrl(genre, pageNumber)
  );
  const dataDiscoverMovie = await results.json();
  if (dataDiscoverMovie["results"].length === 0) {
    hideLoading();
    return;
  }

    let movieId = dataDiscoverMovie["results"][filmNumber]["id"];
    movie_url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;

    let trailer_link = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=03f3fa53ab9f0b658cf37093aba68e8c`;
    let trailerRequest = await fetch(trailer_link);
    let trailer_detail = await trailerRequest.json();
    if (trailer_detail["results"].length > 0) {
        let ytb_key = trailer_detail["results"][0]["key"];
        let ytb_embed_link = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${ytb_key}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        trailer_div.innerHTML = ytb_embed_link;

    };
    

    let requestDetail = await fetch(movie_url);
    let movie_detail_data = await requestDetail.json();
    let movie_title = movie_detail_data["title"];
    let movie_overview = movie_detail_data["overview"];
    let movie_runtime = `${movie_detail_data["runtime"]} minutes`;
    let movie_release_date = movie_detail_data["release_date"];
    let img_link = movie_detail_data["poster_path"];
    let img_url = `${imgPath}${img_link}`;
        poster_image.src = `${img_url}`;
        background_image.style.backgroundImage = `url(${img_url})`;
    let movie_popularity = movie_detail_data["popularity"];
    let movie_genres_container = movie_detail_data["genres"];
    let movie_genres = [];
    let movie_codes =  [];
    for (i=0; i < movie_genres_container.length ; i++) {
        movie_genres.push(movie_genres_container[i].name);
        movie_codes.push(movie_genres_container[i].id);
    };
    list_genres.textContent = "";
    for (i=0; i < movie_genres.length ; i++) {
        let template = `
        <div class="each-genres" onclick="APIkey(${movie_codes[i]})">
            <p>${movie_genres[i]}</p>
        </div>
                        `;
        list_genres.insertAdjacentHTML('beforeend', template);
    };
    

    titleDisplay.textContent =`${movie_title}`;
    overviewDisplay.textContent = `${movie_overview}`;
    popularityDisplay.textContent = `${movie_popularity}`;
    runtimeDisplay.textContent = `${movie_runtime}`;
    releaseDateDisplay.textContent = `${movie_release_date}`;


    hideLoading();

    hideMain();
    
    movie_randomed_page.style.display = "block";

    let searchValue = movie_title.replace(" ", "+");
    logoGoogle.setAttribute('href', `https://www.google.com.vn/search?q=${searchValue}`);
    logoPhimmoi.setAttribute('href', `http://www.phimmoi.net/tim-kiem/${searchValue}/` );
    logoNetflix.setAttribute('href', `https://www.netflix.com/search?q=${searchValue}`);
    calculateLoadingHeight();
};

button[0].addEventListener('click', function() {
    APIkey()
});

randomAgainButton.addEventListener('click', () => APIkey());


function calculateLoadingHeight() {
    let height = document.documentElement.scrollHeight;
    console.log(height);
    loading_page.style.height = height + 'px';
}

function styleButtonSelect() {
    let x, i, j, selElmnt, a, b, c;
    x = document.getElementsByClassName("custom-select");
    for (i = 0; i < x.length; i++) {
      selElmnt = x[i].getElementsByTagName("select")[0];
      a = document.createElement("DIV");
      a.setAttribute("class", "select-selected");
      a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
      x[i].appendChild(a);
      b = document.createElement("DIV");
      b.setAttribute("class", "select-items select-hide");
      for (j = 1; j < selElmnt.length; j++) {
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function(e) {
            let y, i, k, s, h;
            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
            h = this.parentNode.previousSibling;
            for (i = 0; i < s.length; i++) {
              if (s.options[i].innerHTML == this.innerHTML) {
                s.selectedIndex = i;
                h.innerHTML = this.innerHTML;
                y = this.parentNode.getElementsByClassName("same-as-selected");
                for (k = 0; k < y.length; k++) {
                  y[k].removeAttribute("class");
                }
                this.setAttribute("class", "same-as-selected");
                break;
              }
            }
            h.click();
        });
        b.appendChild(c);
      }
      x[i].appendChild(b);
      a.addEventListener("click", function(e) {
          e.stopPropagation();
          closeAllSelect(this);
          this.nextSibling.classList.toggle("select-hide");
          this.classList.toggle("select-arrow-active");
        });
    }
    function closeAllSelect(elmnt) {
      let x, y, i, arrNo = [];
      x = document.getElementsByClassName("select-items");
      y = document.getElementsByClassName("select-selected");
      for (i = 0; i < y.length; i++) {
        if (elmnt == y[i]) {
          arrNo.push(i)
        } else {
          y[i].classList.remove("select-arrow-active");
        }
      }
      for (i = 0; i < x.length; i++) {
        if (arrNo.indexOf(i)) {
          x[i].classList.add("select-hide");
        }
      }
    }
    document.addEventListener("click", closeAllSelect);
}


function homepageButton() {
    location.reload();
}
    hompage_button.addEventListener("click", homepageButton);

