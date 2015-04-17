// ============
//  Run jsFlow
// ============

var userID;

jsFlow.onRecievedUserId = function(userId) {
 	console.log('userId', userId);
 	userID = userId;
 	/*var newli = document.createElement('userList');
 	txt = document.createTextNode(userID);
 	userList.appendChild(txt);*/
};

// this is needed to run jsFlow
jsFlow.run("31bc728296d8da7e14e132k",{sessionAuthURL: 'http://corslabs.com/jsflow', 
                  debugMsg: true});

var storeIce = [];

// ==========================
//  Handles to the html code
// ==========================

// bind function "setNickname" to button "Set Nickname"
//$("#nick").bind( "click", setNickname);
//var nickname = $('#nick').addEventListener("click", setNickname);
/*
function setNickname() {
    // get nickname field content
    console.log("Set username");
    var nickname = $( "#nick_field" ).value;
    // if a nickname has been set ...
    if( nickname ){
    	nickname.userId = userID;
    	window.alert( "Your nickname is ", nickname, ".");
    }
    else{
        // otherwise, display an alert
        alert( "you must enter a nickname !" );
    } 
};*/

// create data channel
//$( "#Setup").bind( "click", createConnection );

// send message 
//var sendButton = document.getElementById('Send');

// close data channel
//var closeButton = document.getElementById('Close');

/*setup.disabled = false;
sendButton.disabled = true;
closeButton.disabled = true;

startButton.onclick = createConnection;
sendButton.onclick = sendData;
closeButton.onclick = closeDataChannel;*/

// =================
//  jsFlow handlers
// =================

jsFlow.addHandler('SDPoffer', function (offer, from) {
	//var datachannel = pc.createDataChannel('RTCDataChannel', dataChannelOptions, {reliable: false});
	//console.log("Created send data channel");

	pc.ondatachannel = function (event) {
		//console.log("Datachannel was added");
		//datachannel = pc.createDataChannel('RTCDataChannel', dataChannelOptions, {reliable: false});
		console.log("Receive data channel");

		event.channel.onmessage = function (event) {
			console.log("Message");
			console.log("Message on data channel: ", event.data);
		};
	};

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
	// What happens when getting an ICE candidate
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
	ordered: true, // guarantees that the data arrives
};

var pc = new PeerConnection(iceServers);
var datachannel = pc.createDataChannel('RTCDataChannel', dataChannelOptions, {reliable: false});
//var datachannel2 = pc.createDataChannel('RTCDataChannel', dataChannelOptions, {reliable: false}); 

console.log("Created send data channel");

// Start connection, only in one browser
var createConnection = function(user) {
	// Create new peer connection

	pc.ondatachannel = function (event) {
		console.log("Datachannel was added");

		event.channel.onmessage = function (event) {
			console.log("Message!")
			console.log("Message on data channel: ", event.data);
		};
	};

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


/* Event handlers for the data channel
datachannel.onmessage = function (event) {
	console.log("Message on data channel: ", event.data);
};*/
/*
datachannel.onopen = function (event) {
	console.log("Successfully opened datachannel!");
	datachannel.send("Hello world!");
};

datachannel.onerror = function (event) {
	console.log("Error: ", event.error);
};

datachannel.onclosed = function (event) {
	console.log("Datachannel closed.");
};*/
