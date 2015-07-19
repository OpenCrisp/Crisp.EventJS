
// ## EventJS
// [doc of EventJS](http://opencrisp.wca.at/docs/module-EventJS.html)


// ### Options
// #### __event__
// [doc of EventJS option __event__](http://opencrisp.wca.at/docs/module-EventJS.html#__event__)
exports['option __event__'] = function(assert) {
	var done = assert.done || assert.async();
	assert.expect(4);
		
	var myObject = {};
	assert.ok( !myObject.hasOwnProperty('__event__') );

	Crisp.defineEvent( myObject );
	assert.ok( myObject.hasOwnProperty('__event__') );

	myObject.eventListener({
		listen: function( e ) {
			assert.strictEqual( myObject, this );
			assert.strictEqual( myObject, e.self );
		}
	});

	myObject.eventTrigger();

	done();
};


// rename the option of __event__
exports['option __event__ rename'] = function(assert) {
	var done = assert.done || assert.async();
	assert.expect(5);
		
	var myObject = {};
	assert.ok( !myObject.hasOwnProperty('__myevent__') );

	Crisp.defineEvent( myObject, { event: '__myevent__' });
	assert.ok( myObject.hasOwnProperty('__myevent__') );
	assert.ok( !myObject.hasOwnProperty('__event__') );

	myObject.eventListener({
		listen: function( e ) {
			assert.strictEqual( myObject, this );
			assert.strictEqual( myObject, e.self );
		}
	});

	myObject.eventTrigger();

	done();
};


// #### __parent__
// [doc of EventJS option __parent__](http://opencrisp.wca.at/docs/module-EventJS.html#__parent__)
exports['option __parent__'] = function(assert) {
	var done = assert.done || assert.async();
	assert.expect(6);
	
	var myChild = {};
	var myObject = { a: myChild };

	Object.defineProperty( myChild, '__parent__', { value: myObject });

	Crisp.defineEvent( myChild );
	Crisp.defineEvent( myObject );

	assert.ok( myChild.hasOwnProperty('__parent__') );
	assert.ok( !myObject.hasOwnProperty('__parent__') );

	myChild.eventListener({
		listen: function( e ) {
			assert.strictEqual( myChild, this );
			assert.strictEqual( myChild, e.self );
		}
	});

	myObject.eventListener({
		listen: function( e ) {
			assert.strictEqual( myObject, this );
			assert.strictEqual( myChild, e.self );
		}
	});

	myChild.eventTrigger({
		repeat: true
	});

	done();
};


// rename the option of __parent__
exports['option __parent__ rename'] = function(assert) {
	var done = assert.done || assert.async();
	assert.expect(6);
		
	var myChild = {};
	var myObject = { a: myChild };

	Object.defineProperty( myChild, '__myparent__', { value: myObject });

	Crisp.defineEvent( myChild, { parent: '__myparent__' });
	Crisp.defineEvent( myObject );

	assert.ok( myChild.hasOwnProperty('__myparent__') );
	assert.ok( !myObject.hasOwnProperty('__myparent__') );

	myChild.eventListener({
		listen: function( e ) {
			assert.strictEqual( myChild, this );
			assert.strictEqual( myChild, e.self );
		}
	});

	myObject.eventListener({
		listen: function( e ) {
			assert.strictEqual( myObject, this );
			assert.strictEqual( myChild, e.self );
		}
	});

	myChild.eventTrigger({
		repeat: true
	});

	done();
};








// ### eventListener
// [doc of eventListener](http://opencrisp.wca.at/docs/module-EventJS.html#eventListener)
exports['eventListener opt.listen'] = function(assert) {
	var done = assert.done || assert.async();
	assert.expect(2);
	
	var myObject = {};

	Crisp.defineEvent( myObject );

	myObject.eventListener({
		listen: function( e ) {
			assert.strictEqual( myObject, this );
			assert.strictEqual( myObject, e.self );
		}
	});

	myObject.eventTrigger();

	done();
};


// #### opt.self
exports['eventListener opt.self'] = function(assert) {
	var done = assert.done || assert.async();
	assert.expect(2);
	
	var myObject = {};
	var optListenerSelf = {};

	Crisp.defineEvent( myObject );

	myObject.eventListener({
		self: optListenerSelf,
		listen: function( e ) {
			assert.strictEqual( optListenerSelf, this );
			assert.strictEqual( myObject, e.self );
		}
	});

	myObject.eventTrigger();

	done();
};


// #### eventTrigger opt.self
exports['eventListener eventTrigger opt.self'] = function(assert) {
	var done = assert.done || assert.async();
	assert.expect(2);
	
	var myObject = {};
	var optTriggerSelf = {};

	Crisp.defineEvent( myObject );

	myObject.eventListener({
		listen: function( e ) {
			assert.strictEqual( myObject, this );
			assert.strictEqual( optTriggerSelf, e.self );
		}
	});

	myObject.eventTrigger({
		self: optTriggerSelf
	});

	done();
};


// #### opt.self eventTrigger opt.self
exports['eventListener opt.self eventTrigger opt.self'] = function(assert) {
	var done = assert.done || assert.async();
	assert.expect(2);
	
	var myObject = {};
	var optListenerSelf = {};
	var optTriggerSelf = {};

	Crisp.defineEvent( myObject );

	myObject.eventListener({
		self: optListenerSelf,
		listen: function( e ) {
			assert.strictEqual( optListenerSelf, this );
			assert.strictEqual( optTriggerSelf, e.self );
		}
	});

	myObject.eventTrigger({
		self: optTriggerSelf
	});

	done();
};


// #### opt.async
exports['eventListener opt.async'] = function(assert) {
	var done = assert.done || assert.async();
	assert.expect(3);

	var count = 0;
	var myObject = {};

	Crisp.defineEvent( myObject );

	myObject.eventListener({
		async: true,
		listen: function( e ) {
			assert.strictEqual( myObject, this );
			assert.strictEqual( myObject, e.self );
			count += 1;
			
			done();
		}
	});

	myObject.eventTrigger();

	assert.strictEqual( 0, count );
};


// #### opt.action

// ##### String
exports['opt.action {String}'] = function(assert) {
	var done = assert.done || assert.async();
	assert.expect(3);

	var myObject = {};
	Crisp.defineEvent( myObject );

	myObject.eventListener({
		action: 'change',
		listen: function( e ) {
			assert.strictEqual( 'change', e.action );
			assert.strictEqual( myObject, this );
			assert.strictEqual( myObject, e.self );
		}
	});

	myObject.eventTrigger({
		action: 'change'
	});

	done();
};


// ##### Namespace
exports['opt.action {String} Namespace'] = function(assert) {
	var done = assert.done || assert.async();
	assert.expect(3);

	var myObject = {};
	Crisp.defineEvent( myObject );

	myObject.eventListener({
		action: 'change',
		listen: function( e ) {
			assert.strictEqual( 'change.doc', e.action );
			assert.strictEqual( myObject, this );
			assert.strictEqual( myObject, e.self );
		}
	});

	myObject.eventTrigger({
		action: 'change.doc'
	});

	done();
};


// ##### RegExp
exports['opt.action {RegExp}'] = function(assert) {
	var done = assert.done || assert.async();

	var myObject = {};
	Crisp.defineEvent( myObject );

	myObject.eventListener({
		action: /\.doc$/,
		listen: function( e ) {
			assert.strictEqual( 'change.doc', e.action );
			assert.strictEqual( myObject, this );
			assert.strictEqual( myObject, e.self );
		}
	});

	myObject.eventTrigger({
		action: 'change.doc'
	});

	done();
};


// #### opt.noteAction
exports['eventListener opt.noteAction noExec'] = function(assert) {
	var done = assert.done || assert.async();
	assert.expect(1);

	var count = 0;
	var myObject = {};
	Crisp.defineEvent( myObject );

	myObject.eventListener({
		noteAction: 'update',
		listen: function() {
			count += 1;
		}
	});

	myObject.eventTrigger();

	assert.strictEqual( 0, count );

	done();
};


// #### opt.notePath
exports['eventListener opt.notePath noExec'] = function(assert) {
	var done = assert.done || assert.async();
	assert.expect(1);

	var count = 0;
	var myObject = {};
	Crisp.defineEvent( myObject );

	myObject.eventListener({
		notePath: 'doc',
		listen: function() {
			count += 1;
		}
	});

	myObject.eventTrigger();

	assert.strictEqual( 0, count );

	done();
};


// #### opt.noteList
exports['eventListener opt.noteList'] = function(assert) {
	var done = assert.done || assert.async();
	assert.expect(2);

	var myObject = {};
	Crisp.defineEvent( myObject );

	myObject.eventListener({
		noteList: 'merge',
		listen: function( e ) {
			assert.strictEqual( myObject, this );
			assert.strictEqual( myObject, e.self );
		}
	});

	myObject.eventTrigger();

	done();
};



// ### multi events

exports['multi eventListener'] = function(assert) {
	var done = assert.done || assert.async();
	assert.expect(6);

	var test = ['change','insert'];

	var myObject = {};
	var count = 0;
	Crisp.defineEvent( myObject );

	myObject.eventListener({
		action: 'change insert',
		listen: function( e ) {
			assert.strictEqual( test[ count ], e.action );
			assert.strictEqual( myObject, this );
			assert.strictEqual( myObject, e.self );
			count += 1;
		}
	});

	myObject.eventTrigger({
		action: 'change'
	});

	myObject.eventTrigger({
		action: 'insert'
	});

	done();
};

 
exports['multi eventTrigger'] = function(assert) {
	var done = assert.done || assert.async();

	var myObject = {};
	Crisp.defineEvent( myObject );

	myObject.eventListener({
		action: 'change',
		listen: function( e ) {
			assert.strictEqual( 'change insert', e.action );
			assert.strictEqual( 'm', e.data );
		}
	});

	myObject.eventListener({
		action: 'insert',
		listen: function( e ) {
			assert.strictEqual( 'change insert', e.action );
			assert.strictEqual( 'm', e.data );
		}
	});

	myObject.eventTrigger({
		action: 'change insert',
		data: 'm'
	});

	done();
};


exports['prototype function'] = function(assert) {
	var done = assert.done || assert.async();
	assert.expect(3);

	function MyObject() {
		this.name = 'A';
	}

	MyObject.prototype = {
		getName: function() { return this.name; }
	};

	var myObject = new MyObject();

	Crisp.defineEvent( myObject );

	myObject.eventListener({
		listen: function( e ) {
			assert.strictEqual( 'A', this.getName() );
			assert.strictEqual( myObject, this );
			assert.strictEqual( myObject, e.self );
		}
	});

	myObject.eventTrigger();

	done();
};
