/**
 * Logger
 */
const Logger = require( "./Logger.js" );

function formatToPrint( args ) {
	return args
		.map( arg => typeof arg === "string"
			? arg
			: ( arg instanceof Error
				? `${arg}\n${'```\n'}${arg.stack}${'```'}`
				: `${'```JSON\n'}${JSON.stringify( arg )}${'```'}`
			)
		)
		.join( " " )
		.substring( 0, 2000 )
	;
}

module.exports = class DiscordLogger extends Logger {
	constructor( name, channel ) {
		super( name );

		this.channel = channel;
	}

	info( ...args ) {
		super.info( ...args );

		return this.channel.send( {
			"embed": {
				"title": this.name,
				"description": formatToPrint( args ),
				"color": 1276176,
				"timestamp": this.date,
			},
		} );
	}

	warn( ...args ) {
		super.warn( ...args );

		return this.channel.send( {
			"embed": {
				"title": this.name,
				"description": formatToPrint( args ),
				"color": 13930502,
				"timestamp": this.date,
			},
		} );
	}

	error( ...args ) {
		super.error( ...args );

		return this.channel.send( {
			"embed": {
				"title": this.name,
				"description": formatToPrint( args ),
				"color": 16711680,
				"timestamp": this.date,
			},
		} );
	}
}

/*
TODO:
add   "author": {
      	"name": "ERROR"
      },

args.map( arg => typeof arg !== typeof ""
				? JSON.stringify( arg, null, "  " )
				: arg
 */