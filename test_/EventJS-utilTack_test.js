
exports['utilPick.methodPicker'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(4);

    var count = 0;
    var test = {};

    function fn( opt, success ) {
        success.call( this, 'a' );
    }
    
    test.fn = Crisp.utilPick( fn, true );

    test.fn(
        {},
        function success( doc ) {
            assert.strictEqual( doc, 'a' );
            assert.strictEqual( count++, 0 );
        },
        function complete() {
            assert.strictEqual( count++, 1 );
        }
    );

    assert.strictEqual( count++, 2 );

    done();
};

exports['utilPick.methodPicker picker'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(5);

    var count = 0;
    var test = {};

    function fn( opt, success, picker ) {
        success.call( this, 'a', picker );
    }
    
    test.fn = Crisp.utilPick( fn, true );

    test.fn(
        {},
        function success( doc, picker ) {
            assert.strictEqual( doc, 'a' );
            assert.strictEqual( count++, 0 );

            picker.Wait();
            Crisp.nextTick(function() {
                assert.strictEqual( count++, 2 );
                picker.Talk();
            });
        },
        function complete() {
            assert.strictEqual( count++, 3 );
            done();
        }
    );

    assert.strictEqual( count++, 1 );
};

exports['utilPick.methodPicker opt.async'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(4);

    var count = 0;
    var test = {};

    function fn( opt, success ) {
        success.call( this, 'a' );
    }
    
    test.fn = Crisp.utilPick( fn, true );

    test.fn(
        {
            async: true
        },
        function success( doc ) {
            assert.strictEqual( doc, 'a' );
            assert.strictEqual( count++, 1 );
        },
        function complete() {
            assert.strictEqual( count++, 2 );
            done();
        }
    );

    assert.strictEqual( count++, 0 );
};


exports['array.xEach.utilPick.methodPicker'] = function(assert) {
    var done = assert.done || assert.async();
    assert.expect(4);

    var count = 0;
    var test = ['a'];

    function itemEach() {
        Crisp.xEachArray.apply( this, arguments );
    }
    
    test.itemEach = Crisp.utilPick( itemEach, true );

    test.itemEach(
        {},
        function success( doc ) {
            assert.strictEqual( doc, 'a' );
            assert.strictEqual( ++count, 1 );
        },
        function complete() {
            assert.strictEqual( ++count, 2 );
        }
    );

    assert.strictEqual( ++count, 3 );
    done();
};







