togetherjs
===

togetherjs is an experiment that allows you to avoid multiple nested callbacks by wrapping your calls to asynchronous functions with synchronous ones.

install
==
	npm install together

example
==

Before you might have callback heavy code such as:

		tcp.send("syn", function(syn) {
			console.log("received", syn);
				tcp.send("syn-ack", function(synack) {
					console.log("received", synack);
					tcp.send("ack", function(ack) {
						console.log("received", synack);
					});
				});
		});


With togetherjs, the callbacks are just written as if they block until they are complete.

	var tcp = { send: function(data, callback) { console.log("sending", data); callback(data); } }; 

	var seq = require("together").seq;

	seq([tcp, console], function(tcp, console) {
		var syn = {}; var synack = {}; var ack = {};
		tcp.send("syn", this(syn));
		console.log("received %s", syn);
		tcp.send("syn-ack", this(synack));
		console.log("received %s", synack);	
		tcp.send("ack", this(ack));
		console.log("received %s", ack);	
	});
&nbsp;

	node tcp_together.js 
	sending syn
	received syn
	sending syn-ack
	received syn-ack
	sending ack
	received ack


usage
===
Include the sequence wrapper:

	var seq = require("together").seq;

Pass in an array of objects with functions that you want to wrap.

	seq([imports], togetherBlock(imports) { ... });

	seq([import1, import2], togetherBlock(import1, import2) { ... });

The order of your import must match those of your `togetherBlock`.

**WARNING**: If you use any asynchronous callbacks in your `togetherBlock` but forget to define them in imports, together will not wrap them up properly and will be executed out of order.

Your `togetherBlock` will receive wrapped up versions of your imports that do not execute immediately. When you need to pass in a callback, pass in `this`.

	var seq = require("together").seq;
	var timers = require("timers");

	seq([console, timers], function(console, timers) {
			console.log("Hello");
			timers.setTimeout(this, 1000); 
			console.log("World");
	});

You can capture callback arguments by providing objects to place values inside. Pass these into the `this` in the same order of your callback. If your callback takes in `callback(data, protocol)` then provide `this(data, protocol)`, ensuring that data and prtocol are objects. This feature is not the most reliable and still needs a better solution.

In this example, all the callbacks return one argument which is then available for callbacks that follow.

	var seq = require("together").seq;
	var osi = {seq: 0, wrap: function(protocol, data, callback) {this.seq++; callback("[" + protocol + "@" + this.seq + ":" + data + "]");  }};

	seq([console, osi], function(console, osi) {
		var mac = {};	var ip = {}; var http = {};
		osi.wrap("mac", "12acbbd334", this(mac));
		osi.wrap("ip", mac, this(ip));
		osi.wrap("http", ip, this(http));

		console.log("%s", mac);
		console.log("%s", ip);
		console.log("%s", http);
	});
&nbsp;

	node tcp_params_together.js
	
	[mac@1:12acbbd334]
	
	[ip@2:[mac@1:12acbbd334]]
	
	[http@3:[ip@2:[mac@1:12acbbd334]]]



limitations
===
This code is not production ready.

Yet to be tested on any libraries.

Callback values are not implemented properly - the 
objects passed are 'fake' rather than primitives.


