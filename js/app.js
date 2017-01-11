
////////////////////////////
// App
////////////////////////////




////////////////////////////
// Global Var
////////////////////////////

var userMovieSearch = "star wars";
var currentMovie;
var searchMovies;


//Allows user input field to update upon user focus
$(document).ready(function() {
    Materialize.updateTextFields();
  });
//Upon focus of user input, add the "active" class to the label

// Add event listeners upon page load


$(document).ready(function() {
	addTabEvents()
	loadInitialMovies()

})

// Hard-coded page navigation based on tab clicking
function addTabEvents() {
	$('#watchlist-tab').click(function() {
		$('#tabs a').removeClass('active')
		$('#watchlist-tab a').addClass('active')
		$('section').addClass('hidden')
		$('#watchlist').removeClass('hidden')
	})
	$('#history-tab').click(function() {
		$('#tabs a').removeClass('active')
		$('#history-tab a').addClass('active')
		$('section').addClass('hidden')
		$('#history').removeClass('hidden')
	})
	$('#all-movies-tab').click(function() {
		$('#tabs a').removeClass('active')
		$('#all-movies-tab a').addClass('active')
		$('section').addClass('hidden')
		$('#all-movies').removeClass('hidden')
	})
}




////////////////////////////
// Search for Movies
////////////////////////////



//when user enter a movie title

$("#movieSearch").click(function (e) {
  console.log("submitting");
  e.preventDefault();
  getUserMovie();
});
//text stored
function getUserMovie(e) {
  console.log("getting user data")
  userMovieSearch = $(".userMovieSearch").val();
  searchMovies = new SearchFactory();
}
//title taken in to query to API

//promise to get API
function SearchFactory () {
   return new Promise(function (resolve, reject){
    var searchUrl = "http://www.omdbapi.com/?t=" + userMovieSearch + "&y=&plot=short&r=json";
    $.ajax({
      url : searchUrl
    })
    .done(function(data, t, x) {
      resolve(data, t), x;
    })
  })
   //return of API stored to a variable
  .then(function(data) {
  console.log("data.Response is: ", data.Response)
    //if movie already in search area, can't do new search
    if (data.Response === "False") {
      //show error
    } else {
      fillCards(data);
    }
  });
}


//parsed, and loaded into card(s)

function fillCards(data) {
  currentMovie = data;
  currentMovie.Watched = false;
  console.log(currentMovie);
  var movieData = data;
  var cardData = "";
  cardData += `<div id="searchCard" class="col s6 m7 z-depth-1">`;
  cardData += `<h2 class="header movieTitle">${movieData.Title}</h2>`;
  cardData += `<div class="card horizontal small">`;
  cardData += `<div class="card-image">`;
  cardData += `<img src=${data.Poster}>`;
  cardData += `</div><div class="card-stacked"><div class="card-content">`;
  cardData += `<p class="year"><span>Year: </span>${movieData.Year}</p>`;
  cardData += `<p class="actors"><span>Actors: </span>${movieData.Actors}</p>`
  cardData += `<p class="plot"><span>Plot: </span>${movieData.Plot}</p>`;
  cardData += `</div><div class="card-action"><a id="toWatchList" href="#">Add to Watch List</a></div></div></div>`;
  cardData += `<span class="new badge" data-badge-caption="Rated">Not Yet</span>`
  cardData += `</div>`;
  //add to card
  $(".addMovieContainer .row").append(cardData);
  //binds event handler to newly created card
  bindToWatchList();

}

//function that binds event handler to new card
function bindToWatchList () {
  $("#toWatchList").click(addToWatchList);
};
//if want to add to watchlist
  //variable moved to watchlist card
  function addToWatchList() {
    console.log("add to watchlist");
    //removes card from page
    removeSearchCard();
    //adds card object to user json
    jQuery.post("https://moviehistory-githappens.firebaseio.com/.json", JSON.stringify(currentMovie));

  }
  //added to user json file
  //card removed from add movies container
  function removeSearchCard() {
    console.log("remove me");
    //removes card from page
    $("#searchCard").remove();
    //resets search field to empty string
    $(".userMovieSearch").val("");
  }

////////////////////////////
// Add Movies
////////////////////////////

// Queries firebase for initial data
function loadInitialMovies() {
	var url = 'https://moviehistory-githappens.firebaseio.com/.json'
	var movie
	var p = new Promise(function(res, rej) {
		$.getJSON(url, (data) => res(data))
	})
	p.then(populate)
}

// Populate page
function populate(data) {
	var templateHTML = $('#card-template').html()
	var template = Handlebars.compile(templateHTML)

	for(var movie in data) {
		if(data[movie].Watched === true) {
			card = template(data[movie])
			$('#history .movie-cards .row').append(card)
			$('#all-movies .movie-cards .row').append(card)
		} else {
			card = template(data[movie])
			$('#watchlist .movie-cards .row').append(card)
			$('#all-movies .movie-cards .row').append(card)
		}
	}
}

