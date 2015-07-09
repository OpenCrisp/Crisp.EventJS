
(function(g) {

	var toType = Object.prototype.toString;
	var escapeRegExp = /[.*+?^${}()|[\]\\]/g;

	function utilTick( self, fn, opt ) {
		fn.call( self, opt );

		if ( typeof opt.complete === 'function' ) {
			opt.complete.call( opt.self, opt );
		}
	}

	function Crisp() {}

	Crisp.prototype = {
		
		utilTick: function( self, fn, opt ) {
			opt = opt || {};
			opt.self = opt.self || self;

			if ( opt.async ) {
				delete opt.async;
				setTimeout( utilTick, 0, self, fn, opt );
			}
			else {
				utilTick( self, fn, opt );
			}
		},

		escapeRegExp: function( str ) {
			return str.replace( escapeRegExp, "\\$&" );
		},

		isType: function( obj, type ) {
			return toType.call( obj ) === '[object '.concat( type, ']' );
		}

	};

	g.Crisp = new Crisp();



})(typeof process !== 'undefined' && typeof process.title !== 'undefined' && typeof global !== 'undefined' ? global : window);
