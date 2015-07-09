(function($$) {
	/*
	======== A Handy Little QUnit Reference ========
	http://api.qunitjs.com/

	Test methods:
		module(name, {[setup][ ,teardown]})
		test(name, callback)
		expect(numberOfAssertions)
		stop(increment)
		start(decrement)
		Test assertions:
		ok(value, [message])
		equal(actual, expected, [message])
		notEqual(actual, expected, [message])
		deepEqual(actual, expected, [message])
		notDeepEqual(actual, expected, [message])
		strictEqual(actual, expected, [message])
		notStrictEqual(actual, expected, [message])
		throws(block, [expected], [message])
	*/

	test('simple object.event', function() {
		
		var myObject = { a: 'A' };

		$$.defineEvent( myObject );

		myObject.eventListener({
			action: 'change',
			listen: function( e ) {
				equal( 'change', e.action );
				equal( 'Hellow Event!', e.data );
				equal( 'A', this.a );
			}
		});

		myObject.eventTrigger({
			action: 'change',
			data: 'Hellow Event!'
		});
	});


	test('prototype function object.event', function() {

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
				equal( 'change', e.action );
				equal( 'Hellow Event!', e.data );
				equal( 'A', this.getName() );
			}
		});

		myObject.eventTrigger({
			action: 'change',
			data: 'Hellow Event!'
		});
	});


	test('multi event listener', function() {

		var myObject = {};
		$$.defineEvent( myObject );

		myObject.eventListener({
			action: 'change',
			listen: function( e ) {
				equal( 'change', e.action );
				equal( 'a', e.data );
			}
		});

		myObject.eventListener({
			action: 'insert',
			listen: function( e ) {
				equal( 'insert', e.action );
				equal( 'b', e.data );
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
	});

	test('multi event trigger', function() {

		var myObject = {};
		$$.defineEvent( myObject );

		myObject.eventListener({
			action: 'change',
			listen: function( e ) {
				equal( 'change insert', e.action );
				equal( 'm', e.data );
			}
		});

		myObject.eventListener({
			action: 'insert',
			listen: function( e ) {
				equal( 'change insert', e.action );
				equal( 'm', e.data );
			}
		});

		myObject.eventTrigger({
			action: 'change insert',
			data: 'm'
		});
	});

	test('RegExt action listener', function() {

		var myObject = {};
		$$.defineEvent( myObject );

		myObject.eventListener({
			action: /\.doc$/,
			listen: function( e ) {
				equal( 'change.doc', e.action );
				equal( 'a', e.data );
			}
		});

		myObject.eventTrigger({
			action: 'change.doc',
			data: 'a'
		});
	});

}(Crisp));