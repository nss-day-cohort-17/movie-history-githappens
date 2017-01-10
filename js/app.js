////////////////////////////
// App
////////////////////////////


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

// Show 3 movies in watchlist and 3 movies in history
function loadInitialMovies() {
	var watchlistUrl = 'https://moviehistory-githappens.firebaseio.com/watchlist.json'
	var historyUrl = 'https://moviehistory-githappens.firebaseio.com/history.json'
	var movie
	var p1 = new Promise(function(res, rej) {
		$.getJSON(watchlistUrl, (data) => res(data))
	})
	p1.then(populateWatchlist)
	var p2 = new Promise(function(res, rej) {
		$.getJSON(historyUrl, (data) => res(data))
	})
	p2.then(populateHistory)
}

function populateWatchlist(data) {
	console.log('populateWatchlist')
	console.log(data)
}

function populateHistory(data) {
	console.log('populateHistory')
	console.log(data)
}














