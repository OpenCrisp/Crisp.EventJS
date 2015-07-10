
exports['parent repeat'] = function(assert) {
	var done = assert.done || assert.async();
	assert.expect(2);

	function ChildObject( parent ) {
		this.__parent__ = parent;
	}

	function MyObject() {
		this.child = new ChildObject( this );
		Crisp.defineEvent( this.child );
	}

	var myObject = new MyObject();
	Crisp.defineEvent( myObject );

	myObject.eventListener({
		action: 'change',
		listen: function( e ) {
			assert.equal( 'change', e.action );
			assert.equal( 'Hellow Parent Event!', e.data );
		}
	});

	myObject.child.eventTrigger({
		action: 'change',
		repeat: true,
		data: 'Hellow Parent Event!'
	});

	done();
};
