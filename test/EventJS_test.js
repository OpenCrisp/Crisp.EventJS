
exports['simple object.event'] = function(assert) {
	var done = assert.done || assert.async();
		
	var myObject = { a: 'A' };

	Crisp.defineEvent( myObject );

	myObject.eventListener({
		action: 'change',
		listen: function( e ) {
			assert.equal( 'change', e.action );
			assert.equal( 'Hellow Event!', e.data );
			assert.equal( 'A', this.a );
		}
	});

	myObject.eventTrigger({
		action: 'change',
		data: 'Hellow Event!'
	});

	done();
};


exports['async object.event'] = function(assert) {
	var done = assert.done || assert.async();
	assert.expect(1);

	var count = 0;
	var myObject = { a: 'A' };

	Crisp.defineEvent( myObject );

	myObject.eventListener({
		async: true,
		action: 'change',
		listen: function() {
			count += 1;
		}
	});

	myObject.eventTrigger({
		action: 'change',
		data: 'Hellow Event!'
	});

	assert.equal( 0, count );

	done();
};


exports['prototype function object.event'] = function(assert) {
	var done = assert.done || assert.async();

	function MyObject() {
		this.name = 'A';
	}

	MyObject.prototype = {
		getName: function() { return this.name; }
	};

	var myObject = new MyObject();

	Crisp.defineEvent( myObject );

	myObject.eventListener({
		action: 'change',
		listen: function( e ) {
			assert.equal( 'change', e.action );
			assert.equal( 'Hellow Event!', e.data );
			assert.equal( 'A', this.getName() );
		}
	});

	myObject.eventTrigger({
		action: 'change',
		data: 'Hellow Event!'
	});

	done();
};


exports['multi event listener'] = function(assert) {
	var done = assert.done || assert.async();

	var myObject = {};
	Crisp.defineEvent( myObject );

	myObject.eventListener({
		action: 'change',
		listen: function( e ) {
			assert.equal( 'change', e.action );
			assert.equal( 'a', e.data );
		}
	});

	myObject.eventListener({
		action: 'insert',
		listen: function( e ) {
			assert.equal( 'insert', e.action );
			assert.equal( 'b', e.data );
		}
	});

	myObject.eventTrigger({
		action: 'change',
		data: 'a'
	});

	myObject.eventTrigger({
		action: 'insert',
		data: 'b'
	});

	done();
};

exports['multi event trigger'] = function(assert) {
	var done = assert.done || assert.async();

	var myObject = {};
	Crisp.defineEvent( myObject );

	myObject.eventListener({
		action: 'change',
		listen: function( e ) {
			assert.equal( 'change insert', e.action );
			assert.equal( 'm', e.data );
		}
	});

	myObject.eventListener({
		action: 'insert',
		listen: function( e ) {
			assert.equal( 'change insert', e.action );
			assert.equal( 'm', e.data );
		}
	});

	myObject.eventTrigger({
		action: 'change insert',
		data: 'm'
	});

	done();
};

exports['RegExt action listener'] = function(assert) {
	var done = assert.done || assert.async();

	var myObject = {};
	Crisp.defineEvent( myObject );

	myObject.eventListener({
		action: /\.doc$/,
		listen: function( e ) {
			assert.equal( 'change.doc', e.action );
			assert.equal( 'a', e.data );
		}
	});

	myObject.eventTrigger({
		action: 'change.doc',
		data: 'a'
	});

	done();
};
