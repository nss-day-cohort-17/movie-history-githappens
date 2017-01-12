////////////////////////////
// App
////////////////////////////

addTabEvents()
loadInitialMovies()

// on page load, add movies is hidden
function hideAddMovies () {
  $(".addMoviesCard").hide();
}

hideAddMovies();

//but if add movies is clicked, it will show
$(".addMoviesLink").click(showAddMovies);

function showAddMovies() {
  $(".addMoviesCard").show();
}

// but if click other elements of the navbar, will hide
$(".hideSearch").click(hideAddMovies);

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


// Hard-coded page navigation based on tab clicking
// Function is called at the top of this script
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

//when user enters a movie title
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
      var errorText;
      errorText = "We're sorry, something didn't work.  Please check your spelling and try again.";
      $(".addMovieContainer .row").html(errorText);
    } else {
      fillCards(data);
    }
  });
}

//parsed, and loaded into card(s)
// NOTE: console log in this function
function fillCards(data) {
  currentMovie = data;
  currentMovie.Watched = false;
  console.log(currentMovie);
  var movieData = data;
  var cardData = "";
  cardData += `<div id="searchCard" class="col s6 m7 z-depth-1"><a class="dismiss">X</a>`;
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
  $(".addMovieContainer .row").html(cardData);
  //binds event handler to newly created card
  bindToWatchList();
}

//function that binds event handler to new card
function bindToWatchList () {
  $("#toWatchList").click(addToWatchList);
  $(".dismiss").click(deleteSearchMovies);
};
//if want to add to watchlist
  //variable moved to watchlist card
  function addToWatchList() {
    console.log("add to watchlist");
    //removes card from page
    removeSearchCard();
    //adds card object to user json
    sendToJSON = new Promise(function(resolve, reject) {
    jQuery.post("https://moviehistory-githappens.firebaseio.com/.json", JSON.stringify(currentMovie))
      .done(function(data) {
        resolve(data);
      })
    })
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
// Delete Searched Movies
////////////////////////////



function deleteSearchMovies(e) {
  $(this).parent().remove();
  //resets search field to empty string
    $(".userMovieSearch").val("");
    $(".userMovieSearch").blur();
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
      console.log('watched = true')
      card = template(data[movie])
      card = $(card).find('.col').attr('id', movie).closest('.movieWrapper')
      card = '<div class="movieWrapper">' + card.html() + '</div>'
      $('#history .row').append(card)
      $('#all-movies .row').append(card)
      console.dir(card)
      //change text to watched
      // Add class watched to the movies in 'history' after loading them in
      $('#history .movie-cards .watchedOrNot').addClass("watched");
      changeWatchedText();
    } else {
      console.log('watched = false')
      card = template(data[movie])
      card = $(card).find('.col').attr('id', movie).closest('.movieWrapper')
      card = '<div class="movieWrapper">' + card.html() + '</div>'
      $('#watchlist .row').append(card)
      $('#all-movies .row').append(card)
      console.dir(card)
    }
    if (data[movie].Stars != null) {
      showStarsOnLoad(movie, data[movie].Stars)
    }
  }
	$('.star').click((clickEvt) => {
		updateStarsOnClick(clickEvt);
	})
}

function showStarsOnLoad(uuid, rating) {
	$(`#${uuid} .star.filled`).addClass('hidden') // hide filled stars
	$(`#${uuid} .star.hollow`).removeClass('hidden') // show hollow stars
	switch(rating) {
		case 1:
			$(`#${uuid} .star-1.hollow`).addClass('hidden')
			$(`#${uuid} .star-1.filled`).removeClass('hidden')
			break
		case 2:
			$(`#${uuid} .star-1.hollow, #${uuid} .star-2.hollow`).addClass('hidden')
			$(`#${uuid} .star-1.filled, #${uuid} .star-2.filled`).removeClass('hidden')
			break
		case 3:
			$(`#${uuid} .star-1.hollow, #${uuid} .star-2.hollow, #${uuid} .star-3.hollow`).addClass('hidden')
			$(`#${uuid} .star-1.filled, #${uuid} .star-2.filled, #${uuid} .star-3.filled`).removeClass('hidden')
			break
		case 4:
			$(`#${uuid} .star-1.hollow, #${uuid} .star-2.hollow, #${uuid} .star-3.hollow, #${uuid} .star-4.hollow`).addClass('hidden')
			$(`#${uuid} .star-1.filled, #${uuid} .star-2.filled, #${uuid} .star-3.filled, #${uuid} .star-4.filled`).removeClass('hidden')
			break
		case 5:
			$(`#${uuid} .star.hollow`).addClass('hidden') // hide filled stars
			$(`#${uuid} .star.filled`).removeClass('hidden') // show hollow stars
			break

  }
}

// Updates the 1-5 star rating on DOM
function updateStarsOnClick(clickEvt) {
	var target = clickEvt.target
	var starVal = $(target).data('value')
	var uuid = $(target).closest('.col').attr('id')
	$(`#${uuid} .star.filled`).addClass('hidden') // hide filled stars
	$(`#${uuid} .star.hollow`).removeClass('hidden') // show hollow stars
	switch(starVal) {
		case 1:
			$(`#${uuid} .star-1.hollow`).addClass('hidden')
			$(`#${uuid} .star-1.filled`).removeClass('hidden')
			updateRating(uuid, 1)
			break
		case 2:
			$(`#${uuid} .star-1.hollow, #${uuid} .star-2.hollow`).addClass('hidden')
			$(`#${uuid} .star-1.filled, #${uuid} .star-2.filled`).removeClass('hidden')
			updateRating(uuid, 2)
			break
		case 3:
			$(`#${uuid} .star-1.hollow, #${uuid} .star-2.hollow, #${uuid} .star-3.hollow`).addClass('hidden')
			$(`#${uuid} .star-1.filled, #${uuid} .star-2.filled, #${uuid} .star-3.filled`).removeClass('hidden')
			updateRating(uuid, 3)
			break
		case 4:
			$(`#${uuid} .star-1.hollow, #${uuid} .star-2.hollow, #${uuid} .star-3.hollow, #${uuid} .star-4.hollow`).addClass('hidden')
			$(`#${uuid} .star-1.filled, #${uuid} .star-2.filled, #${uuid} .star-3.filled, #${uuid} .star-4.filled`).removeClass('hidden')
			updateRating(uuid, 4)
			break
		case 5:
			$(`#${uuid} .star.hollow`).addClass('hidden') // hide filled stars
			$(`#${uuid} .star.filled`).removeClass('hidden') // show hollow stars
			updateRating(uuid, 5)
			break
	}
}

// Updates star rating on object
function updateRating(uuid, rating) {
	var url = `https://moviehistory-githappens.firebaseio.com/${uuid}.json`
	$.ajax({
	  url : url,
	  data: JSON.stringify({ Stars: rating }),
	  type : 'PATCH',
	  dataType: 'json'
	});
}

//event listener on page
$("body").on("click", ".removeMovie", deleteMovieFinal);

function deleteMovieFinal(e) {
  //delete from JSON
  //get id from card
  var currentID = $(e.target).parent().parent().parent().parent().attr("id");
  console.log("currentID : ", currentID);
  $.ajax({
    url : "https://moviehistory-githappens.firebaseio.com/" + currentID + "/.json",
    method : "DELETE"
  });

  //deletes from DOM
  $(e.target).parentsUntil(".row").remove();
}


/////////////////////////////
// Changing movies from watched to unwatched and visa versa
///////////////////////////

//if movie is watched and want to switch to unwatched for page load,
function changeWatchedText() {
  $(".watched").text("Mark as Unwatched")
}

// $("body").on("click", ".watched", function(e) {
//   e.preventDefault();
//   $(e.target).removeClass("watched");
//     //change text on link
//   $(e.target).text("Mark Film As Watched");
// });

    //tell firebase to update

//if movie is UNwatched and want to switch to Watched,
$("body").on("click", ".watchedOrNot", function(e) {
  e.preventDefault();
  var evt = e.target;
  console.log("event target", evt)
  if ($(e.target).hasClass("watched")) {
    console.log("Move me to watchlist")
        //write that film as watched
    writeUnwatched(evt);
    $(e.target).removeClass("watched");
    //change text on link
    $(e.target).text("Mark Film As Watched");
    //add to history
    var watchedCard = $(e.target).closest(".movieWrapper").html();
    watchedCard = "<div class='movieWrapper'>" + watchedCard + "</div>";
      //remove from watchlist
    $(e.target).parentsUntil(".row").remove();

    $('#watchlist .row').append(watchedCard);


  } else {
    $(e.target).addClass("watched");
        //write that film as unwatched
    writeWatched(evt);
      //change text on link
    $(e.target).text("Mark as UnWatched");
    //add to watchlist
    var unwatchedCard = $(e.target).closest(".movieWrapper").html();
    unwatchedCard = "<div class='movieWrapper'>" + unwatchedCard + "</div>";
    console.log(unwatchedCard)


    //remove from history
    $(e.target).parentsUntil(".row").remove();
    $('#history  .row').append(unwatchedCard);

  }
});


function writeWatched(e) {
  //get id from card
  var clickEventOfOld = e;
  var currentID = $(clickEventOfOld).parent().parent().parent().parent().attr("id");
  console.log("currentID : ", currentID);
  $.ajax({
    url : "https://moviehistory-githappens.firebaseio.com/" + currentID + "/.json",
    data: JSON.stringify({ Watched: true }),
    type : 'PATCH',
    dataType: 'json'
  });
}

function writeUnwatched(e) {
  //get id from card
  var clickEventOfOld = e;
  console.log("ClickEvent of Old", $(clickEventOfOld).parent().parent())
  var currentID = $(clickEventOfOld).parent().parent().parent().parent().attr("id");
  console.log("currentID : ", currentID);
  $.ajax({
    url : "https://moviehistory-githappens.firebaseio.com/" + currentID + "/.json",
    data: JSON.stringify({ Watched: false }),
    type : 'PATCH',
    dataType: 'json'
  });
}
