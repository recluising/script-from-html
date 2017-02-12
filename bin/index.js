#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');
var clear = require('clear');
var chalk = require('chalk');
var figlet = require('figlet');
var request = require('request');

program
	.version('0.1.0')
	/*.option('-l, --lala', 'do somehting')*/
	.parse(process.argv);


/*if (program.lala) {
	console.log('lalalalalala');
	process.exit();
}*/

request({
  uri: "http://shakespeare.mit.edu/hamlet/full.html",
}, function(error, response, body) {
  console.log(body);
});


/**clear();
console.log(
	chalk.yellow(
		figlet.textSync('SFH', {
			horizontalLayout: 'full'
		})
	)
);*/
