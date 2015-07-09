# Crsip.EventJS
============

Object events for NodeJS and Browser Clients

[![Build Status](https://travis-ci.org/OpenCrisp/Crisp.EventJS.svg)](https://travis-ci.org/OpenCrisp/Crisp.EventJS)

What is CRISP? Configuration Result In Simplified Programming

- sync
- multi trade

Optional:
- async ( async: true )

and many more functions
the future test and docs comes in the next days 

Index Table
-----------------
  * [Getting Started](#getting-started)
    * [NodeJS](#nodejs)
    * [Browsers](#browser)
  * [Usage](#usage)
    * [Quick example](#quick-example)

Getting Started
---------------
###NodeJS###
Use the Node Package Manager (npm) for install crisp-event

    npm install crisp-event

###Browsers###
```html
<script type="text/javascript" src="dist/jspath.min.js"></script>
```

Usage
-----
```javascript
Crisp.defineEvent( object );
```


###Quick example###
```javascript
var myObject = { a: 'A' };

$$.defineEvent( myObject );

myObject.eventListener({
	action: 'change',
	listen: function( e ) {
		console.log( 'event-data:', e.data );
	}
});

myObject.eventTrigger({
	action: 'change',
	data: 'Hellow Event!'
});
```