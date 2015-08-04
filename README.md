# Crisp.EventJS
Object events for NodeJS and Browser Clients

[![Build Status](https://travis-ci.org/OpenCrisp/Crisp.EventJS.svg)](https://travis-ci.org/OpenCrisp/Crisp.EventJS)
[![NPM Downloads](https://img.shields.io/npm/dm/crisp-event.svg)](https://www.npmjs.com/package/crisp-event)
[![NPM Version](https://img.shields.io/npm/v/crisp-event.svg)](https://www.npmjs.com/package/crisp-event)

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
  * [Links](#links)

## Getting Started

### NodeJS
Use the Node Package Manager (npm) for install crisp-event

    npm install crisp-event

or use all of OpenCrisp Utils

    npm install crisp-util

### Browsers
```html
<script type="text/javascript" src="node_modules/crisp-base/dist/crisp-base.min.js"></script>
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
var myObject = {};

Crisp.defineEvent( myObject );

myObject.eventListener({
	action: 'change',
	listen: function( e ) {
		console.log( 'event-data:', e );
	}
});

myObject.eventTrigger({
	action: 'change',
	args: 'Hello Event!'
});

// logs:
// event-data: Hello Event!
```


## Links
 * [Online Crisp.EventJS module Documentation](http://opencrisp.wca.at/docs/module-EventJS.html)
 * [More Examples on GitHub.com](https://github.com/OpenCrisp/Crisp.EventJS/tree/master/test)
 * [Repository on GitHub.com](https://github.com/OpenCrisp/Crisp.EventJS)
 * [npm package on npm.com](https://www.npmjs.com/package/crisp-event)
 * [Build History on Travis-ci.org](https://travis-ci.org/OpenCrisp/Crisp.EventJS)
