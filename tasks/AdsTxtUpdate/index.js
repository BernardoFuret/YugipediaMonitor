/**
 * AdsTxtUpdate
 */

const { promises: fsp } = require( 'fs' );

const path = require( 'path' );

const fetch = require( 'node-fetch' );

const DiscordLogger = require( '../../DiscordLogger.js' );

const ScheduledTask = require( '../ScheduledTask.js' );

const props = require( './properties.json' );

async function readJsonFile( file ) {
	return fsp.readFile( path.join( __dirname, file ) )
		.then( JSON.parse )
	;
}

const task = async function() {
	const { adsUrls, adsTxtFile, appendText } = await readJsonFile( './config.json' );

	const adsTextRequests = adsUrls.map( url => fetch( url ).then( r => r.text() ) );

	const adsTextContent = await Promise.all( adsTextRequests );

	const content = [
		`# Last updated at: ${new Date().toISOString()}`,
		...adsTextContent,
		...appendText,
	].join( '\n\n# # # # # #\n\n' );

	return fsp.writeFile( adsTxtFile, content )
		.then( () => this.logger.info( 'Updated with success!' ) )
		.catch( e => this.logger.error( 'Error updating ads.txt:', e ) )
	;
};

module.exports = channel => new ScheduledTask(
	props.schedule,
	new DiscordLogger( props.name, channel ),
	task,
).exec();
