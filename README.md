# Crisp.EventJS
Object event with repeater, picker and optional asynchronous.

[![Build Status](https://travis-ci.org/OpenCrisp/Crisp.EventJS.svg)](https://travis-ci.org/OpenCrisp/Crisp.EventJS)
[![NPM Downloads](https://img.shields.io/npm/dm/crisp-event.svg)](https://www.npmjs.com/package/crisp-event)
[![NPM Version](https://img.shields.io/npm/v/crisp-event.svg)](https://www.npmjs.com/package/crisp-event)

```javascript
var myObject = Crisp.utilCreate({ ns: 'util.event' }).objIni();

myObject.eventListener({
  listen: function( e ) {
    console.log('Listen');
  }
});
console.log('Wait');

myObject.eventTrigger();

// logs:
// Wait
// Listen
```

## Index Table
  * [Getting Started](#getting-started)
    * [Server-Nodes](#server-nodes)
    * [Web-Clients](#web-clients)
    * [Development](#development)
  * [Usage](#usage)
    * [Crisp.defineEvent()](#crispdefineevent)
    * [Crisp.utilCreate()](#crisputilcreate)
  * [EventJS function](#eventjs-function)
    * [.eventListener()](#eventlistener)
    * [.eventTrigger()](#eventtrigger)
    * [.eventPicker()](#eventpicker)
    * [.eventRemove()](#eventremove)
  * [Links](#links)

## Getting Started

### Server-Nodes
Use [Node Package Manager (npm)](https://www.npmjs.org) to install `crisp-event` for [Node.js](https://nodejs.org/) and [io.js](https://iojs.org/)

    $ npm install crisp-event

```javascript
// use package
require("crisp-event");
```

or use the [OpenCrisp UtilJS](https://github.com/OpenCrisp/Crisp.UtilJS) wraper

    $ npm install crisp-util

```javascript
// use package
require("crisp-util");
```

### Web-Clients
Use [Bower](http://bower.io/) to install `crisp-event` for Browsers APP's and other front-end workflows.

    $ bower install crisp-event

```html
<!-- use package -->
<script type="text/javascript" src="dist/crisp-event.min.js"></script>
```

or use the [OpenCrisp UtilJS](https://github.com/OpenCrisp/Crisp.UtilJS) wraper

    $ bower install crisp-util

```html
<!-- use package -->
<script type="text/javascript" src="dist/crisp-util.min.js"></script>
```

## Development
Use [Git](https://git-scm.com/) to clone [Crisp.EventJS from GitHub](https://github.com/OpenCrisp/Crisp.EventJS) to develop the repository with [Grunt](http://gruntjs.com/)

    # Clone:
    $ git clone https://github.com/OpenCrisp/Crisp.EventJS.git
    
    # Build: test, concat, test, minify, test
    $ grunt
    
    # Test: original sourcecode for developer (included in build)
    $ grunt t
    
    # Run all test-scripts on Unix
    $ sh grunt-tests.sh

## Usage
How to use `Crisp.EventJS` with JavaScript.

### Crisp.defineEvent()
How to use `Crisp.defineEvent( object [, option ])` module.

```javascript
var myObject = {};

// initialice event property functions on myObject
Crisp.defineEvent( myObject );

// or with manual property name of event and parent 
Crisp.defineEvent( myObject, {
    // default: __event__
    event: '__myevent__',       // manual set the name of event cach
    // default: __parent__
    parent: '__myparent__'      // manual set the name of parent reference
});
```

### Crisp.utilCreate()
How to use `Crisp.utilCreate( option )` with `util.event` namespace.

```javascript
var myObject = Crisp.utilCreate({
    ns: 'util.event'
}).objIni();
```

## EventJS function

### .eventListener()
How to use `.eventListener( option )` on `myObject`

```javascript
// listen for all triggert events
myObject.eventListener({
  listen: function( e ) {}
});
```

 * **option**
   * [**listen** - callback function](#eventlistener)
   * [_**self**_ - alternate for apply thisArg](#optionself-eventlistener)
   * [_**async**_ - acitvate asynchronous callback](#optionasync-eventlistener)
   * [_**action**_ - namespace OR RegExp filter](#optionaction-eventlistener)
   * [_**path**_ - like OR RegExp filter](#optionpath-eventlistener)
   * [_**noteList**_ - like filter for eventPicker notes](#optionnotelist-eventlistener)
   * [_**noteAction**_ - namespace OR RegExp filter for eventPicker notes](#optionnoteaction-eventlistener)
   * [_**notePath**_ - like OR RegExp filter for eventPicker notes](#optionnotepath-eventlistener)

> #### option.self (eventListener)
> works with [.eventTrigger()](#eventtrigger) and [.eventPicker()](#eventpicker)

```javascript
// set self as alternate for apply thisArg
var thisArg = {};
myObject.eventListener({
  self: thsiArg,
  listen: function( e ) {
    this === thisArg;  // true
  }
});
```

> #### option.async (eventListener)
> works with [.eventTrigger()](#eventtrigger) and [.eventPicker()](#eventpicker)

```javascript
// set asynchronous callback for listen:function
myObject.eventListener({
  async: true,
  listen: function( e ) {}
});
```

> #### option.action (eventListener)
> works with [.eventTrigger()](#eventtrigger) and [.eventPicker()](#eventpicker)

```javascript
// set right namespase string filter
myObject.eventListener({
  action: 'insert',
  listen: function( e ) {}
});

// set an expandable RegExp filter like action:'insert'
myObject.eventListener({
  action: /(^|\s)insert($|\s|\.)/,
  listen: function( e ) {}
});

// set multi right namespase string filter with space seperator
myObject.eventListener({
  action: 'insert update',
  listen: function( e ) {}
});

// set an expandable RegExp filter like action:'insert update'
myObject.eventListener({
  action: /(^|\s)(insert|update)($|\s|\.)/,
  listen: function( e ) {}
});
```

> #### option.path (eventListener)
> works with [.eventTrigger()](#eventtrigger) and [.eventPicker()](#eventpicker)

```javascript
// set 
myObject.eventListener({
  action: /(^|\s)(insert|update)($|\s|\.)/,
  listen: function( e ) {}
});
```

> #### option.noteList (eventListener)
> works with [.eventPicker()](#eventpicker)

```javascript
// filter notes in specified list 
myObject.eventListener({
  noteList: 'merge',
  listen: function( e ) {}
});
```

> #### option.noteAction (eventListener)
> works with [.eventPicker()](#eventpicker)

```javascript
// set filter of note action
myObject.eventListener({
  noteAction: 'delete',           // or RegExp like option.action
  listen: function( e ) {}
});
```

> #### option.notePath (eventListener)
> works with [.eventPicker()](#eventpicker)

```javascript
// set filter of note path
myObject.eventListener({
  notePath: 'doc.b',
  listen: function( e ) {}
});
```

### .eventTrigger()
How to use `.eventTrigger( option )` on `myObject`

```javascript
var myObject = Crisp.utilCreate({ ns: 'util.event' }).objIni();

myObject.eventListener({
  listen: function( e ) {
    console.log('Listen');
  }
});
console.log('Wait');

myObject.eventTrigger();

// logs:
// Wait
// Listen
```

 * **option**
   * [_**repeat**_ - trigger parent object](#optionrepeat-eventtrigger)
   * [_**exporter**_ - stop recursive trigger loops](#optionexporter-eventtrigger)
   * [_**action**_ - full name name of namespace](#optionaction-eventtrigger)
   * [_**path**_ - full name of object path](#optionpath-eventtrigger)
   * [_**args**_ - alternate arguments for eventListener callback](#optionargs-eventtrigger)

> #### option.repeat (eventTrigger)

```javascript
// set repeat for trigger parent objects
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

myChild.eventListener({
    listen: function( e ) {
        console.log('Listener: Child');
    }
});

myObject.eventListener({
    listen: function( e ) {
        console.log('Listener: Object');
    }
});
console.log('JSON', myObject.xTo() );

myChild.eventTrigger({
    repeat: true
});

// logs:
// JSON {"a":{"b":"B"}}
// Listener: Child
// Listener: Object
// End
```

> #### option.exporter (eventTrigger)

```javascript
var myObject = {};
Crisp.defineEvent( myObject );

myObject.eventListener({
    listen: function( e ) {
        console.log('Listener');
    }
});
console.log('Wait');

myObject.eventTrigger();

myObject.eventTrigger({
    exporter: myObject
});
console.log('End');

// logs:
// Wait
// Listener
// End
```

> #### option.action (eventTrigger)

```javascript
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

myObject.eventTrigger({
    action: 'change'
});
```

> #### option.path (eventTrigger)

```javascript
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

myObject.eventTrigger({
    path: 'doc'
});
```

> #### option.args (eventTrigger)

```javascript
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
```

### .eventPicker()
How to use `.eventPicker( option )` on `myObject`

```javascript
var myObject = Crisp.utilCreate({ ns: 'util.event' }).objIni();

myObject.eventListener({
  listen: function( e ) {
    console.log('Listen:', e.action, e.List().xTo() );
  }
});

var pickerCache = {};
var picker = myObject.eventPicker({
    cache: pickerCache
});

picker.Note({
    action: 'update'
});
console.log('Wait');

picker.Talk();
console.log('End')

// logs:
// Wait
// Listen: task [{"action":"update"}]
// End
```

 * **option**
   * [_**cache**_ - event sub trigger picker cache](#optioncache-eventpicker)
   * [_**action**_ - full name name of namespace](#optionaction-eventpicker)
   * [_**path**_ - full name of object path](#optionpath-eventpicker)
   * [_**empty**_ - allow trigger picker with empty notes ](#optionempty-eventpicker)

> #### option.cache (eventPicker)

```javascript
// Listener wait for the last Talk() on the same cache
var myObject = Crisp.utilCreate({ ns: 'util.event' }).objIni();

myObject.eventListener({
  listen: function( e ) {
    console.log('Listen:', e.action, e.List().xTo() );
  }
});

var pickerCache = {};
var picker = myObject.eventPicker({
    cache: pickerCache
});

{
    var sub_picker = myObject.eventPicker({
        cache: pickerCache
    });

    sub_picker.Note({
        action: 'insert'
    });
    console.log('Wait 0');

    sub_picker.Talk();
}

picker.Note({
    action: 'update'
});
console.log('Wait 1');

picker.Talk();
console.log('End')

// logs:
// Wait 0
// Wait 1
// Listen: task [{"action":"insert"},{"action":"update"}]
// End
```

> #### option.action (eventPicker)

```javascript
var myObject = {};
var pickerCache = {};

Crisp.defineEvent( myObject );

myObject.eventListener({
    action: 'changed',
    listen: function( e ) {
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
```

> #### option.path (eventPicker)

```javascript
var myObject = {};
var pickerCache = {};

Crisp.defineEvent( myObject );

myObject.eventListener({
    path: 'doc.a',
    listen: function( e ) {
        assert.strictEqual( myObject, this );
        assert.strictEqual( myObject, e.self );
    }
});

var picker = myObject.eventPicker({
    path: 'doc.a',
    cache: pickerCache
});

picker.Talk();
```

> #### option.empty (eventPicker)

```javascript
var myObject = {};
var pickerCache = {};

Crisp.defineEvent( myObject );

myObject.eventListener({
    listen: function( e ) {
        assert.strictEqual( '[]', e.List().xTo() );
        assert.strictEqual( myObject, this );
        assert.strictEqual( myObject, e.self );
    }
});

var picker = myObject.eventPicker({
    empty: true,
    cache: pickerCache
});

picker.Talk();
```

### .eventRemove()
How to use `.eventRemove( event )` on `myObject`

```javascript
var myObject = Crisp.utilCreate({ ns: 'util.event' }).objIni();

var eventObject = myObject.eventListener({
  listen: function( e ) {
    console.log('Listen');
  }
});
console.log('Wait 0');

myObject.eventTrigger();

myObject.eventRemove( eventObject );
console.log('Wait 1');

myObject.eventTrigger();

console.log('End')

// logs:
// Wait 0
// Listen
// Wait 1
// End
```

## Links
 * [Repository](https://github.com/OpenCrisp/Crisp.EventJS)
 * [More examples](https://github.com/OpenCrisp/Crisp.EventJS/tree/master/test)
 * [Module documentation](http://opencrisp.wca.at/docs/module-EventJS.html)
 * [Node package manager](https://www.npmjs.com/package/crisp-event)
 * [Version monitoring](https://www.versioneye.com/nodejs/crisp-event)
 * [Build history](https://travis-ci.org/OpenCrisp/Crisp.EventJS)
