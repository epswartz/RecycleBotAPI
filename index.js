/*
        _.---._    /\\
      ./'       "--`\//
    ./     Ethan    o \
   /./\  )______   \__ \
  ./  / /\ \   | \ \  \ \
     / /  \ \  | |\ \  \7
      "     "    "  "       
*/
//jshint esversion:6, node:true
'use strict';
const path = require('path');
const config = require('./config');

// Set up express
const express = require('express');
var app = express();

// Set up bunyan
const bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'recyclebotapi'});

// TODO Load the apikey checker route - I am planning to make this package
/*
app.use(require('express-cloudant-basicauth').route({
	user: '...',
	pass: '...',
	database: 'basicauth'
}));
*/

// Route to set a the logger for the request, and do generic logging.
app.use((req, res, next) => {
	log.info({url: req.originalUrl}, 'Request');
	next();
});

// Load in all of the apis.
var normalizedPath = path.join(__dirname, "apis");
require("fs").readdirSync(normalizedPath).forEach(function(fileName) {
	if(fileName.includes('.js')){ // We leave out the readme.
		var apiObject = require(path.join(normalizedPath, fileName));
		app.use(apiObject.path, apiObject.app);
		log.info({path: apiObject.path}, 'Mounted an api sub-app');
	}
});

// TODO Err handler
app.use((err, req, res, next) => {
	let errRet = {
		message: err.message || '',
		statusCode: err.statusCode || 500,
		description: err.description || 'No description provided.'
	};
	log.error({err: errRet});
	res.status(errRet.statusCode || 500).send(errRet);
});

app.listen(config.port);