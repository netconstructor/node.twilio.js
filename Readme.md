node.twilio.js
==============

What
----

node.twilio.js includes two core modules:

- Verb
	
	`Verb` is a basic class that renders TwiML. Ensures that the the attributes and nestings are valid TwiML.
	
- Client
	
	`Client` is a set of helper functions that leverage `restler`. Unlike the Twilio PHP client, this is fully asynchronous.
	
How to use:
-----------

First, mixin all the helpers

	process.mixin(require('./lib/node.twilio'));

Then, all the supported Verbs (`response`, `say`, `play`, `record`, `dial`, `redirect`, `pause`, `hangup`, `gather`, `number`, `conference`, `sms`) can be easily created and nested as functions, instead of having to instantiate the classes using `new`:

	var number = 6197087128,
	xml = response(
		say('A customer at the number ', number,' is calling'),
		dial(number)
	);
	
For example, you can easily implement the Node HTTP server and return this XML in a callback page:

	var url = require('url'), http = require('http');
	
	// ...
	
	http.createServer(function(req, res){
		
		switch (url.parse(req.url).pathname){
			// ...
			
			case 'callback':
				res.writeHead(200, {'Content-type': 'text/xml'});
				res.write(
					response(
						say('A customer at the number ', number,' is calling'),
						dial(number),
						sms(mom)
					)
				);
				break;
			
		}
		
	});
	
To make API requests, get the client like this:

	api = client('sid', 'token', 'api version');
	
The API version defaults to `2008-08-01`, and the sid and token you get from your account at http://twilio.com
	
The following methods are exposed:

	api.get(path, options)
	
	api.put(path, options);
	
	api.post(path, options);
	
	api.del(path, options);
	
For example, to initiate an outgoing call:
	
	api.post('Accounts/'+ accountid +'/Calls', {data: {
		Caller: number,
		Called: outgoing,
		Url: '/mycallback'
	}}).addListener('success', function(){
		// on success
	}).addListener('error', function(){
		// on error
	});
	
A cool thing is that the argument passed to the callbacks is an object ready to use, and no parsing is needed. For example, the following could work in the example above:

	.addListener('error', function(resp){
		sys.puts('Twillio error': resp.twilioresponse.restexception.message);
	});
	
Examples
--------

Browse to `examples/clicktocall`, edit clicktocall.js to add your sid, token, domain and phone numbers, and run

	node clicktocall.js
	
Then point your browser to `http://localhost:8080` to see the demo.
	
Extending
---------

After cloning the repostiory, make sure to run

	git	submodule init
	git submodule update
	
to make sure that [js-oo](http://github.com/visionmedia/js-oo) and [restler](http://github.com/danwrong/restler) are fetched. 
	
Author
------

`node.twilio.js` was created by [Guillermo Rauch](http://devthought.com) during a lunch break to automate his phone calls for an eventual campaign for presidency.