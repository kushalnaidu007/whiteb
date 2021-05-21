var seq = require("together").seq;

var osi = {seq: 0, wrap: function(protocol, data, callback) {this.seq++; callback("[" + protocol + "@" + this.seq + ":" + data + "]");  }};

osi.wrap("mac", "12acbbd334", function(wrapped) {
	console.log(wrapped)
	osi.wrap("ip", wrapped, function(wrapped) {
		console.log(wrapped);
		osi.wrap("http", wrapped, function(wrapped) {
			console.log(wrapped);
		});	
	})	
});
