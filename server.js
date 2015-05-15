//Initial configuration
var express  = require('express');
var cc		 = require('config-multipaas');
var config      = cc();
var app      = express(); 								// create our app w/ express
var port  	 = process.env.OPENSHIFT_INTERNAL_PORT || 80; 				// set the port




// All the minified files will be stored in dist Eg. dist/js/app.min.js 
app.use(express.static(__dirname + '/dist')); 	// set the static files location
app.use(express.static(__dirname + '/public')); 	// set the static files location
app.use(express.static(__dirname + '/scripts')); 	// set the static files location


//route file
require('./app/routes/routes.js')(app);


//Start the awesomeness
app.listen( config.get('PORT'), config.get('IP'), function() {	
	console.log('Magic happens on port ',config.get('PORT'), config.get('IP')); 
});
