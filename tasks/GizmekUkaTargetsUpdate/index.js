/**
 * AdsTxtUpdate
 */

const { promises: fsp } = require( 'fs' );

const fetch = require( "node-fetch" );

const STATS = require( './stats.js' );

const DiscordLogger = require( "../../DiscordLogger.js" );

const ScheduledTask = require( "../ScheduledTask.js" );

const props = require( "./properties.json" );

const { dumpFile } = require( './config.json' );

function makeQuery( stat ) {
	const query = `[[Medium::TCG||OCG]][[ATK string::${stat}]][[DEF string::${stat}]][[Belongs to::Main Deck]][[Summoning::Can be Special Summoned]]|?Attribute|?Type|?Stars string|?Summoning|?Primary type|limit=500`;

	return `https://yugipedia.com/api.php?action=ask&query=${encodeURIComponent( query )}&format=json`;
}

async function updateHtmlPage( monsters ) {
	const content = await fsp.readFile( dumpFile, 'utf8' );

	const updatedContent = content.replace(
		/(?<=^[ \t]*const[ \t]+YUGIPEDIA_DATA[ \t]+=[ \t]+)(.*?)(; ?)(.*?)$/gm,
		`${JSON.stringify( monsters )}$2// Last updated at: ${new Date().toISOString()}`,
	);

	return fsp.writeFile( dumpFile, updatedContent );
}

async function fetchData() {
	const monsters = [];

	for ( const stat of STATS ) {
		const response = await fetch( makeQuery( stat ) ).then( r => r.json() );

		Object.entries( response.query.results ).forEach( ( [ monster, { printouts } ] ) => {
			if (
				monster.match( '(original)' )
				||
				printouts[ 'Primary type' ].some( t => t.fulltext.match( /ritual/i ) )
			) {
				return;
			}

			monsters.push( {
				name: monster,
				atkDef: stat,
				attribute: ( printouts.Attribute[ 0 ] || {} ).fulltext,
				type: ( printouts.Type[ 0 ] || {} ).fulltext,
				level: printouts[ 'Stars string' ][ 0 ],
				ssFromDeck: !printouts.Summoning.includes( 'Cannot be Special Summoned from the Deck' ),
			} );
		} );
	}

	return monsters;
}

const task = async function() {
	return fetchData()
		.then( updateHtmlPage )
		.then( () => this.logger.info( 'Updated successfully.' ) )
		.catch( this.logger.error.bind( this.logger, 'Something bad happened:' ) )
	;
};

module.exports = channel => new ScheduledTask(
	props.schedule,
	new DiscordLogger( props.name, channel ),
	task,
).exec();
