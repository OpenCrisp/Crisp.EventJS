
// [doc of EventJS](http://opencrisp.wca.at/docs/module-EventJS.html)<br />
// [doc of defineEvent](http://opencrisp.wca.at/docs/module-BaseJS.html#defineEvent)

// ## eventTrigger
// [doc of eventTrigger](http://opencrisp.wca.at/docs/module-EventJS.html#eventTrigger)
exports['eventTrigger'] = function(assert) {
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


// ## option.repeat
exports['eventTrigger option.repeat'] = function(assert) {
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
        listen: function( e ) {
            assert.strictEqual( myObject, this );
            assert.strictEqual( myObject.child, e.self );
        }
    });

    myObject.child.eventTrigger({
        repeat: true
    });

    done();
};


// ## option.exporter
// stop trigger when exporter object is the same as the listener object.
// This is a pritty idea of stop recursive loops in combinition with browser Events
exports['eventTrigger option.exporter'] = function(assert) {
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

    myObject.eventTrigger({
        exporter: myObject
    });

    done();
};

exports['eventTrigger option.exporter eventListener option.self'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(2);
        
    var myObject = {};
    var myListenerSelf = {};

    Crisp.defineEvent( myObject );

    myObject.eventListener({
        self: myListenerSelf,
        listen: function( e ) {
            assert.strictEqual( myListenerSelf, this );
            assert.strictEqual( myObject, e.self );
        }
    });

    myObject.eventTrigger();

    myObject.eventTrigger({
        exporter: myListenerSelf
    });

    done();
};



// ## option.action
exports['eventTrigger option.action'] = function(assert) {
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

    myObject.eventListener({
        action: 'changed',
        listen: function( e ) {
            throw new Error( e );
        }
    });

    myObject.eventTrigger({
        action: 'change'
    });

    done();
};


// ## option.path
exports['eventTrigger option.path'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(3);
        
    var myObject = {};

    Crisp.defineEvent( myObject );

    myObject.eventListener({
        path: 'doc',
        listen: function( e ) {
            assert.strictEqual( 'doc', e.path );
            assert.strictEqual( myObject, this );
            assert.strictEqual( myObject, e.self );
        }
    });

    myObject.eventListener({
        path: 'doc.nolistener',
        listen: function( e ) {
            throw new Error( e );
        }
    });

    myObject.eventTrigger({
        path: 'doc'
    });

    done();
};


// ## option.args
exports['eventTrigger option.args'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(2);
        
    var myObject = {};
    var myArgs = {};

    Crisp.defineEvent( myObject );

    myObject.eventListener({
        listen: function( e ) {
            assert.strictEqual( myObject, this );
            assert.strictEqual( myArgs, e );
        }
    });

    myObject.eventTrigger({
        args: myArgs
    });

    done();
};


// ## option.args arguments
exports['eventTrigger option.args arguments'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(5);
        
    var myObject = {};
    var myArguments = [ {}, true, 0 ];

    Crisp.defineEvent( myObject );

    myObject.eventListener({
        listen: function( e ) {
            assert.strictEqual( myObject, this );
            assert.strictEqual( myArguments[0], e );
            assert.strictEqual( myArguments[0], arguments[0] );
            assert.strictEqual( myArguments[1], arguments[1] );
            assert.strictEqual( myArguments[2], arguments[2] );
        }
    });

    myObject.eventTrigger({
        args: myArguments
    });

    done();
};
