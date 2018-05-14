# RecycleBotAPI
API For the RecylceBot Discord Bot and UI.

In order to run, needs a config.js file in the root directory. Example below:

```
module.exports = {
	cloudantCredentials: {
		username: '...',
		password: '...',
		database: '...' // This is arbitrary - will not be created for you if it doesn't exist, as the application expects data to already be present.
	},
	port: 3000
};
```
# Usage
`npm start`
## If you want better looking logs
1. `npm install -g bunyan`
2. `npm start | bunyan`

# Getting data into cloudant
You can use a [bot that I wrote](https://github.com/epswartz/DiscordCloudantCollector) to collect messages from your discord server and store them in a cloudant database 
