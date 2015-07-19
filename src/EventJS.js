
(function($$) {

	/**
	 * Evently Crisp functions
	 * @namespace util.event
	 * 
	 * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html|use EventJS}
	 */

	var utilTick		= $$.utilTick;
	var stringToRegExp	= RegExp.escape;
	var isType			= $$.isType;
	
	/**
	 * @private
	 * @type {external:String}
	 * @memberOf util.event
	 */
	var defaultNoteList = 'own';

	/**
	 * Action to RegExp find left string
	 * @private
	 * @param {string} action
	 * @memberOf util.event
	 *
	 * @see  util.event.EventListener
	 * @see  util.event.EventListener#is
	 */
	function toReqExpAction( action ) {
		var list;

		if ( action === undefined ) {
			return;
		}

		if ( isType( action, 'RegExp' ) ) {
			return action;
		}

		list = action.split(' ');

		list.map(function( item ) {
			return stringToRegExp( item );
		});

		return new RegExp( '^' + list.join('|') + '\\.?' );
	}

	/**
	 * Path to RegExp find left string to end
	 * @private
	 * @param {string} path
	 * @memberOf util.event
	 */
	function toReqExpPath( path ) {

		if ( path === undefined ) {
			return;
		}

		if ( !isType( path, 'RegExp' ) ) {
			return new RegExp( '^' + stringToRegExp( path ) + '$' );
		}

		return path;
	}

	/**
	 * @class
	 * @private
	 * @memberOf util.event
	 */
	function EventPickerNote() {
		this.list = {};
	}

	EventPickerNote.prototype = {

		/**
		 * @param {String} type
		 * @returns {Array} List of notes
		 */
		List: function( type ) {
			type = type || defaultNoteList;
			return this.list[ type ] = this.list[ type ] || [];
		},

		/**
		 * @param {String} type
		 * @returns {Number} length List of list
		 */
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
		
		/**
		 * @param {String} type
		 * @returns {Boolen}
		 */
		Empty: function( type ) {
			return 0 === this.Length( type );
		},

		/**
		 * @param {Object} opt
		 * @param {String} type
		 */
		Add: function( opt, type ) {
			this.List( opt.type || type ).push( opt );
		}
	};



	/**
	 * @class
	 * @private
	 * @param {String} action
	 * @param {String} treat
	 * @param {String} self
	 * @param {String} path
	 * @param {Object} picker
	 * @memberOf util.event
	 */
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

		/**
		 * @returns {EventPicker}
		 */
		Wait: function() {
			this.wait += 1;
			return this;
		},

		/**
		 * trigger this event
		 * @returns {EventPicker}
		 */
		Talk: function() {
			this.wait -= 1;

			if ( this.wait > 0 || this.note.Empty() ) {
				return this;
			}

			delete this.picker[ this.treat ];
			this.self.eventTrigger( this );

			return this;
		},

		/**
		 * add note to list
		 * @param {Object} opt
		 * @param {String} type
		 * @returns {EventPicker}
		 */
		Note: function( opt, type ) {
			this.note.Add( opt, type );
			return this;
		}
	};







	/**
	 * @class
	 * @private
	 * @memberOf util.event
	 */
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

		/**
		 * execute event list
		 * @param {Object} opt
		 */
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

				if ( !opt.note ) {
					return;
				}

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

			utilTick( e.self, e.listen, opt, e.async );
		},

		/**
		 * @param {Object} opt
		 * @return {Boolean}
		 */
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



	/**
	 * @class
	 * @private
	 * @memberOf util.event
	 */
	function Event() {
		this.listener = [];
	}

	Event.prototype = {

		/**
		 * @param {Object} opt
		 * @return {EventLintener} existing eventListener or new eventListener
		 */
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

		/**
		 * @param  {Object} opt
		 * @return {Event}
		 */
		trigger: function( opt ) {
			var list = this.listener;

			for ( var i=0, m=list.length; i<m; i+=1 ) {
				list[i].talk( opt );
			}

			return this;
		},

		/**
		 * @param  {EventLinstener} obj
		 * @return {Event}
		 */
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



	/**
	 * Create mothods from EventJS on any Object
	 * @function module:BaseJS.defineEvent
	 * @param  {external:Object} object any Object for initiate EventJS methods
	 * @param  {external:Object} [option]
	 * @param  {external:String} [option.event=__event__] name of event cache property
	 * @param  {external:String} [option.parent=__parent__] name of parent reference property
	 * @return {module:EventJS} returns the given object
	 *
	 * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#defineEvent}
	 * 
	 */
	$$.defineEvent = function( object, option ) {

		/**
		 * @module EventJS
		 * 
		 * @tutorial  {@link http://opencrisp.wca.at/tutorials/EventJS_test.html}
		 * @tutorial  {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#options}
		 * 
		 */

		option = option || {};
		option.event = option.event || '__event__';
		option.parent = option.parent || '__parent__';

		/**
		 * @property {util.event.Event}
		 * @name module:EventJS#__event__
		 *
		 * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#__event__}
		 *
		 * @example
		 * var myObject = {};
		 * Crisp.defineEvent( myObject, { event: '__myevent__' });
		 */
		Object.defineProperty( object, option.event, { writabel: true, value: new Event() });

		/**
		 * @abstract
		 * @property {module:EventJS} 
		 * @name  module:EventJS#__parent__
		 * 
		 * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#__parent__}
		 *
		 * @example
		 * var myObject = {};
		 * Crisp.defineEvent( myObject, { parent: '__myparent__' });
		 */
		



		Object.defineProperties( object, {

			/**
			 * @function
			 * @param {external:Object} opt
			 * @param {util.event.listenCallback} opt.listen
			 * @param {external:Object} [opt.self=this]
			 * @param {external:Boolean} [opt.async=false]
			 * 
			 * @param {external:String|external:RegExp} [opt.action]
			 * @param {external:String|external:RegExp} [opt.path]
			 * 
			 * @param {external:String|external:RegExp} [opt.noteAction] use on eventPicker
			 * @param {external:String|external:RegExp} [opt.notePath] use on eventPicker
			 * @param {external:String} [opt.noteList="own"] use on eventPicker
			 * @return {util.event.EventListener}
			 *
			 * @memberOf module:EventJS
			 *
			 * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#eventListener|eventListener}
			 * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#opt-self|eventListener opt.self}
			 * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#eventtrigger-opt-self|eventListener eventTigger opt.self}
			 * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#opt-self-eventtrigger-opt-self|eventListener opt.self eventTigger opt.self}
			 * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#opt-async|eventListener opt.async}
			 * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#string|eventListener opt.action String}
			 * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#namespace|eventListener opt.action Namespace}
			 * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#regexp|eventListener opt.action RegExp}
			 *
			 * @example
			 * var myObject = {};
			 * 
			 * Crisp.defineEvent( myObject );
			 * 
			 * myObject.eventListener({
			 *   listen: function( e ) {}
			 * });
			 */
			eventListener: {
				value: function ( opt ) {
					opt.self = opt.self || this;
					return this[ option.event ].add( opt );
				}
			},

			/**
			 * @function
			 * @param {external:Object}  [opt]
			 * @param {external:Boolean} [opt.repeat=false]
			 * @param {external:Object}  [opt.exporter]
			 * @param {external:String}  [opt.action]
			 * @param {external:String}  [opt.path]
			 * @return {this}
			 *
			 * @memberOf module:EventJS
			 *
			 * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#eventTrigger}
			 *
			 * @example
			 * var myObject = {};
			 * 
			 * Crisp.defineEvent( myObject );
			 * 
			 * myObject.eventListener({
			 *   listen: function( e ) {}
			 * });
			 *
			 * myObject.eventTrigger();
			 */
			eventTrigger: {
				value: function ( opt ) {
					var parent;

					opt = opt || {};
					opt.self = opt.self || this;
					parent = this[ option.parent ];

					this[ option.event ].trigger( opt );

					if ( opt.repeat && parent && $$.isType( parent.eventTrigger, 'Function' ) ) {
						parent.eventTrigger( opt );
					}

					return this;
				}
			},

			/**
			 * @function
			 * @param {external:Object} opt
			 * @param {external:Object} opt.cache
			 * @param {external:Object} [opt.self=this]
			 * @param {external:String} [opt.action="task"]
			 * @param {external:String} [opt.path]
			 * @return {EventPicker}
			 *
			 * @memberOf module:EventJS
			 *
			 * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS-picker_test.html}
			 *
			 * @example
			 * var myObject = {};
			 * var pickerCache = {};
			 * 
			 * Crisp.defineEvent( myObject );
			 * 
			 * myObject.eventListener({
			 *   listen: function( e ) {
			 *     console.log('action:', e.action );
			 *     console.log('list:', JSON.stringify( e.note ) );
			 *   }
			 * });
			 * 
			 * var picker = myObject.eventPicker({
			 *   cache: pickerCache
			 * });
			 * 
			 * picker.Note({
			 *   action: 'update'
			 * });
			 * 
			 * picker.Talk();
			 * 
			 * // logs:
			 * // action: 'task'
			 * // list: '{"list":{"own":[{"action":"update"}]}}'
			 */
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

			/**
			 * @function
			 * @param {Object} event
			 * @return this
			 *
			 * @memberOf module:EventJS
			 * 
			 * @example
			 * var myObject = {};
			 * 
			 * Crisp.defineEvent( myObject );
			 * 
			 * var eventObject = myObject.eventListener({
			 *   listen: function( e ) {}
			 * });
			 *
			 * myObject.eventRemove( eventObject );
			 */
			eventRemove: {
				value: function ( eventObject ) {
					this[ option.event ].remove( eventObject );
					return this;
				}
			}

		});

		return object;
	};

})(Crisp);