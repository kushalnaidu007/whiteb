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
