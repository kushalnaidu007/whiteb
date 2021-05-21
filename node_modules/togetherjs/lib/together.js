exports.seq = function(imports, seqblock) {
	var recording = true;
	var mocks  = [];
	var callSeq = [];
	var nextSeq = 1;
	var identity = function(){};

	var state = function() {
		if (recording) {
			var saved = arguments;
			var replay = function() {
				// need a nicer way to attach these callback values to the next function that needs them
				for (var i = 0; i < arguments.length; i++) {
					// copy callback arguments
					// saved[i].value = arguments[i];
					var realarg = arguments[i];

					saved[i].valueOf = function(arg) {return function(){return arg.valueOf()};}(realarg);
					saved[i].toString = function(arg) {return function(){return arg.toString()};}(realarg);

					saved[i].__proto__ = realarg.__proto__;
				}
				if (canPlayback()) {
					playback();
				}
			};
			replay.constructor = identity;
			replay.__proto__ = identity.prototype;
			return replay;
		} else if (!recording && canPlayback()) {
			playback();
		}
	};
	state.isCallback = true;
	state.recording = true;
	var playback = function() {
			callSeq.shift();
			callSeq[0].apply(state);
	};
	var canPlayback = function() {
		return callSeq.length > 1;
	};

	imports.forEach(function(imprt, ii) {
			var fake = {};
			var methods = [];
			for (a in imprt) { methods.push(a); }
			methods.forEach(function(a, i) {

				fake[a] = function() {
					var capturedArguments = arguments;
					var hasCallback = new Array().slice.call(arguments).some(function(arg){
						return arg === state || arg instanceof identity; 
					});
					saved = function() {
						imprt[a].apply(imprt, capturedArguments);
						if (!hasCallback && canPlayback()) {
							playback();	
						}
					};
					callSeq.push(saved);
				}
				});
			mocks.push(fake);
			});


	seqblock.apply(state, mocks); // created a callSeq
	recording = false;
	// we now have a call sequence
	callSeq[0].apply(state);
}
