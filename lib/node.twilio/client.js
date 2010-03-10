var restler = require('../vendor/restler/lib/restler');

this.client = function(sid, token, version){
	return new restler.Service({
		baseURL: 'https://api.twilio.com/' + (version ? version: '2008-08-01') + '/',	
		username: sid,
		password: token			
	});
};