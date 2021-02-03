const SPACEBAR = 32,
	  M_KEY = 77,
	  R_KEY = 82,
	  MINUS_KEY = 189, // 188
	  PLUS_KEY = 187; // 190
 
$( function() {
	const woodshed = new Woodshed();

	const playButton = $('div#play-button'),
		  mutateButton = $('div#mutate-button'),
		  randomButton = $('div#random-button'),
		  lessButton = $('div#less-button'),
		  moreButton = $('div#more-button');

	// TODO: programmatically set up all buttons

	// TODO: add arrow key support for modifying sequence

	// From https://github.com/Tonejs/Tone.js#starting-audio
	document.querySelector('#div#play-button')?.addEventListener('click', async () => {
		await Tone.start();
		console.log('audio is ready');
	})

	// Set up mouse actions on Play/Stop button
	playButton.mousedown( function( e ) {
		e.preventDefault();
		$(this).addClass( 'depressed' );
	});
	playButton.mouseup( function( e ) {
		e.preventDefault();
		$(this).removeClass( 'depressed' );
	});
	playButton.click( function() {
		woodshed.toggle();
		$(this).html( woodshed.playing ? "Stop" : "Play" );
	});


	// Set up mouse actions on Random button
	randomButton.mousedown( function( e ) {
		e.preventDefault();
		$(this).addClass( 'depressed' );
	});
	randomButton.mouseup( function( e ) {
		e.preventDefault();
		$(this).removeClass( 'depressed' );
	});
	randomButton.click( function() {
		woodshed.random();
	});



	// Set up mouse actions on Mutate button
	mutateButton.mousedown( function( e ) {
		e.preventDefault();
		$(this).addClass( 'depressed' );
	});
	mutateButton.mouseup( function( e ) {
		e.preventDefault();
		$(this).removeClass( 'depressed' );
	});
	mutateButton.click( function() {
		woodshed.mutate();
	});


	// Set up mouse actions on Less button
	lessButton.mousedown( function( e ) {
		e.preventDefault();
		$(this).addClass( 'depressed' );
	});
	lessButton.mouseup( function( e ) {
		e.preventDefault();
		$(this).removeClass( 'depressed' );
	});
	lessButton.click( function() {
		woodshed.less();
	});

	// Set up mouse actions on More button
	moreButton.mousedown( function( e ) {
		e.preventDefault();
		$(this).addClass( 'depressed' );
	});
	moreButton.mouseup( function( e ) {
		e.preventDefault();
		$(this).removeClass( 'depressed' );
	});
	moreButton.click( function() {
		woodshed.more();
	});



	$(document).keydown( function( e ) {
		if ( e.which == SPACEBAR ) {
			e.preventDefault();
			playButton.addClass( 'depressed' );
		}
		if ( e.which == M_KEY ) {
			e.preventDefault();
			mutateButton.addClass( 'depressed' );
		}
		if ( e.which == R_KEY ) {
			e.preventDefault();
			randomButton.addClass( 'depressed' );
		}
		if ( e.which == MINUS_KEY ) {
			e.preventDefault();
			lessButton.addClass( 'depressed' );
		}
		if ( e.which == PLUS_KEY ) {
			e.preventDefault();
			moreButton.addClass( 'depressed' );
		}	})

	$(document).keyup( function( e ) {
		if ( e.which == SPACEBAR ) {
			playButton.removeClass( 'depressed' );
			playButton.click();
		}
		if ( e.which == M_KEY ) {
			mutateButton.removeClass( 'depressed' );
			mutateButton.click();
		}
		if ( e.which == R_KEY ) {
			randomButton.removeClass( 'depressed' );
			randomButton.click();
		}
		if ( e.which == MINUS_KEY ) {
			lessButton.removeClass( 'depressed' );
			lessButton.click();
		}
		if ( e.which == PLUS_KEY ) {
			moreButton.removeClass( 'depressed' );
			moreButton.click();
		}
	})

	// Set up window resize handler
	$( window ).resize( function() {
		// Momentarily disable transition animation on notes
		$('div.note').css( 'transition', 'all 0s' );
		woodshed.redraw();
		// Re-enable after 100 msec
		setTimeout( () => { $('div.note').css( 'transition', 'all 0.3s' ) }, 100 );

	});

});