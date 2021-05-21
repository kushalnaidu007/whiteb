var seq = require("together").seq;
console.log(seq);

var domainObject = {
blah: function(a, callback) {
				console.log('In blah', a);
				setTimeout(callback, 2000);
			},
another: function(a, callback) {
					 console.log('In another', a);
					 callback();

				 }
}
var domainObject2 = {
blah: function(a, callback) {
				console.log('In blah2', a);
				setTimeout(callback, 2000);
			},
another: function(a, callback) {
					 console.log('In another2',a, "callback is ", callback);
					 callback(5, 6, 7);
				 },
share: function(one, two, three, callback) {
				 console.log("I was called with:", one, two, three, "addition:", one + two);
				 callback();
			 }
}      

seq([domainObject, domainObject2], function(domainObject, domainObject2) {
		console.log(domainObject);

		domainObject.blah(1, this);
		domainObject2.blah(2, this);
		domainObject.another(3, this);
		var one = {}; var two = {}; var three = {};
		domainObject2.another(4, this(one, two, three));
		domainObject2.share(one, two, three, this);

		});
