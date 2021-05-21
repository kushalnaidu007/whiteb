var seq = require("together").seq;
var timers = require("timers");

seq([console, timers], function(console, timers) {
		console.log("Hello");
		timers.setTimeout(this, 1000); 
		console.log("World");
});
