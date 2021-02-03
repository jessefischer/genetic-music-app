const MAXMIDI = 100;
const MIDDLE_C = 60;

function Woodshed() {
	this.pattern = Array(7);
	this.patternIdx = 0;
	this.playing = false;
	this.bpm = 130;
	this.synth = new Tone.Synth(
		{
			oscillator : {
				type : 'sine'
			},
			envelope : {
				attack : 0.005 ,
				decay : 0.1 ,
				sustain : 0.3 ,
				release : 1
			}
		}).toDestination();

	this.random();
	this.draggingIdx = -1;

	for ( let i=0; i<this.pattern.length; i++ ) {
	
		$( "<div></div>" ).appendTo( '#pattern-visualizer' )
			.addClass( 'note')
			.prop( 'id', 'note-' + i )
			.css( 'transform', "translateY(" + (MAXMIDI - this.pattern[i]) * $('#pattern-visualizer').height() / MAXMIDI + "px)" );
	}

	// TODO: refactor into handleMouseDown method, and can call after more();
	const self = this;
	// $("div.note").mousedown( this.handleMouseDown.bind( this, ) );
	$("div.note").mousedown( function() {
		self.draggingIdx = this.id.split('-')[1];
		$(this).addClass( 'dragging' );
		$(document).mousemove( (e) => {
			e.preventDefault();
			$(this).css( 'transform', 'translateY(' + e.pageY + 'px)' );
		} );

	});

	$(document).mouseup( function( e ) {
		self.pattern[self.draggingIdx] = MAXMIDI - Math.round( e.pageY / $('#pattern-visualizer').height() * MAXMIDI );
		$(document).off('mousemove')
		$('#note-' + self.draggingIdx).removeClass( 'dragging' )
			.css( 'transform', "translateY(" + (MAXMIDI - self.pattern[self.draggingIdx]) * $('#pattern-visualizer').height() / MAXMIDI + "px)" );

		self.draggingIdx = -1;
	});

	Tone.Transport.bpm.value = this.bpm;
}

// Woodshed.prototype.handleMouseDown = function( self, e, el ) {
// 	this.draggingIdx = el.id.split('-')[1];
// 	$(el).addClass( 'dragging' );
// 	$(document).mousemove( (e) => {
// 		e.preventDefault();
// 		$(el).css( 'transform', 'translateY(' + e.pageY + 'px)' );
// 	} );

// }

Woodshed.prototype.drawStep = function() {
	$('#note').html( this.pattern[this.patternIdx] );
	$('#time').html( this.bpm + 'bpm ' + Tone.Transport.position.split('.')[0] );


	// because patternIdx has already been incremented in step, we have to get the previous index
	let prevIdx = (this.patternIdx - 1 + this.pattern.length) % this.pattern.length;

	// Flash the active class for 100ms
	const noteElement = $('#note-' + prevIdx).addClass( 'active' );
	setTimeout( () => { noteElement.removeClass( 'active' )}, 100 );

}

Woodshed.prototype.redraw = function() {
	// Set the translateY of the element
	for ( let i=0; i<this.pattern.length; i++ ) {
		$('#note-' + i).css( 'transform', "translateY(" + (MAXMIDI - this.pattern[i]) * $('#pattern-visualizer').height() / MAXMIDI + "px)" );
	}

}

Woodshed.prototype.step = function( time ) {
	// Schedule the visualizer step
	Tone.Draw.schedule( this.drawStep.bind( this ), time );

	// Schedule the synth tone
	this.synth.triggerAttackRelease( Tone.Midi( this.pattern[this.patternIdx] ), "8n", time );

	// Increment pattern index mod pattern length
	this.patternIdx = (this.patternIdx + 1) % this.pattern.length;

	if ( !this.patternIdx ) {
		this.mutate( 0.25 );
	}
}

Woodshed.prototype.toggle = function() {
	this.playing ? this.stop() : this.start();
}

Woodshed.prototype.start = function() {
	if ( !this.loop ) {
		Tone.context.resume();
		this.loop = new Tone.Loop( this.step.bind( this ), '8n' ).start( 0 );
	}
	this.playing = true;
	this.patternIdx = 0;
	Tone.Transport.start();
}

Woodshed.prototype.stop = function() {
	this.playing = false;
	Tone.Transport.stop();
}

Woodshed.prototype.mutate = function( temperature = 1) {

	for ( let i=0; i<this.pattern.length; i++ ) {
		// Don't mutate a note while it's being dragged!
		if ( i != this.draggingIdx ) {
			let rand = this.randomGaussian( 0, temperature ); // p5.js function. mean = 0, std dev = 1
			this.pattern[i] += Math.round( rand );
		}
	}
	this.redraw();
}

Woodshed.prototype.random = function( seed = MIDDLE_C, temperature = 5 ) {
	for ( let i=0; i<this.pattern.length; i++ ) {
		this.pattern[i] = seed + Math.round( this.randomGaussian( 0, temperature ));
	}
	this.redraw();
}

Woodshed.prototype.less = function() {
	if ( this.pattern.length > 0 ) {
		this.pattern.pop();
		$('#note-' + this.pattern.length).remove();
	}
}

Woodshed.prototype.more = function( seed = MIDDLE_C, temperature = 5 ) {
	this.pattern.push( seed + Math.round( this.randomGaussian( 0, temperature )));

	const self = this; // a hack
	$( "<div></div>" ).appendTo( '#pattern-visualizer' )
		.addClass( ['note','transparent'] )
		.prop( 'id', 'note-' + (this.pattern.length - 1) )
		.css( 'transform', "translateY(" + (MAXMIDI - this.pattern[this.pattern.length-1]) * $('#pattern-visualizer').height() / MAXMIDI + "px)" )
		.removeClass( 'transparent' )
		.mousedown( function() {
			self.draggingIdx = this.id.split('-')[1];
			$(this).addClass( 'dragging' );
			$(document).mousemove( (e) => {
				e.preventDefault();
				$(this).css( 'transform', 'translateY(' + e.pageY + 'px)' );
			} );
		});


}

// Adapted from p5.js
Woodshed.prototype.randomGaussian = function(mean, sd = 1) {
  let y1, x1, x2, w;
  if (this._gaussian_previous) {
    y1 = y2;
    this._gaussian_previous = false;
  } else {
    do {
      x1 = Math.random() * 2 - 1;
      x2 = Math.random() * 2 - 1;
      w = x1 * x1 + x2 * x2;
    } while (w >= 1);
    w = Math.sqrt(-2 * Math.log(w) / w);
    y1 = x1 * w;
    y2 = x2 * w;
    this._gaussian_previous = true;
  }
  const m = mean || 0;
  return y1 * sd + m;
};

