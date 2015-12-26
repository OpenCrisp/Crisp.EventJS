
// [doc of EventJS](http://opencrisp.wca.at/docs/module-EventJS.html)<br />
// [doc of CreateJS](http://opencrisp.wca.at/docs/module-CreateJS.html)


exports['eventListener'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(2);
    
    var myObject = Crisp.utilCreate({
        ns: 'util.event'
    }).objIni();

    myObject.eventListener({
        listen: function( e ) {
            assert.strictEqual( myObject, this );
            assert.strictEqual( myObject, e.self );
        }
    });

    myObject.eventTrigger();

    done();
};

exports['eventTrigger option.args'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(2);
    
    var thisArg = {};

    var myObject = Crisp.utilCreate({
        ns: 'util.event'
    }).objIni();

    myObject.eventListener({
        listen: function( e ) {
            assert.strictEqual( myObject, this );
            assert.strictEqual( thisArg, e );
        }
    });

    myObject.eventTrigger({
        args: thisArg
    });

    done();
};



exports['eventTrigger option __parent__'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(4);
    
    var myObject = Crisp.utilCreate({
        ns: 'util.event',
        options: {
            parent: { proWri: true }
        }
    }).objIni();

    var myChild = myObject.objClone().objIni({
        parent: myObject
    });

    myObject.a = myChild;
    myChild.b = 'B';

    myChild.eventListener({
        listen: function( e ) {
            // console.log('Listener: Child');
            assert.strictEqual( myChild, this );
            assert.strictEqual( myChild, e.self );
        }
    });

    myObject.eventListener({
        listen: function( e ) {
            // console.log('Listener: Object');
            assert.strictEqual( myObject, this );
            assert.strictEqual( myChild, e.self );
        }
    });
    // console.log('JSON', myObject.xTo() );

    myChild.eventTrigger({
        repeat: true
    });
    // console.log('End');

    done();
};




exports['eventPicker'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(4);

    var myObject = Crisp.utilCreate({
        ns: 'util.event'
    }).objIni();

    var pickerCache = {};

    myObject.eventListener({
        listen: function( e ) {
            assert.strictEqual( 'task', e.action );
            assert.strictEqual( '[{"action":"update"}]', JSON.stringify( e.List() ) );
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


exports['eventRemove'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(2);
    
    var myObject = Crisp.utilCreate({
        ns: 'util.event'
    }).objIni();

    var eventObject = myObject.eventListener({
        listen: function( e ) {
            assert.strictEqual( myObject, this );
            assert.strictEqual( myObject, e.self );
        }
    });

    myObject.eventTrigger();

    myObject.eventRemove( eventObject );
    myObject.eventTrigger();

    done();
};


exports['utilPick each'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(2);

    var list = [];

    function itemEach( opt, success ) {
        success.call( this, 'each' );
    }
    
    var myObject = Crisp.utilCreate({
        prototypes: {
            itemEach: Crisp.utilPick( itemEach )
        }
    }).objIni();

    myObject.itemEach(
        {},
        function (doc) {
            assert.equal( doc, 'each' );
            list.push(doc);
        },
        function () {
            list.push('end');
            assert.equal( list.join(','), 'each,end' );
        }
    );

    done();
};

exports['utilPick limit'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(2);

    var list = [];

    function itemEach( optEach, successEach ) {
        successEach.call( this, 'each' );
        successEach.call( this, 'each' );
    }
    
    function itemLimit( optLimit, successLimit ) {
        var x = [];

        this.itemEach(
            optLimit,
            function (doc) {
                x.push(doc);
            },
            function () {
                successLimit.call( this, x.join(':') );
            }
        );
    }
    
    var myObject = Crisp.utilCreate({
        prototypes: {
            itemEach: Crisp.utilPick( itemEach ),
            itemLimit: Crisp.utilPick( itemLimit )
        }
    }).objIni();

    myObject.itemLimit(
        {},
        function (doc) {
            assert.equal( doc, 'each:each' );
            list.push(doc);
        },
        function () {
            list.push('end');
            assert.equal( list.join(','), 'each:each,end' );
        }
    );

    done();
};

exports['utilPick limit parallel'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(5);

    var list = [];
    var count = 0;

    function itemEach( optEach, successEach, pickerEach ) {
        pickerEach.Wait();
        Crisp.nextTick(function() {
            successEach.call( this, 'each0' );
            pickerEach.Talk();
        });

        pickerEach.Wait();
        Crisp.nextTick(function() {
            successEach.call( this, 'each1' );
            pickerEach.Talk();
        });
    }
    
    function itemLimit( optLimit, successLimit, pickerLimit ) {
        var x = [];

        pickerLimit.Wait();
        this.itemEach(
            optLimit,
            function (doc) {
                x.push(doc);
            },
            function () {
                successLimit.call( this, x.join(':') );
                pickerLimit.Talk();
            }
        );
    }
    
    var myObject = Crisp.utilCreate({
        prototypes: {
            itemEach: Crisp.utilPick( itemEach ),
            itemLimit: Crisp.utilPick( itemLimit )
        }
    }).objIni();

    myObject.itemLimit(
        {
            async: true
        },
        function (doc) {
            assert.equal( ++count, 2 );
            assert.equal( doc, 'each0:each1' );
            list.push(doc);
        },
        function () {
            assert.equal( ++count, 3 );
            list.push('end');
            assert.equal( list.join(','), 'each0:each1,end' );
            done();
        }
    );

    assert.equal( ++count, 1 );
};


exports['utilPick limit parallel inherit'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(7);

    var list = [];
    var count = 0;

    function itemEach( optEach, successEach, pickerEach ) {
        pickerEach.Wait();
        Crisp.nextTick(function() {
            successEach.call( this, 'each' + optEach.start );
            pickerEach.Talk();
        });

        pickerEach.Wait();
        Crisp.nextTick(function() {
            successEach.call( this, 'each' + optEach.start );
            pickerEach.Talk();
        });
    }
    
    function itemLimit( optLimit ) {
        optLimit.start = 0;
        this.itemEach.callback.apply( this, arguments );
    }
    
    var myObject = Crisp.utilCreate({
        prototypes: {
            itemEach: Crisp.utilPick( itemEach ),
            itemLimit: Crisp.utilPick( itemLimit )
        }
    }).objIni();

    myObject.itemLimit(
        {
            async: true
        },
        function (doc) {
            assert.ok( ++count === 2 || count === 3 );
            assert.equal( doc, 'each0' );
            list.push(doc);
        },
        function () {
            assert.equal( ++count, 4 );
            list.push('end');
            assert.equal( list.join(','), 'each0,each0,end' );
            done();
        }
    );

    assert.equal( ++count, 1 );
};
