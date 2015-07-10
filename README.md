# Crisp.EventJS
Object events for NodeJS and Browser Clients

[![Build Status](https://travis-ci.org/OpenCrisp/Crisp.EventJS.svg)](https://travis-ci.org/OpenCrisp/Crisp.EventJS)

What is CRISP? Configuration Result In Simplified Programming

  * sync / async
  * action filter
  * note picker

## Index Table

  * [Getting Started](#getting-started)
    * [NodeJS](#nodejs)
    * [Browsers](#browsers)
  * [Usage](#usage)
    * [Quick example](#quick-example)

## Getting Started

### NodeJS
Use the Node Package Manager (npm) for install crisp-event

    npm install crisp-event

### Browsers
```html
<script type="text/javascript" src="dist/crisp-event.min.js"></script>
```

## Usage
```javascript
// init
Crisp.defineEvent( object );

// functions
object.eventListener( option );
object.eventTrigger( option );
object.eventPicker( option );
object.eventRemove( option );
```

### Quick example
```javascript
var myObject = { a: 'A' };

Crisp.defineEvent( myObject );

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

[More Examples on GitHub.com](https://github.com/OpenCrisp/Crisp.EventJS/tree/master/test)