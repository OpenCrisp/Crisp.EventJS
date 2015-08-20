
// [doc of EventJS](http://opencrisp.wca.at/docs/module-EventJS.html)<br />
// [doc of defineEvent](http://opencrisp.wca.at/docs/module-BaseJS.html#defineEvent)

// ## eventPicker
// [doc of eventPicker](http://opencrisp.wca.at/docs/module-EventJS.html#eventPicker)
exports['eventPicker'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(4);

    var myObject = {};
    Crisp.defineEvent( myObject );

    var pickerCache = {};

    myObject.eventListener({
        listen: function( e ) {
            assert.strictEqual( 'task', e.action );
            assert.strictEqual( '[{"action":"update"}]', e.List().xTo() );
            assert.strictEqual( myObject, this );
            assert.strictEqual( myObject, e.self );
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


// ### option.action
exports['eventPicker option.action'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(4);

    var myObject = {};

    Crisp.defineEvent( myObject );

    var pickerCache = {};

    myObject.eventListener({
        listen: function( e ) {
            assert.strictEqual( 'changed', e.action );
            assert.strictEqual( '[{"action":"update"}]', e.List().xTo() );
            assert.strictEqual( myObject, this );
            assert.strictEqual( myObject, e.self );
        }
    });

    var picker = myObject.eventPicker({
        action: 'changed',
        cache: pickerCache
    });

    picker.Note({
        action: 'update'
    });

    picker.Talk();

    done();
};

exports['eventPicker option.action no exec of notelist.empty'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(0);

    var myObject = {};

    Crisp.defineEvent( myObject );

    var pickerCache = {};

    myObject.eventListener({
        listen: function() {
            throw new Error();
        }
    });

    var picker = myObject.eventPicker({
        action: 'changed',
        cache: pickerCache
    });

    picker.Talk();

    done();
};


// ### option.path
exports['eventPicker option.path'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(4);

    var myObject = {};

    Crisp.defineEvent( myObject );

    var pickerCache = {};

    myObject.eventListener({
        listen: function( e ) {
            assert.strictEqual( 'doc.a', e.path );
            assert.strictEqual( '[{"action":"update"}]', e.List().xTo() );
            assert.strictEqual( myObject, this );
            assert.strictEqual( myObject, e.self );
        }
    });

    var picker = myObject.eventPicker({
        path: 'doc.a',
        cache: pickerCache
    });

    picker.Note({
        action: 'update'
    });

    picker.Talk();

    done();
};


// ### multi note
exports['eventPicker multi note'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(3);

    function MyObject() {}

    var myObject = new MyObject();
    Crisp.defineEvent( myObject );

    var pickerCache = {};

    myObject.eventListener({
        action: 'task',
        listen: function( e ) {
            assert.equal( 'task', e.action );
            assert.equal( '[{"type":"a","action":"update"}]', e.List('a').xTo() );
            assert.equal( '[{"type":"b","action":"update"}]', e.List('b').xTo() );
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


// ### eventListener filter path
exports['eventPicker eventListener filter path'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(2);

    function MyObject() {}

    var myObject = new MyObject();
    Crisp.defineEvent( myObject );

    var pickerCache = {};

    myObject.eventListener({
        path: 'doc',
        listen: function( e ) {
            assert.equal( '[{"action":"update.doc","path":"doc.x"}]', e.List().xTo() );
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
            assert.equal( '[{"action":"update.doc","path":"doc.x"}]', e.List().xTo() );
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


// ### eventListener filter notePath
exports['eventPicker eventListener filter notePath'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(2);

    function MyObject() {}

    var myObject = new MyObject();
    Crisp.defineEvent( myObject );

    var pickerCache = {};

    myObject.eventListener({
        notePath: 'doc.x',
        listen: function( e ) {
            assert.equal( '[{"action":"update.doc","path":"doc.x"}]', e.List().xTo() );
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
            assert.equal( '[{"action":"update.doc","path":"doc.x"}]', e.List().xTo() );
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


// ### eventListener filter noteAction
exports['eventPicker eventListener filter noteAction'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(2);

    function MyObject() {}

    var myObject = new MyObject();
    Crisp.defineEvent( myObject );

    var pickerCache = {};

    myObject.eventListener({
        noteAction: 'update',
        listen: function( e ) {
            assert.equal( '[{"action":"update.doc","path":"doc.x"}]', e.List().xTo() );
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
            assert.equal( '[{"action":"update.doc","path":"doc.x"}]', e.List().xTo() );
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


// ### 
exports['eventPicker option.empty'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(4);

    var myObject = {};

    Crisp.defineEvent( myObject );

    var pickerCache = {};

    myObject.eventListener({
        listen: function( e ) {
            assert.strictEqual( 'changed', e.action );
            assert.strictEqual( '[]', e.List().xTo() );
            assert.strictEqual( myObject, this );
            assert.strictEqual( myObject, e.self );
        }
    });

    var picker = myObject.eventPicker({
        action: 'changed',
        empty: true,
        cache: pickerCache
    });

    picker.Talk();

    done();
};

exports['eventPicker cache'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(4);

    var myObject = {};
    Crisp.defineEvent( myObject );

    var pickerCache = {};

    myObject.eventListener({
        listen: function( e ) {
            assert.strictEqual( 'task', e.action );
            assert.strictEqual( '[{"action":"insert"},{"action":"update"}]', e.List().xTo() );
            assert.strictEqual( myObject, this );
            assert.strictEqual( myObject, e.self );
        }
    });

    var picker0 = myObject.eventPicker({
        cache: pickerCache
    });

    {   
        var picker1 = myObject.eventPicker({
            cache: pickerCache
        });

        picker1.Note({
            action: 'insert'
        });

        picker1.Talk();
    }

    picker0.Note({
        action: 'update'
    });

    picker0.Talk();

    done();
};
