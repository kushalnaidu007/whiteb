var tcp = { send: function(data, callback) { console.log("sending", data); callback(data); } }; 

tcp.send("syn", function(syn) {
	console.log("received", syn);
		tcp.send("syn-ack", function(synack) {
			console.log("received", synack);
			tcp.send("ack", function(ack) {
				console.log("received", synack);
				});
			});
});
