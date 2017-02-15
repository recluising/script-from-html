#!/usr/bin/env node

var program = require('commander');
var Nightmare = require('nightmare');

program
	.version('0.1.0')
	.parse(process.argv);

var nightmare = Nightmare();

nightmare
	.goto('http://shakespeare.mit.edu/hamlet/full.html')
	.evaluate(function () {
		var script = [];
		var text;
		var tag;

		var currentUser = 'Director';

		function parseNode(tag, text) {
			var tagName = tag.toLowerCase();
			var userName;

			switch (tagName) {
				case 'h3':
					currentUser = 'Director';
					pushScriptLine(currentUser, text)
					break;

				case 'blockquote':
					// iterate blockquote when <p><i> is narrator and <a> is conversation
					break;

				case 'a':
					userName = //get child <b> content
					currentUser = userName;
					break;
			}
		}

		function pushScriptLine(currentUser, message) {
			script.push({
				user: currentUser,
				message: message
			});
		}

		var currentNode = document.querySelector('h3');

		// Handling first node
		script.push(pushScriptLine(currentUser, currentNode.textContent));

		while (currentNode = currentNode.nextElementSibling) {
			text = currentNode.textContent;
			if (text) {
				tag = currentNode.tagName;
				parseNode(tag, text);
			}
		}
		return script;

	})
	.end()
	.then(function (result) {
		console.log(result);
	})
	.catch(function (error) {
		console.error('Search failed:', error);
	});

// Test with cheerio and request.
