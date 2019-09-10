/**
 * AdsTxtUpdate
 */

const fs = require( "fs" );

const fetch = require( "node-fetch" );

const DiscordLogger = require( "../../DiscordLogger.js" );

const ScheduledTask = require( "../ScheduledTask.js" );

const props = require( "./properties.json" );

const { adsUrl: ADS_URL, adsTxt: ADS_TXT } = require( "./config.json" );

const task = async function() {
	const adsText = await fetch( ADS_URL ).then( res => res.text() ); // TODO: Error handling.

	fs.writeFile( ADS_TXT, adsText, err => {
		if ( err && err !== "EEXIST" ) {
			this.logger.warn( "Error updating ads.txt:", err );
		} else {
			this.logger.info( "Updated with success!" );
		}
	} );
};

module.exports = channel => new ScheduledTask(
	props.schedule,
	new DiscordLogger( props.name, channel ),
	task,
);