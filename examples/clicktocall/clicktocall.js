process.mixin(require('../../lib/node.twilio'));

var http = require('http'),
		qs = require('querystring'),
		url = require('url'),
		sys = require('sys'),
		
sid = 'your sid',

token = 'your token',
		
api = client(sid, token),

number = 'caller id registered in your twilio account',
		
outgoing = 'outgoing number you wish to call',

callbackPrefix = 'http://your.external.domain.com:8080',

server = http.createServer(function(req, res){
	var uri = url.parse(req.url, true), data;
	
	switch (uri.pathname){		
		case '/':
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write('<!doctype html>'
							+ '<h3>Enter your phone number, and you will be connected to '+ outgoing +'</h3>'
							+ '<form action="/do" method="post">'
								+ '<label>Your number <input type=text name=called></label>'
								+ '<input type=submit value="Connect me!">'		
								+ ((uri.query && uri.query.error) ? '<p style="color:red">'+ uri.query.error +'</p>' : '')
							+ '</form>');
			res.close();
			break;
			
		case '/do':
			req.addListener('data', function(d){
				data = qs.parse(d);
				
				if (!data.called || String(data.called).length != 10 || String(data.called) != Number(data.called)){
					res.writeHead(303, {'Location': '/?error=' + encodeURIComponent('Bad number')});
					res.close();
				} else {				
					api.post('Accounts/' + sid + '/Calls', {
						data: {
							'Caller': number,
							'Called': outgoing,
							'Url': callbackPrefix + '/callback?number=' + data.called
						}						
					}).addListener('success', function(){
						res.writeHead(200, {'Content-Type': 'text/html'});					
						res.write('<h3>Connecting!</h3>');
						res.close();
					}).addListener('error', function(resp){
						res.writeHead(303, {'Location': '/?error=' + encodeURIComponent('Twilio error! ' + resp.twilioresponse.restexception.message )});
						res.close();
					});
				}
			});
			break;
		
		case '/callback':
			res.writeHead(200, {'Content-Type': 'text/xml'});
			req.addListener('data', function(d){
				data = qs.parse(d);
				
				res.write(
					// xml helpers syntax sugar
					response(
						say('A customer at the number ', data.number,' is calling'),
						dial(data.number)
					)
				);
				res.close();
			});
			break;
			
		default:
			res.writeHead(404);
			res.write('404');
			res.close();
			break;
	}
});

server.listen(8080);

sys.puts('Accepting connections at http://localhost:8080');