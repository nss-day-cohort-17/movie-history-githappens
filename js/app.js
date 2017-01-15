////////////////////////////
// App
////////////////////////////

addTabEvents()
// Add mobile navbar functionality
$(".button-collapse").sideNav({
  closeOnClick: true, // Closes side-nav on <a> clicks, useful for
  draggable: true // Choose whether you can drag to open on touch screens
});
// Event listener for logout
$('.logout').click(() => {
  firebase.auth().signOut()
})

////////////////////////////
// Firebase Auth
////////////////////////////

firebase.initializeApp({
  apiKey: "AIzaSyCvutchqpXLOOTepJYZTnz0Cx10lGmLcVM",
  authDomain: "moviehistory-githappens.firebaseapp.com",
  databaseURL: "https://moviehistory-githappens.firebaseio.com",
  storageBucket: "moviehistory-githappens.appspot.com",
  messagingSenderId: "86422585644"
});

firebase.auth().onAuthStateChanged((e) => {
  if(e !== null) {
    uid = e.uid
    loadInitialMovies()
    $('article.login').addClass('hidden')
    $('article.mainpage').removeClass('hidden')
  } else {
    uid = ""
    $('section .movieWrapper').remove()
    $('article.login').removeClass('hidden')
    $('article.mainpage').addClass('hidden')
  }
})

////////////////////////////
// Login Page
////////////////////////////

//login

$(".loginBtn").click(function(e) {
  //get user email and pass word
  e.preventDefault();
  console.log("log me in");
  var email = $("input[type='email']").val();
  var password = $("input[type='password']").val();
  firebase
  .auth()
  .signInWithEmailAndPassword(email, password)
  .then(() => {
  e.preventDefault();
    //reset form on correct user auth
    $('.login form')[0].reset();
    //send error message if login doesn't work
  }).catch(function(e)  {
    Materialize.toast(e.message, 2000)
  })
})

//to register
$(".createAccount").click((e) => {
  e.preventDefault();
  var email = $("input[type='email']").val();
  var password = $("input[type='password']").val();

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then (() => {
    //set to the h1
    $('.login form')[0].reset();
  })
    //send error message if login doesn't work
  .catch(function(e)  {
    Materialize.toast(e.message, 2000)
  })

})


//if user forgot pass word
$(".forgotEmail").click((e) => {
    //get email address
  var email = $("input[type='email']").val();
  firebase
    .auth()
    .sendPasswordResetEmail(email).then(function() {
    Materialize.toast("A reset email has been sent to your address")
  })
    .catch(function(e)  {
    Materialize.toast(e.message, 2000)
  })

})





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
var uid;


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
  cardData += `</div><div class="card-action"><a id="toWatchList" href="#" class="amber-text ">Add to Watch List</a></div></div></div>`;
  cardData += `<span class="new badge cyan lighten-2" data-badge-caption="Rated">Not Yet</span>`
  cardData += `</div>`;
  //add to card
  $(".addMovieContainer .row").html(cardData);
  //binds event handler to newly created card
  bindToWatchList();
}

// function that binds event handler to new card
// NOTE: this function binds event listeners to the search result
function bindToWatchList () {
  $("#toWatchList").click(checkIfMovieInWatchList);
  $(".dismiss").click(deleteSearchMovies);
};


//tests to see if movie already in the watchlist

function checkIfMovieInWatchList(e) {
  //stores IMDB of current movie
  var searchMovieIMDBid = currentMovie.imdbID;
  //checks to see if movie is already in user movies by checking for the data-imdbID attribute
  if (document.querySelectorAll(`span[data-imdbID=${searchMovieIMDBid}]`).length === 0) {
    //if the movie isn't already on the page, add it to the page
    addToWatchList()
  } else {
    //keeps the page from jumping to the top
    e.preventDefault();
    // otherwise let the user know it is already there
    Materialize.toast("This movie is already in your history.", 2000)
  }
}







//if want to add to watchlist
//variable moved to watchlist card
function addToWatchList() {
  console.log("add to watchlist");
  //removes card from page
  removeSearchCard();
  //adds card object to user json
  sendToJSON = new Promise(function(resolve, reject) {
  jQuery.post(`https://moviehistory-githappens.firebaseio.com/${uid}.json`, JSON.stringify(currentMovie))
    .done(function(data, x, t) {
      resolve(data);
    })
  //I need e.name for the object key
  }).then(function(data) {
    dynamicallyAddToWatchList(data)
  })
}


//////////////////////////////////////////
// Add new movie to
// Loops through all saved movies of user
// Tests to see if they have been watched or not
// Loads the movie card (from handlebar template) into correct section
// Adds event listener to stars after page population
function dynamicallyAddToWatchList(data) {
  // Grab and process handlebar template
  var templateHTML = $('#card-template').html()
  var template = Handlebars.compile(templateHTML)
  // console.log("trying to add movie to watchlist")
  insertMovieWatchlistSearch(template, data.name, currentMovie)
  function insertMovieWatchlistSearch(template, movie, data) {

    card = template(currentMovie)
    card = $(card).find('.col').attr('id', movie).closest('.movieWrapper')
    card = '<div class="movieWrapper">' + card.html() + '</div>'
    $('#watchlist .row').append(card)
    $('#all-movies .row').append(card)
}

  $('#watchlist .movieWrapper:last-child .star').click((clickEvt) => {
    updateStarsOnClick(clickEvt);
  })
}

////////////////////////////////////


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

// This function deletes the search result
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
// Upon successful fetch of data, calls populate function
// e is a user object from firebase
function loadInitialMovies() {
	var url = `https://moviehistory-githappens.firebaseio.com/${uid}.json`
	var movie
	var p = new Promise(function(res, rej) {
		$.getJSON(url, (data) => res(data))
	})
	p.then(populate)
}

// Loops through all saved movies of user
// Tests to see if they have been watched or not
// Loads the movie card (from handlebar template) into correct section
// Adds event listener to stars after page population
function populate(data) {
  // Grab and process handlebar template
	var templateHTML = $('#card-template').html()
	var template = Handlebars.compile(templateHTML)

	for(var movie in data) {
		if(data[movie].Watched === true) {
      insertMovieHistory(template, movie, data)
    } else {
      insertMovieWatchlist(template, movie, data)
    }
    if (data[movie].Stars != null) { // If movie has stored star rating...
      showStarsOnLoad(movie, data[movie].Stars)
    }
  }
	$('.star').click((clickEvt) => {
		updateStarsOnClick(clickEvt);
	})
}

// This function shows a movie on the watchlist page
// It takes a handlebars template, the movie ID, and json file as args
function insertMovieHistory(template, movie, data) {
  card = template(data[movie]) // generate html using data and template
  // Goes down to ".col" level and adds ID, then returns the whole thing
  card = $(card).find('.col').attr('id', movie).closest('.movieWrapper')
  card = '<div class="movieWrapper">' + card.html() + '</div>' // Hard code missing parent el
  $('#history .row').append(card)
  $('#all-movies .row').append(card)

  // Add class watched to the movies in 'history' after loading them in
  $('#history .movie-cards .watchedOrNot').addClass("watched");
  changeWatchedText();
}

// This function shows a movie on the history page
// It takes a handlebars template, the movie ID, and json file as args
function insertMovieWatchlist(template, movie, data) {
  card = template(data[movie])
  card = $(card).find('.col').attr('id', movie).closest('.movieWrapper')
  card = '<div class="movieWrapper">' + card.html() + '</div>'
  $('#watchlist .row').append(card)
  $('#all-movies .row').append(card)
}

// This function takes a movie ID and rating
// This displays the correct number of stars on load
function showStarsOnLoad(uuid, rating) {
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

// Updates the 1-5 star rating on DOM and updates data in firebase
function updateStarsOnClick(clickEvt) {
  var target = clickEvt.target
  var starVal = $(target).data('value')
  var uuid = $(target).closest('.col').attr('id')
  $(`#${uuid} .star.filled`).addClass('hidden') // hide filled stars
  $(`#${uuid} .star.hollow`).removeClass('hidden') // show hollow stars
  switch(starVal) {
    case 1:
      console.log("updateStarsOnClick case 1")
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
  $(target).closest('.movieWrapper').find('.movie-data').data('stars', `${starVal}`)
}

// Updates star rating on object using patch
// NOTE: uuid is movie.  uid is user.
function updateRating(uuid, rating) {
	var url = `https://moviehistory-githappens.firebaseio.com/${uid}/${uuid}.json`
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
  var currentID = $(e.target).closest('.col').attr("id");
  console.log("currentID : ", currentID);
  $.ajax({
    url : `https://moviehistory-githappens.firebaseio.com/${uid}/${currentID}/.json`,
    method : "DELETE"
  });

  //deletes from DOM
  $(e.target).parentsUntil(".row").remove();
  $("#" + currentID).parentsUntil(".row").remove()
}


///////////////////////////////////////////////////////////
// Changing movies from watched to unwatched and visa versa
//////////////////////////////////////////////////////////

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

    //remove from history
    $(e.target).parentsUntil(".row").remove();
    $('#history  .row').append(unwatchedCard);

    // Add event listeners to stars of newly added card
    $('#history .movieWrapper:last-child .star').click((clickEvt) => {
      updateStarsOnClick(clickEvt);
    })
  }
});


// Uses patch to update watched attribute
function writeWatched(e) {
  //get id from card
  var clickEventOfOld = e;
  var currentID = $(clickEventOfOld).parent().parent().parent().parent().attr("id");
  console.log("currentID : ", currentID);
  $.ajax({
    url : `https://moviehistory-githappens.firebaseio.com/${uid}/${currentID}/.json`,
    data: JSON.stringify({ Watched: true }),
    type : 'PATCH',
    dataType: 'json'
  });
}

// Uses patch to update watched attribute
function writeUnwatched(e) {
  //get id from card
  var clickEventOfOld = e;
  console.log("ClickEvent of Old", $(clickEventOfOld).parent().parent())
  var currentID = $(clickEventOfOld).parent().parent().parent().parent().attr("id");
  console.log("currentID : ", currentID);
  $.ajax({
    url : `https://moviehistory-githappens.firebaseio.com/${uid}/${currentID}/.json`,
    data: JSON.stringify({ Watched: false }),
    type : 'PATCH',
    dataType: 'json'
  });
}

////////////////////////////
// Sort Function
////////////////////////////

// Initializes material select options
$(document).ready(function() {
  $('select').material_select();
});

// Returns data from history, watchlist, or all-movies
// Returns data corresponding to info argument
function getDataFromHTML(section, info) {
  var dataArray = []
  $(`#${section} .movieWrapper`)
  .each((ind, el) => {
    var data = $(el).find('.movie-data').data(`${info}`)
    var uuid = $(el).find('.col').attr('id')
    dataArray.push({
      uuid: uuid,
      data: data,
      Title: $(el).find('.movie-data').data('title'),
      Poster: $(el).find('.movie-data').data('poster'),
      Year: $(el).find('.movie-data').data('year'),
      Actors: $(el).find('.movie-data').data('actors'),
      Plot: $(el).find('.movie-data').data('plot')
    })
  })
  return dataArray
}

// Takes object from getDataFromHTML and alphabetizes
function alphabetizeMovies(array) {
  function compare(a,b) {
    string1 = a.data
    string2 = b.data
    return string1.localeCompare(string2)
  }

  return array.sort(compare)
}

// Sort upon change of select element
$('#all-movies select').change(() => {
  var templateHTML = $('#card-template').html()
  var template = Handlebars.compile(templateHTML)

  var selected = $('#all-movies select option:selected').val()
  switch(selected) {
    case 'alphabetical':
      titles = getDataFromHTML('all-movies', 'title')
      titles = alphabetizeMovies(titles)
      console.log(titles)
      $('#all-movies .row').html('')
      repopulateAllMovies(titles, template)
      break
    case 'imdb-rating':
      //Do stuff
      break
    case 'year-released':
      //Do stuff
      break
  }
})

// NOTE: ADD MOVIE UUID AS ID
function repopulateAllMovies(array, template) {
  for(var i = 0; i < array.length; i++) {
    var card = template(array[i])
    $('#all-movies .row').append(card)
    $('#all-movies .row .movieWrapper:last-child .col').attr("id", array[i].uuid)
  }
}












