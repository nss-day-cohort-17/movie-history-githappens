////////////////////////////
// App
////////////////////////////

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
	$('#watched-movies-tab').click(function() {
		$('#tabs a').removeClass('active')
		$('#watched-movies-tab a').addClass('active')
		$('section').addClass('hidden')
		$('#watched-movies').removeClass('hidden')
	})
	$('#all-movies-tab').click(function() {
		$('#tabs a').removeClass('active')
		$('#all-movies-tab a').addClass('active')
		$('section').addClass('hidden')
		$('#all-movies').removeClass('hidden')
	})
}
