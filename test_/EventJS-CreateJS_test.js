
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
