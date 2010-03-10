var sys = require('sys');
var Verb = this.Verb = Class({
	
	attrs: [],
	
	verbs: [],
	
	init: function(children, attributes){
		this.children = [];
		this.attributes = {};				
		if (children) this.adopt.apply(this, children);
		for (var i in attributes) this.setAttribute(i, attributes[i]);		
	},
	
	adopt: function(){
		for (var i = 0, child; child = arguments[i]; i++){
			if (child instanceof Verb && this.verbs.indexOf(child.tag) == -1){
				throw new Error('Verb "'+ child.tag +'" not allowed in verb "'+ this.tag +'"');
			}
			this.children.push(child);
		}		
		return this;
	},
	
	setAttribute: function(k, v){
		if (this.attrs.indexOf(k) == -1){
			throw new Error('Attribute "'+ k +'" not allowed in verb "'+ this.tag +'"');
		}
		this.attributes[k] = v;
		return this;
	},
	
	toString: function(){
		var atts = '';
		for (var i in this.attributes) atts += ' ' + i + '="' + this.attributes[i] + '"';
		return '<' + this.tag + atts + (this.children.length ? ('>' + this.children.join('') + '</' + this.tag + '>') : ' />');
	},
	
	valueOf: function(){
		return this.toString();
	}
	
});

Verb.Response = Verb.extend({
	
	tag: 'response',
	
	verbs: ['say', 'play', 'gather', 'record', 'dial', 'redirect', 'pause', 'hangup', 'sms']
	
});

Verb.Say = Verb.extend({
	
	tag: 'say',
	
	attrs: ['voice', 'language', 'loop']
	
});

Verb.Play = Verb.extend({
	
	tag: 'play',

	attrs: ['loop']
	
});

Verb.Record = Verb.extend({
	
	tag: 'record'
	
});

Verb.Dial = Verb.extend({
	
	tag: 'dial',
	
	attrs: ['action', 'method', 'timeout', 'hangupOnStar', 'timeLimit', 'callerId'],
	
	verbs: ['number', 'conference']
	
});

Verb.Redirect = Verb.extend({
	
	tag: 'redirect',
	
	attrs: ['method']
	
});

Verb.Pause = Verb.extend({
	
	tag: 'pause',
	
	attrs: ['length']
	
});

Verb.Hangup = Verb.extend({
	
	tag: 'hangup'
	
});

Verb.Gather = Verb.extend({
	
	tag: 'gather',
	
	attrs: ['action', 'method', 'timeout', 'finishOnKey', 'numDigits']
	
});

Verb.Number = Verb.extend({
	
	tag: 'number',
	
	attrs: ['url', 'sendDigits']
	
});

Verb.Conference = Verb.extend({
	
	tag: 'conference',
	
	attrs: ['muted', 'beep', 'startConferenceOnEnter', 'endConferenceOnExit', 'waitUrl', 'waitMethod']
	
});

Verb.Sms = Verb.extend({
	
	tag: 'sms',
	
	attrs: ['to', 'from', 'action', 'method', 'statusCallback']
	
});

for (var i in Verb){
	(function(i){	
		if (Verb[i].prototype.tag) this[i.toLowerCase()] = function(){
			var children = [], atts = {}, args = arguments;			
			for (var a = 0, arg; arg = arguments[a]; a++){	
				if (a + 1 === arguments.length && typeof arg == 'object' && !(arg instanceof Verb)){
					atts = arg;
				} else {
					children.push(arg);
				}
			}			
			return new Verb[i](children, atts);
		};
	})(i);
}