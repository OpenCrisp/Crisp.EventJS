
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
