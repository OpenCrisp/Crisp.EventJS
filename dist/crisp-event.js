/*! OpenCrisp EventJS - v0.4.6 - 2016-03-03
* https://github.com/OpenCrisp/Crisp.EventJS
* Copyright (c) 2016 Fabian Schmid; Licensed MIT */
(function($$) {

    /**
     * @typedef {external:String|external:RegExp} util.event.optionFilter
     */

    /**
     * @typedef  {external:Object}  util.event.optionNote
     * @property {external:String}  [action]
     * @property {external:String}  [path]
     *
     * @see  util.event.EventPicker#Note
     * @see  util.event.EventPickerNote#Add
     */

    var nextTick        = $$.nextTick;
    var utilTick        = $$.utilTick;
    var stringToRegExp  = RegExp.escape;
    var type            = $$.type;
    var End             = $$.ns('util.control.End');
    var Noop            = $$.ns('util.control.Noop');


    /**
     * return "own";
     * 
     * @private
     * @type {external:String}
     * @memberOf util.event
     *
     * @example
     * defaultNoteList; // 'own'
     */
    var defaultNoteList = 'own';


    /**
     * return "task";
     * 
     * @private
     * @type {external:String}
     * @memberOf util.event
     *
     * @example
     * defaultPickerAction; // 'task'
     */
    var defaultPickerAction = 'task';

    var defaultOptionEvent = '__event__';
    var defaultOptionParent = '__parent__';

    /**
     * Action to RegExp find left string
     * @private
     * 
     * @param {util.event.optionFilter} [action]
     *
     * @return {external:RegExp}
     * @return {Undefined}
     * 
     * @memberOf util.event
     *
     * @see  util.event.EventListener
     * @see  util.event.EventListener#is
     *
     * @example
     * toRegExpAction('update');        // /^(update)\.?/
     * toRegExpAction('update.doc');    // /^(update\.doc)\.?/
     * toRegExpAction('update insert'); // /^(update|insert)\.?/
     *
     * toRegExpAction(/^update\.?/);    // /^update\.?/
     *
     * toRegExpAction();                // undefined
     */
    function toReqExpAction( action ) {
        var list;

        if ( action === undefined ) {
            return;
        }

        if ( type.call( action, 'RegExp' ) ) {
            return action;
        }

        list = action.split(' ');

        list.map(function( item ) {
            return stringToRegExp( item );
        });

        return new RegExp( '(^|\\s)(' + list.join('|') + ')($|\\s|\\.)' );
    }


    /**
     * Path to RegExp find left string to end
     * @private
     * 
     * @param {util.event.optionFilter} [path]
     *
     * @return {external:RegExp}
     * @return {Undefined}
     * 
     * @memberOf util.event
     *
     * @example
     * toReqExpPath('doc');         // /^(doc)$/
     * toReqExpPath('doc.a');       // /^(doc\.a)$/
     * toReqExpPath('doc doc.a');   // /^(doc|doc\.a)$/
     *
     * toReqExpPath(/^doc\.?/);     // /^doc\.?/
     *
     * toReqExpPath();              // undefined
     */
    function toReqExpPath( path ) {
        var list;

        if ( path === undefined ) {
            return;
        }

        if ( type.call( path, 'RegExp' ) ) {
            return path;
        }

        list = path.split(' ');

        list.map(function( item ) {
            return stringToRegExp( item );
        });

        return new RegExp( '^(' + list.join('|') + ')$' );
    }

    /**
     * @class
     * @private
     * @memberOf util.event
     */
    function EventPickerNote() {
        /**
         * Object of actions
         * @type {external:Object<...util.event.optionNote>}
         */
        this._list = {};
    }

    EventPickerNote.prototype = {

        /**
         * @param     {external:String} [type={@link util.event.defaultNoteList}]
         *
         * @this util.event.EventPickerNote
         * @returns {...util.event.optionNote} List of notes
         */
        List: function( type ) {
            type = type || defaultNoteList;
            return this._list[ type ] = this._list[ type ] || [];
        },

        /**
         * @param {external:String} type
         *
         * @this util.event.EventPickerNote
         * @returns {external:Number} length List of list
         */
        Length: function( type ) {
            var len = 0;
            var i;

            if ( type !== undefined ) {

            }
            else {

                for ( i in this._list ) {
                    len += this._list[i].length;
                }

            }

            return len;
        },
        
        /**
         * @param {external:String} type
         *
         * @this util.event.EventPickerNote
         * @returns {external:Boolean}
         */
        Empty: function( type ) {
            return 0 === this.Length( type );
        },

        /**
         * @param {util.event.optionNote} option
         * @param {external:String} [type=option.type]
         *
         * @this util.event.EventPickerNote
         */
        Add: function( option, type ) {
            this.List( option.type || type ).push( option );
        }
    };



    /**
     * @class
     * @private
     * 
     * @param {module:EventJS}         self
     * @param {external:Object}        picker
     * @param {external:String}        action
     * @param {external:String}        treat
     * @param {external:String}        [path]
     * @param {external:Boolean}       [empty]
     * 
     * @memberOf util.event
     */
    function EventPicker( self, picker, action, treat, path, empty ) {
        this.self = self;
        this.action = action;
        this.path = path;
        this.repeat = true;
        this.picker = picker;

        this._treat = treat;
        this._empty = empty;

        this._wait = 1;
        this._note = new EventPickerNote();
        
    }

    EventPicker.prototype = {

        /**
         * @this util.event.EventPicker
         * @returns {util.event.EventPicker}
         */
        Wait: function() {
            this._wait += 1;
            return this;
        },

        /**
         * trigger this event
         * 
         * @this util.event.EventPicker
         * @returns {util.event.EventPicker}
         */
        Talk: function() {
            this._wait -= 1;

            if ( this._wait > 0 || ( !this._empty && this._note.Empty() ) ) {
                return this;
            }

            return this.End();
        },

        /**
         * trigger this event
         * 
         * @this util.event.EventPicker
         * @returns {util.event.EventPicker}
         */
        End: function() {
            this._wait = 0;

            delete this.picker[ this._treat ];
            this.self.eventTrigger( this );

            return this;
        },

        /**
         * add note to list
         * 
         * @param {util.event.optionNote} option
         * @param {external:String} type
         * 
         * @this util.event.EventPicker
         * @returns {util.event.EventPicker}
         */
        Note: function( option, type ) {
            this._note.Add( option, type );
            return this;
        },

        /**
         * returns the object of note Lists
         * 
         */
        List: function( type ) {
            return this._note.List( type );
        },

        Test: function( event ) {
            var x=0;

            this._note.List( event._noteList ).forEach(function( note ) {
                var testOffList=0;

                if ( event._notePath && !event._notePath.test( note.path ) ) {
                    testOffList+=1;
                }

                if ( event._noteAction && !event._noteAction.test( note.action ) ) {
                    testOffList+=1;
                }

                if ( testOffList===0 ) {
                    x+=1;
                }
            });

            return x===0;
        }

    };







    /**
     * @class
     * @private
     *
     * @param {external:Object}                 option
     * @param {util.utilTickCallback}           option.listen           initialice {@link util.event.EventListener#_listen}
     * @param {*}                               option.self             initialice {@link util.event.EventListener#_self}
     * @param {external:Boolean}                [option.async]          initialice {@link util.event.EventListener#_async}
     * @param {util.event.optionFilter}         [option.action]         initialice {@link util.event.EventListener#_action}
     * @param {util.event.optionFilter}         [option.path]           initialice {@link util.event.EventListener#_path}
     * @param {external:String}                 [option.noteList={@link util.event.defaultNoteList}]    initialice {@link util.event.EventListener#_noteList}
     * @param {util.event.optionFilter}         [option.noteAction]     initialice {@link util.event.EventListener#_noteAction}
     * @param {util.event.optionFilter}         [option.notePath]       initialice {@link util.event.EventListener#_notePath}
     * 
     * @memberOf util.event
     */
    function EventListener( option ) {
        /**
         * function for callback
         * @private
         * @type {util.utilTickCallback}
         */
        this._listen = option.listen;

        /**
         * object for apply {@link util.event.EventListener#_listen}
         * @private
         * @type {*}
         */
        this._self = option.self;

        /**
         * enabled the asynchronus apply of {@link util.event.EventListener#_listen} with {@link module:BaseJS.utilTick}
         * @private
         * @type {external:Boolean}
         */
        this._async = option.async;
        
        /**
         * Regular Expression for {@link util.event.EventListener#talk} apply test 
         * @private
         * @type {external:RegExp}
         */
        this._action = toReqExpAction( option.action );

        /**
         * Regular Expression for {@link util.event.EventListener#talk} apply test 
         * @private
         * @type {external:RegExp}
         */
        this._path = toReqExpPath( option.path );


        /**
         * Regular Expression for {@link util.event.EventListener#talk} apply test 
         * @private
         * @type {external:RegExp}
         */
        this._noteAction = toReqExpAction( option.noteAction );

        /**
         * Regular Expression for {@link util.event.EventListener#talk} apply test 
         * @private
         * @type {external:RegExp}
         */
        this._notePath = toReqExpPath( option.notePath );

        /**
         * name of noteList
         * @private
         * @type {external:String}
         */
        this._noteList = option.noteList || defaultNoteList;
    }

    EventListener.prototype = {

        /**
         * execute event list
         * @param {external:Object} option
         */
        talk: function( option ) {
            if ( this._self === option.exporter ) {
                return;
            }

            if ( this._action && !this._action.test( option.action ) ) {
                return;
            }

            if ( this._path && !this._path.test( option.path ) ) {
                return;
            }

            if ( this._notePath || this._noteAction ) {

                if ( !(option instanceof EventPicker) || option.Test( this ) ) {
                    return;
                }

            }

            utilTick( this._self, this._listen, option, this._async );
        },

        /**
         * @param  {external:Object} option
         * @return {external:Boolean}
         */
        is: function( option ) {
            var action;

            if ( this._action && option.action ) {
                action = this._action.toString() === toReqExpAction( option.action ).toString();
            }
            else {
                action = this._action === undefined || option.action === undefined;
            }

            return ( this._listen === option.listen && action );
        }
    };



    /**
     * @class
     * @private
     * @memberOf util.event
     * 
     * @requires BaseJS
     */
    function Event() {
        /**
         * list of all registered eventListener
         * @private
         * @type {external:Array<util.event.EventListener>}
         */
        this._listener = [];
    }

    Event.prototype = {

        /**
         * @param {external:Object} opt
         * @return {util.event.EventLintener} existing eventListener or new eventListener
         */
        add: function( opt ) {
            var listener,
                list = this._listener;

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
            var list = this._listener;

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
            var list = this._listener;

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
     * @private
     * 
     * @param  {util.event.EventListener}   option
     * @param  {external:Object}            [option.self=this]
     * @param  {util.event.__event__|module:EventJS#__event__} propertyEvent
     * 
     * @return {util.event.EventListener}
     *
     * @memberOf util.event
     *
     * @see  util.event#eventListener
     * @see  module:EventJS.eventListener
     */
    function eventListener( option, propertyEvent ) {
        option.self = option.self || this;
        return propertyEvent.add( option );
    }



    /**
     * @private
     * 
     * @param  {util.event.EventListener#talk}                      [option]
     * @param  {external:Object}                                    [option.self=this]
     * @param  {util.event.__event__|module:EventJS#__event__}      propertyEvent
     * @param  {util.event.__parent__|module:EventJS#__parent__}    propertyParent
     * 
     * @this {this}
     * @return {this}
     *
     * @memberOf util.event
     *
     * @see  util.event#eventTrigger
     * @see  module:EventJS.eventTrigger
     */
    function eventTrigger( option, propertyEvent, propertyParent ) {
        option = option || {};
        option.self = option.self || this;

        propertyEvent.trigger( option );

        if ( option.repeat && propertyParent && type.call( propertyParent.eventTrigger, 'Function' ) ) {
            propertyParent.eventTrigger( option );
        }

        return this;
    }



    /**
     * @private
     * 
     * @param  {util.event.eventPicker}   option
     *
     * @this {this}
     * @return {util.event.EventPicker}
     *
     * @memberOf util.event
     *
     * @see  util.event#eventPicker
     * @see  module:EventJS.eventPicker
     */
    function eventPicker( option ) {
        var action, picker, treat;

        picker = option.cache.picker = option.cache.picker || {};
        action = option.action || defaultPickerAction;
        treat = action.split('.')[0];

        if ( picker[ treat ] instanceof EventPicker ) {
            return picker[ treat ].Wait();
        }

        // Extension for Crisp.PropsJS
        if ( !option.path && type.call( this.docPath, 'Function' ) ) {
            option.path = this.docPath();
        }

        return picker[ treat ] = new EventPicker( this, picker, action, treat, option.path, option.empty );
    }



    /**
     * @private
     * 
     * @param  {util.event.EventListener}                       eventObject
     * @param  {util.event.__event__|module:EventJS#__event__}  propertyEvent
     * 
     * @return {this}
     *
     * @memberOf util.event
     *
     * @see  util.event#eventRemove
     * @see  module:EventJS.eventRemove
     */
    function eventRemove( eventObject, propertyEvent ) {
        propertyEvent.remove( eventObject );
        return this;
    }



    var iniEvent    = { name: 'event', preset: function() { return new Event(); }, insert: true };
    var iniParent   = { name: 'parent', preset: {} };
    var conProperty = { proWri: true };


    $$.ns('util.event').options = {

        /**
         * @property {util.event.Event}
         * @name util.event.__event__
         */
        'event': conProperty
    };


    $$.ns('util.event').prototypes = {

        /**
         * @param {util.event.EventListener} option
         *
         * @this module:CreateJS
         * @return {util.event.EventListener}
         *
         * @implements {util.event.eventListener}
         * @memberOf   util.event.prototype
         *
         * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS-CreateJS_test.html#eventListener}
         *
         * @example
         * var myObject = Crisp.utilCreate({
         *     ns: 'util.event'
         * }).objIni();
         * 
         * myObject.eventListener({
         *     listen: function( e ) {
         *         assert.strictEqual( myObject, this );
         *         assert.strictEqual( myObject, e.self );
         *     }
         * });
         * 
         * myObject.eventTrigger();
         */
        eventListener: function( option ) {
            return eventListener.call( this, option, this._( iniEvent ) );
        },

        /**
         * @param {util.event.EventListener#talk} option
         *
         * @this module:CreateJS
         * @return {module:CreateJS}
         *
         * @implements {util.event.eventTrigger}
         * @memberOf   util.event.prototype
         *
         * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS-CreateJS_test.html#eventListener}
         *
         * @example
         * var myObject = Crisp.utilCreate({
         *     ns: 'util.event'
         * }).objIni();
         * 
         * myObject.eventListener({
         *     listen: function( e ) {
         *         assert.strictEqual( myObject, this );
         *         assert.strictEqual( myObject, e.self );
         *     }
         * });
         * 
         * myObject.eventTrigger();
         */
        eventTrigger: function( option ) {
            return eventTrigger.call( this, option, this._( iniEvent ), this._( iniParent ) );
        },

        /**
         * @param  {util.event.eventPicker} option
         *
         * @this   module:CreateJS
         * @return {util.event.EventPicker}
         *
         * @implements {util.event.eventPicker}
         * @memberOf   util.event.prototype
         *
         * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS-CreateJS_test.html#eventPicker}
         *
         * @example
         * var myObject = Crisp.utilCreate({
         *     ns: 'util.event'
         * }).objIni();
         * 
         * var pickerCache = {};
         * 
         * myObject.eventListener({
         *     listen: function( e ) {
         *         assert.strictEqual( 'task', e.action );
         *         assert.strictEqual( '{"_list":{"own":[{"action":"update"}]}}', JSON.stringify( e._note ) );
         *         assert.strictEqual( myObject, this );
         *         assert.strictEqual( myObject, e.self );
         *     }
         * });
         * 
         * var picker = myObject.eventPicker({
         *     cache: pickerCache
         * });
         * 
         * picker.Note({
         *     action: 'update'
         * });
         * 
         * picker.Talk();
         */
        eventPicker: eventPicker,

        /**
         * @param {util.event.EventListener} eventObject
         *
         * @this   module:CreateJS
         * @return {module:CreateJS}
         *
         * @implements {util.event.eventRemove}
         * @memberOf   util.event.prototype
         *
         * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS-CreateJS_test.html#eventRemove}
         *
         * @example
         * var myObject = Crisp.utilCreate({
         *     ns: 'util.event'
         * }).objIni();
         * 
         * var eventObject = myObject.eventListener({
         *     listen: function( e ) {
         *         assert.strictEqual( myObject, this );
         *         assert.strictEqual( myObject, e.self );
         *     }
         * });
         * 
         * myObject.eventTrigger();
         * 
         * myObject.eventRemove( eventObject );
         * myObject.eventTrigger();
         */
        eventRemove: function( eventObject ) {
            return eventRemove.call( this, eventObject, this._( iniEvent ) );
        }

    };


    function defaultOption( opt ) {
        opt = opt || {};
        opt.event = opt.event || defaultOptionEvent;
        opt.parent = opt.parent || defaultOptionParent;
        return opt;
    }

    /**
     * Create mothods from EventJS on any Object
     * @function module:BaseJS.defineEvent
     * @param  {external:Object} moduleObject any Object for initiate EventJS methods
     * @param  {external:Object} [moduleOption]
     * @param  {external:String} [moduleOption.event=__event__] name of event cache property
     * @param  {external:String} [moduleOption.parent=__parent__] name of parent reference property
     * @return {module:EventJS} returns the given moduleObject
     *
     * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#defineEvent}
     * 
     */
    function defineEvent( moduleObject, moduleOption ) {

        /**
         * define all event functions on your own object
         * 
         * @module EventJS
         * 
         * @tutorial  {@link http://opencrisp.wca.at/tutorials/EventJS_test.html}
         * @tutorial  {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#options}
         *
         * @see  use option.ns={@link util.event} with {@link module:BaseJS.utilCreate}
         *
         * @example
         * var myObject = {};
         * 
         * Crisp.defineEvent( myObject );
         * 
         * myObject.eventListener({
         *     listen: function( e ) {
         *         assert.strictEqual( myObject, this );
         *         assert.strictEqual( myObject, e.self );
         *     }
         * });
         * 
         * myObject.eventTrigger();
         */

        // moduleOption = moduleOption || {};
        // moduleOption.event = moduleOption.event || defaultOptionEvent;
        // moduleOption.parent = moduleOption.parent || defaultOptionParent;
        moduleOption = defaultOption( moduleOption );

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
        Object.defineProperty( moduleObject, moduleOption.event, { writabel: true, value: new Event() });

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
        



        Object.defineProperties( moduleObject, {

            /**
             * @function
             * @param {external:Object}                 option
             * @param {util.utilTickCallback}           option.listen
             * @param {external:Object}                 [option.self={@link module:EventJS|EventJS}]
             * @param {external:Boolean}                [option.async=false]
             * 
             * @param {util.event.optionFilter}         [option.action]
             * @param {util.event.optionFilter}         [option.path]
             * 
             * @param {external:String}                 [option.noteList={@link util.event.defaultNoteList|defaultNoteList}] use on eventPicker
             * @param {util.event.optionFilter}         [option.noteAction] use on eventPicker
             * @param {util.event.optionFilter}         [option.notePath] use on eventPicker
             *
             * @this module:EventJS
             * @return {util.event.EventListener}
             *
             * @memberOf module:EventJS
             *
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#eventListener|eventListener}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#option-self|eventListener option.self}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#eventtrigger-option-self|eventListener eventTrigger option.self}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#option-self-eventtrigger-option-self|eventListener option.self eventTrigger option.self}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#option-async|eventListener option.async}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#action-string|eventListener option.action String}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#action-namespace|eventListener option.action Namespace}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#action-regexp|eventListener option.action RegExp}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#path-string|eventListener option.path String}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#path-regexp|eventListener option.path RegExp}
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
                value: function ( option ) {
                    return eventListener.call( this, option, this[ moduleOption.event ] );
                }
            },

            /**
             * @function
             * @param {external:Object}  [option]
             * @param {external:Boolean} [option.repeat=false]
             * @param {external:Object}  [option.exporter]      ignore the eventListener function if eventListener(option.self) is the same as eventTrigger(option.exporter) 
             * 
             * @param {external:String}  [option.action]
             * @param {external:String}  [option.path]
             * 
             * @param {AnyItem}          [option.args]          alternate arguments for apply the eventListener function
             *
             * @this module:EventJS
             * @return {module:EventJS}
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
                value: function ( option ) {
                    return eventTrigger.call( this, option, this[ moduleOption.event ], this[ moduleOption.parent ] );
                }
            },

            /**
             * @function
             * @param {external:Object} option
             * @param {external:Object} option.cache
             * @param {external:String} [option.action={@link util.event.defaultPickerAction}]
             * @param {external:String} [option.path]
             * @param {external:Boolean} [option.empty] execute event when nodelist is empty 
             *
             * @this module:EventJS
             * @return {util.event.EventPicker}
             *
             * @memberOf module:EventJS
             *
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS-picker_test.html}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS-picker_test.html#eventpicker|eventPicker}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS-picker_test.html#option-action|eventPicker option.action}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS-picker_test.html#option-path|eventPicker option.path}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS-picker_test.html#multi-note|eventPicker multi note}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS-picker_test.html#eventlistener-filter-path|eventPicker eventListener filter path}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS-picker_test.html#eventlistener-filter-notepath|eventPicker eventListener filter notePath}
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS-picker_test.html#eventlistener-filter-noteaction|eventPicker eventListener filter noteAction}
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
             *     console.log('list:', JSON.stringify( e._note ) );
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
                value: eventPicker
            },

            /**
             * @function
             * @param {util.event.EventListener} eventObject
             * 
             * @this module:EventJS
             * @return {module:EventJS}
             *
             * @memberOf module:EventJS
             * 
             * @tutorial {@link http://opencrisp.wca.at/tutorials/EventJS_test.html#eventRemove}
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
                    return eventRemove.call( this, eventObject, this[ moduleOption.event ] );
                }
            }

        });

        return moduleObject;
    }

    $$.defineEvent = defineEvent;


    /**
     * The hasOwnEvent() method returns a boolean indicating whether the moduleObject has specified the Event module 
     * @param  {external:Object} moduleObject any Object for initiate EventJS methods
     * @param  {external:Object} [moduleOption]
     * @param  {external:String} [moduleOption.event=__event__] name of event cache property
     * @param  {external:String} [moduleOption.parent=__parent__] name of parent reference property
     * @return {Boolean}              [description]
     */
    function hasOwnEvent( moduleObject, moduleOption ) {
        moduleOption = defaultOption( moduleOption );
        return moduleObject.hasOwnProperty( moduleOption.event ) && ( moduleObject[ moduleOption.event ] instanceof Event );
    }

    $$.hasOwnEvent = hasOwnEvent;



    function nextTickPick( methodCallback, self, opt, success, picker ) {
        methodCallback.call( self, opt, success, picker );
        picker.Talk();
    }

    function utilPick( methodCallback, methodSchema ) {
        function tackPick( opt, success, complete ) {
            var event = {};
            var picker;

            success = success || Noop;
            
            $$.defineEvent( event );

            if ( complete ) {
                event.eventListener({
                    self: this,
                    listen: complete
                });
            }
            
            picker = event.eventPicker({
                cache: {},
                empty: true
            });

            if ( opt.async ) {
                nextTick( nextTickPick, methodCallback, this, opt, success, picker );
            }
            else {
                methodCallback.call( this, opt, success, picker );
                picker.Talk();
            }

            return this;
        }

        Object.defineProperty( tackPick, 'tick', { value: methodSchema || true });
        Object.defineProperty( tackPick, 'callback', { value: methodCallback });

        return tackPick;
    }

    $$.utilPick = utilPick;






    function nextTickTask( methodCallback, self, opt, success, type ) {
        var eventTask, eventChanged;

        eventTask = self.eventPicker({
            cache: opt,
            action: 'task.doc.' + type
        });

        eventChanged = self.eventPicker({
            cache: opt,
            action: 'changed.doc.' + type
        });

        function note( task ) {
            if (task instanceof End) {
                eventTask.End();
                eventChanged.End();
                throw task;
            }

            self.eventTrigger( task );
            eventTask.Note( task );
            eventChanged.Note( task );
        }

        methodCallback.call( self, opt, success, note );

        eventTask.Talk();
        eventChanged.Talk();
    }

    /**
     * [utilTask description]
     * @param  {external.Function} methodCallback [description]
     * @param  {external.String} methodType     [description]
     * @param  {external.Array} methodSchema   [description]
     * @return {this}                [description]
     */
    function utilTask( methodCallback, methodType, methodSchema ) {
        function tackTask( opt, success ) {
            var async;

            success = success || Noop;
            
            if ( opt.async ) {
                async = opt.async;
                delete opt.async;
            }

            if ( async ) {
                nextTick( nextTickTask, methodCallback, this, opt, success, methodType );
            }
            else {
                nextTickTask( methodCallback, this, opt, success, methodType );
            }

            return this;
        }

        Object.defineProperty( tackTask, 'task', { value: methodSchema || true });
        Object.defineProperty( tackTask, 'callback', { value: methodCallback });

        return tackTask;
    }

    $$.utilTask = utilTask;

})(Crisp);