const apiKeyTHEMOVIEDB = '1b5c60ee6aec45c5d195c771aac3b3cc';
let filmsAlreadyVisualized = [];
let isWaiting = false; // fa aspettare 1 secondo prima di premere di nuovo il pulsante per cercare un altro film
let availableMovies = [];
let page = Math.floor(Math.random() * 500) + 1;
let availablePage = [];
availablePage[0] = page;
let numberOfPagesSaw = 0;
let randomMovie = null;
let movieLike = [];
var canChooseFilm = true;

$(function() {
  let isDragging = false; // Indica se l'utente sta trascinando l'immagine
  let startX = 0; // Posizione iniziale del cursore sull'asse X

  // Aggiungi la classe "draggable" all'elemento card
  $(".container").addClass("draggable");

  // Aggiungi la funzionalità "draggable" all'elemento card
  $(".draggable").draggable({
    axis: 'x',
    containment: "parent",
    start: function(event, ui) {
      // Imposta la variabile isDragging su true quando inizia il trascinamento
      isDragging = true;
      startX = event.clientX; // Salva la posizione iniziale del cursore
    },
    drag: function(event, ui) {
      if (isDragging) {
        // Calcola la differenza di posizione tra la posizione iniziale e corrente del cursore
        var deltaX = event.clientX - startX;

        // Ruota la card in base alla direzione dello spostamento del cursore
        if (deltaX > 0) {
          ui.helper.css({
            transform: "rotate(7deg)" // Ruota verso destra
          });
        } else if (deltaX < 0) {
          ui.helper.css({
            transform: "rotate(-7deg)" // Ruota verso sinistra
          });
        }
      }
    },
    stop: function(event, ui) {
      // Ripristina la posizione e l'orientamento della card quando si interrompe il trascinamento
      ui.helper.css({
        transform: "rotate(0deg)",
      });
      isDragging = false;
      filmCasuale();
    }
  });
});

//freccetta destra --> aggiunge ai preferiti
//freccetta sinistra --> cambia film
$(document).keydown(function(event) {
  if(canChooseFilm){
    if (event.keyCode === 37) {
      // L'utente ha premuto la freccia sinistra
      $(".container").css({
        transform: "rotate(-7deg)"
      })
    } else if (event.keyCode === 39) {
      // L'utente ha premuto la freccia destra
      $(".container").css({
        transform: "rotate(7deg)"
      })
      movieLike.push(randomMovie.title);
    }
    canChooseFilm = false;
  }
});
$(document).keyup(function(event) {
  filmCasuale();
  $(".container").css({
    transform: "rotate(0deg)"
  })
  canChooseFilm = true;
});


async function filmCasuale() {
  numberOfPagesSaw++;
  // Se è in attesa, esce dalla funzione
  if (isWaiting) {
    return;
  }

  // Disabilita il pulsante di avvio
  $("#search-btn").prop("disabled", true);

  const discoverUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKeyTHEMOVIEDB}&language=it-IT&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}`;

  try {
    // Imposta lo stato di attesa su true
    isWaiting = true;

    const response = await fetch(discoverUrl);
    const data = await response.json();
    const totalPagesOfFilms = data.total_pages;

    if (response.status !== 200) {
      console.log('Si è verificato un errore:', data.status_message);
      return;
    }

    // Reimposta la lista dei film disponibili
    const movies = data.results;
    availableMovies = movies.filter(movie => !filmsAlreadyVisualized.includes(movie.title));

    if (availableMovies.length === 0) {
      if (numberOfPagesSaw > totalPagesOfFilms) {
        console.log('Non ci sono più film disponibili!');
        console.log('Ti reindirizzo ad un0altra pagina');
        // Abilita nuovamente il pulsante di avvio
        $("#search-btn").prop("disabled", false);
        filmsAlreadyVisualized = [];
        page = Math.floor(Math.random() * 500) + 1;
        filmCasuale();
        return;
      }

      if (numberOfPagesSaw === totalPagesOfFilms) {
        console.log('Tutti i film disponibili sono stati visualizzati!');
        console.log('Ti reindirizzo alla prima pagina');
        // Abilita nuovamente il pulsante di avvio
        $("#search-btn").prop("disabled", false);
        filmsAlreadyVisualized = [];
        page = 1;
        filmCasuale();
        return;
      }

      do {
        page = Math.floor(Math.random() * 500) + 1;
      } while (availablePage.includes(page));

      availablePage[numberOfPagesSaw] = page;

      filmCasuale();
      return;
    }

    const randomIndex = getRandomNumber(0, availableMovies.length - 1);
    randomMovie = availableMovies[randomIndex];
    filmsAlreadyVisualized.push(randomMovie.title);

    // Ottieni i generi del film
    const genres = await getGenresForMovie(randomMovie.id);
    if (genres) {
      randomMovie.genres = genres.map(genre => genre.name).join(', ');
    }

    scrivoInfoPrincipali();
  } catch (error) {
    console.log('Si è verificato un errore:', error);
  } finally {
    // Attendi 1 secondo prima di riabilitare il pulsante
    setTimeout(function() {
      // Abilita nuovamente il pulsante di avvio
      $("#search-btn").prop("disabled", false);
      // Ripristina lo stato di attesa su false
      isWaiting = false;
    }, 100);
  }
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function scrivoInfoPrincipali() {
  let randomMovieTitle = randomMovie.title;
  let randomMovieVote = "Non ci sono abbastanza dati sui voti";
  let randomMovieOverview = "Non ci sono abbastanza dati sulla descrizione";

  if (randomMovie.vote_average !== "") {
    randomMovieVote = randomMovie.Genre;
  }
  if (randomMovie.overview !== "") {
    randomMovieOverview = randomMovie.overview;
  }

  /*$("#img-div").html(
    "<div id = 'tuttiElementi'>" +
        "<div id = 'title-div'>" +
            "<h2>" + randomMovieTitle + "</h2>" +
        "</div>" +
        "<div id='card-container'>" +
            "<img id='imgMoviePoster' src='https://image.tmdb.org/t/p/w185" + randomMovie.poster_path + "'/>" +
            "<div id='film-description'>" +
                "<p>Valutazione: " + randomMovieVote + "</p>" +
            "</div>" +
        "</div>" +
    "</div>"
  );*/

  $("#title-div").html(
    "<h2>" + randomMovieTitle + "</h2>"
  );

  $("#img-div").html(
    "<img id='imgMoviePoster' src='https://image.tmdb.org/t/p/w342" + randomMovie.poster_path + "?timestamp?" + Date.now() + "'/>"
  );
  $("#genre-div").html(
    "<p>Genere: <br>" + randomMovie.genres + "</p>"
  );
}

async function getGenresForMovie(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKeyTHEMOVIEDB}&language=it-IT`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.status !== 200) {
      console.log('Si è verificato un errore:', data.status_message);
      return null;
    }

    return data.genres;
  } catch (error) {
    console.log('Si è verificato un errore:', error);
    return null;
  }
}







/*var apiKeyOMDB = "caf07ac6";
$(document).ready(function() {
    // Aggiungi l'evento click al pulsante di ricerca
    $("#nomeIdBtn").click(function() {
        // Disabilita il pulsante di avvio
        $(this).prop("disabled", true);

        var filmName = document.getElementById("nomeFilm").value;
        // Effettua la chiamata all'API di OMDb
        $.getJSON("http://www.omdbapi.com/?apikey=" + apiKeyOMDB + "&t=" + filmName, function(data) {
            // Elabora i dati della risposta
            if (data.Response === "True") {
                if(data.Title != null){
                    var title = data.Title;

                    var plot = data.Plot; //trama
                    if(plot === "N/A"){
                        plot = "Trama non disponibile";
                    }

                    var runTime = data.Runtime; //durata in minuti 
                    if(runTime === "N/A"){
                        runTime = "Durata non disponibile";
                    } 

                    var genre = data.Genre; 
                    if(genre === "N/A"){
                        genre = "Genere non disponibile";
                    }

                    var released = data.Released; //data di rilascio     
                    if(released === "N/A"){
                        released = "Data di rilascio non disponibile";
                    }
                    
                    var awards = data.Awards; //premi vinti dal film
                    if(awards === "N/A"){
                        awards = "Premi non disponibili";
                    }

                    var rating = data.imdbRating; //valutazione da 0 a 100
                    if(rating === "N/A"){
                        rating = "Valutazione non disponibile";
                    }

                    var type = data.Type; //tipo di elemento (movie, series, episode)
                    if(type === "N/A"){
                        type = "Tipo di elemento non disponibile";
                    }

                    var earning = data.BoxOffice; //i guadagni
                    if(earning === "N/A"){
                        earning = "Guadagni non disponibili";
                    }

                }else{
                    $("#result-container").html("<p style = 'color: red'> Non sono stati trovati dati di questo film");
                }
                

                // Mostra i risultati nella pagina
                /*$("#result-container").html("<h2>" + title + "</h2>" +
                                             "<p>Trama: " + plot + "</p>" +
                                             "<p>Durata: " + runTime + "</p>" +
                                             "<p>Genere: " + genre + "</p>" +
                                             "<p>Tipologia: " + type + "</p>" +
                                             "<p>Anno di rilascio: " + released + "</p>" +
                                             "<p>Premi: " + awards + "</p>" +
                                             "<p>Valutazione: " + rating + " / 10</p>" +
                                             "<p>Guadagni: " + earning + "</p>");*/
                
                // Mostra i risultati nella pagina
                /*$("#result-container").html("<h2>" + title + "</h2>" +
                                            "<p>Trama:" + plot + "</p>" +
                                            "<p>Tipologia/Generi: " + type + ", " + genre + "</p>" +
                                            "<p>Durata: " + runTime + "</p>" +
                                            "<p>Anno di rilascio: " + released + "</p>" +
                                            "<p>Valutazione: " + rating + " / 10</p>" +
                                            "<p>Premi: " + awards + "</p>" +
                                            "<p>Guadagni: " + earning + "</p>"
                                            );
            } else {
                // Mostra un messaggio di errore se la ricerca non ha prodotto risultati
                $("#result-container").html("<p style = 'color: red'>Nessun risultato trovato</p>");
            }

            // Abilita nuovamente il pulsante di avvio
            $("#search-btn").prop("disabled", false);
        });
    });
});*/