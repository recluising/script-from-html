#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');
var scrapeIt = require('scrape-it');

program
	.version('0.1.0')
	.parse(process.argv);

scrapeIt('http://shakespeare.mit.edu/hamlet/full.html', {
	chapters: {
		listItem: 'h3'
	},
	narratorFromChapters: {
		listItem: 'blockquote > i'
	},
	messages: {
		listItem: 'blockquote',
		data: {
			fromRole: {
				selector: 'a'
			},
			fromNarrator: {
				selector: 'p i'
			}
		}
	},
	roles: {
		listItem: 'a > b'
	}
}).then(page => {
	console.log(page.messages);
});
