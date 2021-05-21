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
