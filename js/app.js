
////////////////////////////
// App
////////////////////////////



////////////////////////////
// Global Var
////////////////////////////

var userMovieSearch = "star wars";


//Allows user input field to update upon user focus
$(document).ready(function() {
    Materialize.updateTextFields();
  });
//Upon focus of user input, add the "active" class to the label

// Add event listeners upon page load

$(document).ready(function() {
	addTabEvents()
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
// Add Movies
////////////////////////////



//when user enter a movie title

$("#movieSearch").submit(function (e) {
  e.preventDefault();
  getUserMovie();
});
//text stored
function getUserMovie(e) {
  userMovieSearch = $(".userMovieSearch").val();
}
//title taken in to query to API

var searchMovies = new Promise(function (resolve, reject){
  var searchUrl = "http://www.omdbapi.com/?t=" + userMovieSearch + "&y=&plot=short&r=json";
  $.ajax({
    url : searchUrl
  })
  .done(function(data, t, x) {
    resolve(data);
  })
})
//promise to get API
//return of API stored to a variable
searchMovies.then(function(data) {
  fillCards(data);
})
//parsed, and loaded into card(s)

function fillCards(data) {
  console.log(data);
  var movieData = data;
  var cardData = "";
  cardData += `<div class="col s6 m7 z-depth-1">`;
  cardData += `<h2 class="header movieTitle">${movieData.Title}</h2>`;
  cardData += `<div class="card horizontal small">`;
  cardData += `<div class="card-image">`;
  cardData += `<img src=${data.Poster}>`;
  cardData += `</div><div class="card-stacked"><div class="card-content">`;
  cardData += `<p class="year"><span>Year: </span>${movieData.Year}</p>`;
  cardData += `<p class="actors"><span>Actors: </span>${movieData.Actors}</p>`
  cardData += `<p class="plot"><span>Plot: </span>${movieData.Plot}</p>`;
  cardData += `</div><div class="card-action"><a href="#">Add to Watch List</a></div></div></div>`;
  cardData += `<span class="new badge" data-badge-caption="stars">0</span>`
  cardData += `</div>`;
  //add to card
  $(".addMovieContainer .row").append(cardData);

}

//if want to add to watchlist
  //variable moved to watchlist card
  //added to user json file
  //card removed from add movies container
