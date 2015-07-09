
(function($$) {

	var defaultNoteList = 'own';

	var utilTick		= $$.utilTick;
	var stringToRegExp	= $$.escapeRegExp;
	var isType			= $$.isType;


	function toReqExpAction( action ) {

		if ( action === undefined ) {
			return;
		}

		if ( !isType( action, 'RegExp' ) ) {
			return new RegExp( '^' + stringToRegExp( action ) + '\\.?' );
		}

		return action;
	}


	function toReqExpPath( path ) {

		if ( path === undefined ) {
			return;
		}

		if ( !isType( path, 'RegExp' ) ) {
			return new RegExp( '^' + stringToRegExp( path ) + '$' );
		}

		return path;
	}


	function EventPickerNote() {
		this.list = {};
	}

	EventPickerNote.prototype = {

		List: function( type ) {
			type = type || defaultNoteList;
			return this.list[ type ] = this.list[ type ] || [];
		},

		Length: function( type ) {
			var len = 0;
			var i;

			if ( type !== undefined ) {

			}
			else {

				for ( i in this.list ) {
					len += this.list[i].length;
				}

			}

			return len;
		},
		
		Empty: function( type ) {
			return 0 === this.Length( type );
		},

		Add: function( opt, type ) {
			this.List( opt.type || type ).push( opt );
		}
	};



	function EventPicker( action, treat, self, path, picker ) {
		this.action = action;
		this.treat = treat;
		this.self = self;
		this.path = path;
		this.picker = picker;
		this.wait = 1;
		this.repeat = true;
		this.note = new EventPickerNote();
	}

	EventPicker.prototype = {
		Wait: function() {
			this.wait += 1;
			return this;
		},

		Talk: function() {
			this.wait -= 1;

			if ( this.wait > 0 || this.note.Empty() ) {
				return;
			}

			delete this.picker[ this.treat ];

			this.self.eventTrigger( this );
		},

		Note: function( opt, type ) {
			this.note.Add( opt, type );
			return this;
		}
	};







	function EventListener( opt ) {
		this.listen	= opt.listen;
		this.self	= opt.self;
		this.async	= opt.async;
		
		this.action		= toReqExpAction( opt.action );
		this.path		= toReqExpPath( opt.path );

		this.noteAction	= toReqExpAction( opt.noteAction );
		this.notePath	= toReqExpPath( opt.notePath );

		this.noteList = opt.noteList || defaultNoteList;
	}

	EventListener.prototype = {
		talk: function( opt ) {
			var e = this;

			if ( e.self === opt.exporter ) {
				return;
			}

			if ( e.action && !e.action.test( opt.action ) ) {
				return;
			}

			if ( e.path && !e.path.test( opt.path ) ) {
				return;
			}

			if ( e.notePath || e.noteAction ) {
				var x=0;

				opt.note.list[ e.noteList ].forEach(function( note ) {
					var testOffList=0;

					if ( e.notePath && !e.notePath.test( note.path ) ) {
						testOffList+=1;
					}

					if ( e.noteAction && !e.noteAction.test( note.action ) ) {
						testOffList+=1;
					}

					if ( testOffList===0 ) {
						x+=1;
					}
				});

				if ( x===0 ) {
					return;
				}

			}

			opt.async = opt.async || e.async;

			utilTick( e.self, e.listen, opt );
		},

		is: function( opt ) {
			var action;

			if ( this.action && opt.action ) {
				action = this.action.toString() === toReqExpAction( opt.action ).toString();
			}
			else {
				action = this.action === undefined || opt.action === undefined;
			}

			return ( this.listen === opt.listen && action );
		}
	};




	function Event() {
		this.listener = [];
	}

	Event.prototype = {
		add: function( opt ) {
			var listener,
				list = this.listener;

			for ( var i=0, m=list.length; i<m; i+=1 ) {
				if ( list[i].is( opt ) ) {
					return list[i];
				}
			}

			listener = new EventListener( opt );

			list.push( listener );

			return listener;
		},

		trigger: function( opt ) {
			var list = this.listener;

			for ( var i=0, m=list.length; i<m; i+=1 ) {
				list[i].talk( opt );
			}

			return this;
		},

		remove: function( obj ) {
			var list = this.listener;

			for ( var i=0, m=list.length; i<m; i+=1 ) {
				if ( list[i] === obj ) {
					list.splice( i, 1 );
					break;
				}
			}

			return this;
		}
	};

	$$.defineEvent = function( obj ) {
		Object.defineProperties( obj, {

			__event__: { writabel: true, value: new Event() },
			
			eventListener: {
				value: function ( opt ) {
					opt.self = opt.self || this;
					return this.__event__.add( opt );
				}
			},

			eventTrigger: {
				value: function ( opt ) {
					this.__event__.trigger( opt );
					return this;
				}
			},

			eventPicker: {
				value: function ( opt ) {
					var action, picker, treat, self;

					picker = opt.cache.picker = opt.cache.picker || {};
					action = opt.action || 'task';
					treat = action.split('.')[0];

					if ( picker[ treat ] instanceof EventPicker ) {
						return picker[ treat ].Wait();
					}

					self = opt.self || this;

					return picker[ treat ] = new EventPicker( action, treat, self, opt.path, picker );
				}
			},

			eventRemove: {
				value: function ( opt ) {
					return opt;
				}
			}

		});

		return obj;
	};

})(Crisp);