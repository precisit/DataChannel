
//Import jsFlow
var jsFlow = require('./jsFlow');

//Stuff from commons
ACTIONS = { CONNECT: 0, ANNOUNCE: 1, SCRAPE: 2, ERROR: 3 }
EVENTS = { update: 0, completed: 1, started: 2, stopped: 3 }
EVENT_IDS = {
  0: 'update',
  1: 'completed',
  2: 'started',
  3: 'stopped'
}

//From bittorrent-tracker server sample. Will use instead of implementing own custom logic. (Faster / seems good)
var Swarm = require('./swarm')

// Basic setup / config 
var _intervalMs = 1 * 60 * 1000 // 1 min
var torrents = {}

// this is needed to run jsFlow
jsFlow.run("31bc728296d8da7e14e132k",{userId: 'tracker', sessionAuthURL: 'http://corslabs.com/jsflow', 
                  debugMsg: true});


// ===============
//  jsFlow handler
// ===============

jsFlow.addHandler('announce', function (params, from) { // Handle incoming announces
	var swarm = getSwarm(params.info_hash, params); // Get swarm for info_hash

	if (!params.event || params.event === 'empty') params.event = 'update'; // Set default event
	if (!params.peer_id) params.peer_id = from;

	swarm.announce(params, function (err, response) {
		if(err) throw err;

	    if (!response.action) response.action = ACTIONS.ANNOUNCE
	    if (!response.interval) response.interval = Math.ceil(_intervalMs / 1000)

	    if (params.compact === 1) {
			var peers = response.peers
		} 

		response.interval = _intervalMs
		response.info_hash = params.info_hash

		console.log('Will send response!!');
		console.log(response);

		jsFlow.messageUser(from, response, 'list');
	});
});

var getSwarm = function(infoHash, params) {
	if (!params) params = {}
	if (Buffer.isBuffer(infoHash)) infoHash = infoHash.toString('hex')

	var swarm = torrents[infoHash]
	if (!swarm) swarm = torrents[infoHash] = new Swarm(infoHash)

	return swarm
}

