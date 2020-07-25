/**
 * AdsTxtUpdate
 */

const { promises: fsp } = require( 'fs' );

const fetch = require( 'node-fetch' );

const DiscordLogger = require( '../../DiscordLogger.js' );

const ScheduledTask = require( '../ScheduledTask.js' );

const props = require( './properties.json' );

const { adsUrls, adsTxtFile } = require( './config.json' );

const task = async function() {
	const adsTextRequests = adsUrls.map( url => fetch( url ).then( r => r.text() ) );

	const adsTextContent = await Promise.all( adsTextRequests );

	return fsp.writeFile( 'adsTxtFile', adsTextContent.join( '\n\n# # # # # #\n\n' ) )
		.then( () => this.logger.info( 'Updated with success!' ) )
		.catch( this.logger.error.bind( this.logger, 'Error updating ads.txt:' ) )
	;
};

module.exports = channel => new ScheduledTask(
	props.schedule,
	new DiscordLogger( props.name, channel ),
	task,
);