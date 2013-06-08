/*
 * TypoFix
 * Toady Module
 * Copyright 2013 Tom Frost
 */

/**
 * TypoFix lets users correct typos in their messages by using the standard
 * regex replace syntax:
 *
 *     s/FIND/REPLACE/
 *
 * If Toady can't see anything to correct in a user's last message, it will
 * then check the last message said by any user in the channel and correct
 * that instead :)
 *
 * @param {Object} config A Toady config object
 * @param {Object} client An IRC client object
 * @param {Object} modMan The Toady ModManager object
 * @returns {Object} A Toady mod
 */
module.exports = function(config, client, modMan) {

	var lastMsgChanUser = {},
		triggerRegex = /^s\/([^\/]+)\/([^\/]+)\/?$/,
		lastMsgChan = {};

	function messageHandler(from, to, text) {
		if (to[0] == '#' || to[0] == '&') {
			var matches = text.match(triggerRegex);
			if (matches) {
				if (lastMsgChanUser[to] && lastMsgChanUser[to][from] &&
						lastMsgChanUser[to][from].indexOf(matches[1]) != -1) {
					var newText = lastMsgChanUser[to][from].replace(matches[1],
						matches[2]);
					lastMsgChanUser[to][from] = newText;
					sayCorrection(to, from, from, newText);
				}
				else if (lastMsgChan[to] &&
					lastMsgChan[to].msg.indexOf(matches[1]) != -1) {
					sayCorrection(to, lastMsgChan[to].nick, from,
						lastMsgChan[to].msg.replace(matches[1], matches[2]));
				}
			}
			else {
				if (!lastMsgChan[to])
					lastMsgChan[to] = {};
				lastMsgChan[to].msg = text;
				lastMsgChan[to].nick = from;
				if (!lastMsgChanUser[to])
					lastMsgChanUser[to] = {};
				lastMsgChanUser[to][from] = text;
			}
		}
	}
	client.on('message', messageHandler);

	function partHandler(channel, nick) {
		if (nick == client.nick) {
			if (lastMsgChan[channel])
				delete lastMsgChan[channel];
			if (lastMsgChanUser[channel])
				delete lastMsgChanUser[channel];
		}
		else if (lastMsgChanUser[channel] && lastMsgChanUser[channel][nick])
			delete lastMsgChanUser[channel][nick];
	}
	client.on('part', partHandler);

	function sayCorrection(channel, originator, corrector, newText) {
		var prefix;
		if (originator == corrector)
			prefix = originator + " meant: ";
		else
			prefix = corrector + " thinks " + originator + " meant: ";
		client.say(channel, prefix + '"' + newText + '"');
	}

	return {
		name: 'TypoFix',
		desc: "Fix typos by saying s/FIND/REPLACE/ after your message",
		version: '0.1.0',
		author: 'Tom Frost',
		unload: function() {
			client.removeListener('message', messageHandler);
			client.removeListener('part', partHandler);
		}
	};
};
