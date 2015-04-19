
//Import jsFlow


var jsFlow = require('./jsFlow');

// this is needed to run jsFlow
jsFlow.run("31bc728296d8da7e14e132k",{userId: 'tracker', sessionAuthURL: 'http://corslabs.com/jsflow', 
                  debugMsg: true});

//Dictionary med Hash / jsFlow ID
var dictionaryOfUsers = {};

// =================
//  jsFlow handlers
// =================

jsFlow.addHandler('TBD', function (payload, from) {
	console.log('Got data!', payload);
});

//more...