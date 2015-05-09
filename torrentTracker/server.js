
//Import jsFlow


var jsFlow = require('./jsFlow');

// this is needed to run jsFlow
jsFlow.run("31bc728296d8da7e14e132k",{userId: 'tracker', sessionAuthURL: 'http://corslabs.com/jsflow', 
                  debugMsg: true});

//Dictionary med Hash / jsFlow ID
var dictionaryOfPeers = {};

var dictionaryOfHashes = {};

// =================
//  jsFlow handlers
// =================

jsFlow.addHandler('announce', function (payload, from) {
	console.log('Got data!', payload);
	dictionaryOfHashes[payload.info_hash] = dictionaryOfHashes[payload.info_hash] || [];
	dictionaryOfHashes[payload.info_hash].push(payload);
});

//more...