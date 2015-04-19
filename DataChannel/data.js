// ============
//  Run jsFlow
// ============

var userID;

jsFlow.onRecievedUserId = function(userId) {
 	console.log('userId', userId);
 	userID = userId;
 	$('div#myUserName').html('Your (Alice) user ID: ' + userId);
};

// this is needed to run jsFlow
jsFlow.run("31bc728296d8da7e14e132k",{sessionAuthURL: 'http://corslabs.com/jsflow', 
                  debugMsg: true});

var storeIce = [];

// =================
//  jsFlow handlers
// =================

jsFlow.addHandler('SDPoffer', function (offer, from) {

	pc.onicecandidate = function(event) {
		jsFlow.messageUser(from, event.candidate, 'ICEcandidate');
	};

	offer = new SessionDescription(offer);
	pc.setRemoteDescription(offer);

	pc.createAnswer(function (answer) {
		pc.setLocalDescription(answer, function() {
			readyForIce = true;
			processStoredIceCandidates();
		}, function(error) {
			console.log("Error in set local description ", error);
		});

		jsFlow.messageUser(from, answer, 'SDPanswer');

	}, function(error) {
		console.log("Error in create answer ", error);
	});
});

jsFlow.addHandler('SDPanswer', function (answer, from) {
	console.log("Got SDP answer");

	answer = new SessionDescription(answer);
	pc.setRemoteDescription(answer);
});

// Handles ICE candidate
jsFlow.addHandler('ICEcandidate', function (candidate, from) {
	if (!readyForIce) {
		storeIce.push(candidate);
	}
	else if (candidate) {
		cand = new IceCandidate(candidate);
		pc.addIceCandidate(cand);
	}
});

var processStoredIceCandidates = function() {
	storeIce.forEach(function(candidate) {
		cand = new IceCandidate(candidate);
		pc.addIceCandidate(cand);
	})
}

// ============================
//  Initialize peer connection
// ============================
var PeerConnection = window.RTCPeerConnection || 
					window.mozRTCPeerConnection || 
					window.webkitRTCPeerConnection

// =========================
//  Set session description
// =========================
var SessionDescription = window.RTCSessionDescription || 
						window.mozRTCSessionDescription || 
						window.webkitRTCSessionDescription;

// =======================
//  Create ice candidates
// =======================
var IceCandidate = window.mozRTCIceCandidate || 
					window.RTCIceCandidate;

var STUN = {
    url: 'stun:stun.l.google.com:19302',
    url: 'stun:23.21.150.121',
};

var iceServers = {
	iceServers: [STUN]
};

var readyForIce = false;
var storeIce = [];

var dataChannelOptions = {
	//ordered: true, // guarantees that the data arrives
	//reliable: false
};

var pc = new PeerConnection(iceServers);
console.log("Let's make a data channel!");

var myMessageHandler = function (event) {
	console.log("We've got a message!");
	console.log("Message on data channel: ", event.data);

	$('div#receivedMessages').append('<div class="otherMessage">'+event.data+'</div>')
};

pc.ondatachannel = function (event) {
	// ourchannel is global
	window.ourchannel = event.channel;
	console.log("Datachannel was added");
	console.log(event.channel.id);

	event.channel.onmessage = myMessageHandler;
};


// Start connection, only in one browser
var createConnection = function(user) {
	var datachannel = pc.createDataChannel('RTCDataChannel', dataChannelOptions);
	window.ourchannel = datachannel;

	datachannel.onmessage = myMessageHandler;

	pc.onicecandidate = function(event) {
		jsFlow.messageUser(user, event.candidate, 'ICEcandidate');
	};

	// Create and send SDP offer
	pc.createOffer(function(offer) {
		var sdpoffer = new SessionDescription(offer);

		jsFlow.messageUser(user, sdpoffer, 'SDPoffer');

		pc.setLocalDescription(offer, function() {
			console.log("Local description set.");
			readyForIce = true;
			processStoredIceCandidates();
		});

	}, function(error) {
		console.log("Error in create offer ", error);
	});
};

// jQuery hooks
$('#setup').click(function(evt) {
	var idOfBob = $('input#idOfBob').val();
	console.log('Will connect to', idOfBob);

	createConnection(idOfBob);
});

$('#send').click(function(evt) {
	console.log('Send was pressed!');
	var messageToSend = $('textarea#messageToSend').val();

	ourchannel.send(messageToSend);
	$('div#receivedMessages').append('<div class="myMessage">'+messageToSend+'</div>')

});


