
require("../src/crisp-base");
require("../src/crisp-event");

var $$ = Crisp;

exports['simple object.event'] = function(t) {
	t.expect(3);
	
	var myObject = { a: 'A' };

	$$.defineEvent( myObject );

	myObject.eventListener({
		action: 'change',
		listen: function( e ) {
			t.equal( 'change', e.action );
			t.equal( 'Hellow Event!', e.data );
			t.equal( 'A', this.a );
		}
	});

	myObject.eventTrigger({
		action: 'change',
		data: 'Hellow Event!'
	});

	t.done();
};


exports['prototype function object.event'] = function(t) {

	function MyObject() {
		this.name = 'A';
	}

	MyObject.prototype = {
		getName: function() { return this.name; }
	};

	var myObject = new MyObject();

	$$.defineEvent( myObject );

	myObject.eventListener({
		action: 'change',
		listen: function( e ) {
			t.equal( 'change', e.action );
			t.equal( 'Hellow Event!', e.data );
			t.equal( 'A', this.getName() );
		}
	});

	myObject.eventTrigger({
		action: 'change',
		data: 'Hellow Event!'
	});

	t.done();
};


exports['multi event listener'] = function(t) {

	var myObject = {};
	$$.defineEvent( myObject );

	myObject.eventListener({
		action: 'change',
		listen: function( e ) {
			t.equal( 'change', e.action );
			t.equal( 'a', e.data );
		}
	});

	myObject.eventListener({
		action: 'insert',
		listen: function( e ) {
			t.equal( 'insert', e.action );
			t.equal( 'b', e.data );
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

	t.done();
};

exports['multi event trigger'] = function(t) {

	var myObject = {};
	$$.defineEvent( myObject );

	myObject.eventListener({
		action: 'change',
		listen: function( e ) {
			t.equal( 'change insert', e.action );
			t.equal( 'm', e.data );
		}
	});

	myObject.eventListener({
		action: 'insert',
		listen: function( e ) {
			t.equal( 'change insert', e.action );
			t.equal( 'm', e.data );
		}
	});

	myObject.eventTrigger({
		action: 'change insert',
		data: 'm'
	});

	t.done();
};

exports['RegExt action listener'] = function(t) {

	var myObject = {};
	$$.defineEvent( myObject );

	myObject.eventListener({
		action: /\.doc$/,
		listen: function( e ) {
			t.equal( 'change.doc', e.action );
			t.equal( 'a', e.data );
		}
	});

	myObject.eventTrigger({
		action: 'change.doc',
		data: 'a'
	});

	t.done();
};