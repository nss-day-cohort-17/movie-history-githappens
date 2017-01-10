
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
//parsed, and loaded into card(s)

//if want to add to watchlist
  //variable moved to watchlist card
  //added to user json file
  //card removed from add movies container
