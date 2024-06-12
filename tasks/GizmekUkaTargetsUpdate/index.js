/**
 * Gizmek Uka targets update
 */

const { promises: fsp } = require( 'fs' );

const fetch = require( 'node-fetch' );

const DiscordLogger = require( '../../DiscordLogger.js' );

const ScheduledTask = require( '../ScheduledTask.js' );

const props = require( './properties.json' );

const { dumpFile } = require( './config.json' );

const smwQuery = `[[Medium::TCG||OCG]][[Misc::Equal ATK and DEF]][[Belongs to::Main Deck]][[Summoning::Can be Special Summoned]]|?ATK|?DEF|?Attribute|?Type|?Stars string|?Summoning|?Primary type|limit=1000`;

const smwQueryApiurl = `https://yugipedia.com/api.php?action=ask&query=${encodeURIComponent( smwQuery )}&format=json`;

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

	const response = await fetch( smwQueryApiurl ).then( r => r.json() );

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
			atkDef: printouts.ATK[ 0 ] || printouts.DEF[ 0 ],
			attribute: ( printouts.Attribute[ 0 ] || {} ).fulltext,
			type: ( printouts.Type[ 0 ] || {} ).fulltext,
			level: printouts[ 'Stars string' ][ 0 ],
			ssFromDeck: !printouts.Summoning.find( o => o.fulltext === 'Cannot be Special Summoned from the Deck' ),
			isNormalMonster: !!printouts[ 'Primary type' ].find(o => o.fulltext.match( /Normal/ ) )
		} );
	} );

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
