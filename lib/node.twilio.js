this.Twilio = {
	version: '0.1'
};

require.paths.unshift(__dirname + '/vendor/js-oo/lib');
require('oo');

process.mixin(require('./node.twilio/verb'));
process.mixin(require('./node.twilio/client'));