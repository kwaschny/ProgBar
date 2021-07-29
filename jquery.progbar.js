ProgBar = function(element, options) {

	// prevent skipping the constructor
	if (!(this instanceof ProgBar)) {

		return new ProgBar(element, options);
	}

	// check dependency
	if (typeof jQuery === 'undefined') {

		throw new Error('ProgBar requires jQuery. Make sure jQuery is loaded before ProgBar.');
	}

	var self = this;

	// track state of closeIn() animation to be able to complete it prematurely
	this.closingIn = false;

	/* BEGIN: public methods */

		this.run = function(duration, callback) {
			//     function(duration)
			//     function(callback)
			//     function()

			if (typeof duration === 'function') {

				callback = duration;
				duration = undefined;
			}

			var normalizedDuration = self._normalizeDuration(duration);

			self.innerBar.animate({ width: '100%' }, normalizedDuration, callback);

			return self;
		};

		this.reverse = function(duration, callback) {
			//         function(duration)
			//         function(callback)
			//         function()

			if (typeof duration === 'function') {

				callback = duration;
				duration = undefined;
			}

			var normalizedDuration = self._normalizeDuration(duration);

			self.innerBar.animate({ width: '0%' }, normalizedDuration, callback);

			return self;
		};

		this.closeIn = function(duration) {

			var normalizedDuration = self._normalizeDuration(duration);

			self.closingIn = true;

			self.innerBar.animate({ width: '90%' }, normalizedDuration, function() {

				self.innerBar.animate({ width: '100%' }, normalizedDuration * 10, function() {

					self.closingIn = false;
				});
			});

			return self;
		};

		this.fadeOut = function() {

			if (self.closingIn === true) {

				self.innerBar.stop();
				self.innerBar.animate({ width: '100%' }, 200, function() {

					self.innerBar.css('width', '0%');
				});

			} else {

				self.innerBar.css('width', '0%');
			}

			self.closingIn = false;
		};

		this.reset = function() {

			self.innerBar.stop().css('width', '0%');
			self.closingIn = false;
		};

		this.val = function(value, duration, callback) {
			//     function(value, duration)
			//     function(value, callback)
			//     function(value)

			if (typeof duration === 'function') {

				callback = duration;
				duration = undefined;
			}

			if (self.options.minValue > self.options.maxValue) {

				console.error('ProgBar: minValue is greater than maxValue');
				return self;
			}

			if (typeof value === 'string') {

				var cast = parseInt(value, 10);
				if (!isNaN(cast)) { value = cast; }
			}

			if (typeof value !== 'number') {

				console.warn('ProgBar: desired value is not a number');
				return self;
			}

			if (value < self.options.minValue) {

				console.warn('ProgBar: desired value is less than minValue');
				value = self.options.minValue;

			} else if (value > self.options.maxValue) {

				console.warn('ProgBar: desired value is greater than maxValue');
				value = self.options.maxValue;
			}

			var percentage 			= (self._getPercentage(value) + '%');
			var normalizedDuration 	= self._normalizeDuration(duration);

			self.innerBar.stop().animate({ width: percentage }, normalizedDuration, callback);

			return self;
		};

		this.min = function(value) {

			if (typeof value !== 'number') { return; }

			self.options.minValue = value;
		};

		this.max = function(value) {

			if (typeof value !== 'number') { return; }

			self.options.maxValue = value;
		};

	/* END: public methods */

	/* BEGIN: options */

		var defaultOptions = {

			width: 		'100%',
			height: 	'4px',

			color: 		'#2672EC',
			outerClass: 'progbar-outer',
			innerClass: 'progbar-inner',

			duration: 	3000,

			minValue: 	0,
			maxValue: 	100

		};

		if (typeof options === 'string') {

			options = { color: options };

		} else if (typeof options === 'number') {

			options = { duration: options };
		}

		// merge
		this.options = jQuery.extend(defaultOptions, options);

	/* END: options */

	/* BEGIN: inner bar */

		this.innerBar = jQuery('<div>');

		if (this.options.innerClass) {

			this.innerBar.addClass(this.options.innerClass);
		}

		this.innerBar.css({
			width: 				'0%',
			height: 			'100%',
			backgroundColor: 	this.options.color
		});

	/* END: inner bar */

	/* BEGIN: outer bar */

		this.outerBar = jQuery(element);

		if (this.options.outerClass) {

			this.outerBar.addClass(this.options.outerClass);
		}

		if (this.outerBar.width() === 0) {

			this.outerBar.css('width', this.options.width);
		}
		if (this.outerBar.height() === 0) {

			this.outerBar.css('height', this.options.height);
		}

		this.outerBar
			.empty()
			.append(this.innerBar)
		;

	/* END: outer bar */

	/* BEGIN: private methods */

		this._getPercentage = function(value) {

			var ratio  = ((value - self.options.minValue) / (self.options.maxValue - self.options.minValue));
				ratio *= 100;

			return Math.min(ratio, 100).toFixed(0);
		};

		this._normalizeDuration = function(duration) {

			if ((typeof duration !== 'number') || (duration <= 0)) {

				duration = self.options.duration;
			}

			if (duration < 100) {

				duration *= 1000;
			}

			return duration;
		};

	/* END: private methods */

	this.version = '0.1.1';

};