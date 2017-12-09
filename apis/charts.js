// jshint esversion:6, node:true
'use strict';
const app = require('express')();
const config = require('../config');
// const async = require('async');

// Set up bunyan
const bunyan = require('bunyan');
const log = bunyan.createLogger({name: 'API-charts'});

// Connect to Cloudant DB
const cloudant = require('cloudant')({
	account: config.cloudantCredentials.username,
	password: config.cloudantCredentials.password
});
const db = cloudant.db.use(config.cloudantCredentials.database);

// Route to serve all the charts at once in one object.
app.get('/all', (req, res, next) => {
	log.info('Fetching documents from Cloudant');
	db.list((listErr, listBody) => {
		if(listErr){
			return next(listErr);
		}else{
			db.fetch(listBody, (fetchErr, results) => {
				if(fetchErr){
					return next(fetchErr); // To the error handler we go :(
				}else{
					// Go through the docs counting some stuff and assemble our data.
					let response = {};
					response.totalMessages = results.rows.length;
					response.authorChart = {
						unique: 0,
						stats: {}
					};
					response.channelChart = {
						unique: 0,
						stats: {}
					};

					results.rows.forEach((result) => {
						if(!result.id.startsWith('_design')){ // If it's NOT a design doc
							if(response.authorChart.stats[result.doc.author.name]){ // If we already have this author
								response.authorChart.stats[result.doc.author.name]++;
							}else{ // If it's a new author, yet uncounted
								response.authorChart.stats[result.doc.author.name] = 1;
								response.authorChart.unique++;
							}

							if(response.channelChart.stats[result.doc.channel.name]){ // If we already have this channel
								response.channelChart.stats[result.doc.channel.name]++;
							}else{ // If it's a new channel, yet uncounted
								response.channelChart.stats[result.doc.channel.name] = 1;
								response.channelChart.unique++;
							}
						}

					});

					res.status(200).send(response);
				}
			});
		}
	});
});


// Export it so that the main app can mount it
module.exports = {
	path: '/charts',
	app: app
};