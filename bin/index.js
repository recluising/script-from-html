#!/usr/bin/env node

var program = require('commander');
var Nightmare = require('nightmare');
var fs = require('fs');

program
	.version('0.1.0')
	.usage('-u <url> -o <path>')
	.option('-u, --url [URL]', '[Mandatory] URL to scrap from shakespeare.mit.edu')
	.option('-o, --output [Path]', '[Mandatory] Path to file for saving script')
	.parse(process.argv);


if (!program.url || !program.output) {
	program.help();
	return;
}

var nightmare = Nightmare();
console.log(program.url);
nightmare
	.goto(program.url) // URL example: http://shakespeare.mit.edu/hamlet/full.html
	.evaluate(function () {
		var script = [];

		var currentUser = 'Director';

		// Parse blockquote, specialization
		function handleBlockQuote(children) {
			var currentChildren;
			var tag;

			for (var index in children) {
				currentChild = children[index];

				if (currentChild.tagName && currentChild.textContent) {
					tag = currentChild.tagName.toLowerCase();

					if (tag == 'h3' || tag === 'a') {
						pushScriptLine(currentUser, currentChild.textContent);
					} else if (tag === 'p') {
						var tempUser = 'Director';
						pushScriptLine(tempUser, currentChild.textContent);
					}
				}
			}
		}

		// Parse node, first level
		function parseNode(node) {
			if (!currentNode.innerHTML && !currentNode.textContent) {
				return;
			}

			var tagName = node.tagName.toLowerCase();

			switch (tagName) {
				case 'h3':
					currentUser = 'Director';
					pushScriptLine(currentUser, node.textContent);
					break;

				case 'blockquote':
					handleBlockQuote(node.childNodes);
					break;

				case 'a':
					currentUser = node.querySelector('b').textContent;
					break;
			}
		}

		// Script line filler
		function pushScriptLine(user, message) {
			script.push({
				user: user,
				message: message
			});
		}

		var currentNode = document.querySelector('h3');

		// Handling first node
		parseNode(currentNode);

		// Main iterator
		while (currentNode = currentNode.nextElementSibling) {
			parseNode(currentNode);
		}
		return script;

	})
	.end()
	.then(function (result) {
		fs.writeFile(program.output, JSON.stringify(result), function (err) { // Output example: "./henryv.json""
			if (err) {
				return console.log(err);
			}

			console.log("The file was saved!");
		});
		console.log(result);
	})
	.catch(function (error) {
		console.error('Search failed:', error);
	});

// Test with cheerio and request.
