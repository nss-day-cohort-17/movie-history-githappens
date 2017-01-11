////////////////////////////
// App
////////////////////////////

addTabEvents()
loadInitialMovies()


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
