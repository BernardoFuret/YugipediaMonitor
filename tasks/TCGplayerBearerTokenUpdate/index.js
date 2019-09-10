/**
 * TCGplayerBearerTokenUpdate
 */

const fs = require( "fs" );

const fetch = require( "node-fetch" );

const DiscordLogger = require( "../../DiscordLogger.js" );

const ScheduledTask = require( "../ScheduledTask.js" );

const props = require( "./properties.json" );

const config = require( "./config.json" );

const task = async function() {
	const response = await fetch( config.url, {
		method: 'POST',
		headers: config.headers,
		body: new URLSearchParams( config.params ),
	} ).then( res => res.json() );
	
	const bearerToken = response.access_token;

	if ( !bearerToken ) { // TODO: manage this better.
		this.logger.warn( "No bearer token!", response );
	} else {
		fs.readFile( config.tcgplayerScriptPath, "utf8", ( err, content ) => {
			if ( err ) {
				this.logger.warn( "Error reading", config.tcgplayerScriptPath, err );
			} else {
				const updatedContent = content.replace(
					/(?<=^[ \t]+var bearerToken[ \t]+=[ \t]+')(.*?)';(.*?)$/gm,
					() => `${bearerToken}'; // Last updated at: ${new Date().toISOString()}`
				);

				fs.writeFile( config.tcgplayerScriptPath, updatedContent, err => {
					if ( err ) {
						this.logger.warn( "Error writing into", config.tcgplayerScriptPath, err );
					} else {
						this.logger.info( "Updated with success!" );
					}
				} );
			}
		} );
	}
};

module.exports = channel => new ScheduledTask(
	props.schedule,
	new DiscordLogger( props.name, channel ),
	task,
);