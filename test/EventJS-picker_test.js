
exports['basic eventPicker'] = function(assert) {
	var done = assert.done || assert.async();
	assert.expect(2);

	function MyObject() {}

	var myObject = new MyObject();
	Crisp.defineEvent( myObject );

	var pickerCache = {};

	myObject.eventListener({
		action: 'task',
		listen: function( e ) {
			assert.equal( 'task', e.action );
			assert.equal( '{"list":{"own":[{"action":"update"}]}}', JSON.stringify( e.note ) );
		}
	});

	var picker = myObject.eventPicker({
		cache: pickerCache
	});

	picker.Note({
		action: 'update'
	});

	picker.Talk();

	done();
};


exports['multi note eventPicker'] = function(assert) {
	var done = assert.done || assert.async();
	assert.expect(2);

	function MyObject() {}

	var myObject = new MyObject();
	Crisp.defineEvent( myObject );

	var pickerCache = {};

	myObject.eventListener({
		action: 'task',
		listen: function( e ) {
			assert.equal( 'task', e.action );
			assert.equal( '{"list":{"a":[{"type":"a","action":"update"}],"b":[{"type":"b","action":"update"}]}}', JSON.stringify( e.note ) );
		}
	});

	var picker = myObject.eventPicker({
		cache: pickerCache
	});

	picker.Note({
		type: 'a',
		action: 'update'
	});

	picker.Note({
		type: 'b',
		action: 'update'
	});

	picker.Talk();

	done();
};


exports['path note eventPicker'] = function(assert) {
	var done = assert.done || assert.async();
	assert.expect(2);

	function MyObject() {}

	var myObject = new MyObject();
	Crisp.defineEvent( myObject );

	var pickerCache = {};

	myObject.eventListener({
		path: 'doc',
		listen: function( e ) {
			assert.equal( '{"list":{"own":[{"action":"update.doc","path":"doc.x"}]}}', JSON.stringify( e.note ) );
		}
	});

	myObject.eventListener({
		path: 'no',
		listen: function() {
			ok( false );
		}
	});

	myObject.eventListener({
		path: /^d/,
		listen: function( e ) {
			assert.equal( '{"list":{"own":[{"action":"update.doc","path":"doc.x"}]}}', JSON.stringify( e.note ) );
		}
	});

	var picker = myObject.eventPicker({
		cache: pickerCache,
		action: 'change',
		path: 'doc'
	});

	picker.Note({
		action: 'update.doc',
		path: 'doc.x'
	});

	picker.Talk();

	done();
};


exports['filter notePath eventPicker'] = function(assert) {
	var done = assert.done || assert.async();
	assert.expect(2);

	function MyObject() {}

	var myObject = new MyObject();
	Crisp.defineEvent( myObject );

	var pickerCache = {};

	myObject.eventListener({
		notePath: 'doc.x',
		listen: function( e ) {
			assert.equal( '{"list":{"own":[{"action":"update.doc","path":"doc.x"}]}}', JSON.stringify( e.note ) );
		}
	});

	myObject.eventListener({
		notePath: 'no',
		listen: function() {
			ok( false );
		}
	});

	myObject.eventListener({
		notePath: /^d/,
		listen: function( e ) {
			assert.equal( '{"list":{"own":[{"action":"update.doc","path":"doc.x"}]}}', JSON.stringify( e.note ) );
		}
	});

	var picker = myObject.eventPicker({
		cache: pickerCache,
		action: 'change',
		path: 'doc'
	});

	picker.Note({
		action: 'update.doc',
		path: 'doc.x'
	});

	picker.Talk();

	done();
};


exports['filter noteAction eventPicker'] = function(assert) {
	var done = assert.done || assert.async();
	assert.expect(2);

	function MyObject() {}

	var myObject = new MyObject();
	Crisp.defineEvent( myObject );

	var pickerCache = {};

	myObject.eventListener({
		noteAction: 'update',
		listen: function( e ) {
			assert.equal( '{"list":{"own":[{"action":"update.doc","path":"doc.x"}]}}', JSON.stringify( e.note ) );
		}
	});

	myObject.eventListener({
		noteAction: 'no',
		listen: function() {
			ok( false );
		}
	});

	myObject.eventListener({
		noteAction: /^u/,
		listen: function( e ) {
			assert.equal( '{"list":{"own":[{"action":"update.doc","path":"doc.x"}]}}', JSON.stringify( e.note ) );
		}
	});

	var picker = myObject.eventPicker({
		cache: pickerCache,
		action: 'change',
		path: 'doc'
	});

	picker.Note({
		action: 'update.doc',
		path: 'doc.x'
	});

	picker.Talk();

	done();
};
