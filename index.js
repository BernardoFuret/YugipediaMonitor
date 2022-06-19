/**
 * YugipediaMonitor
 */

const Discord = require( "discord.js" );

const Logger = require( "./Logger.js" );

const config = require( "./config.json" );

const props = require( "./properties.json" );

/**
 * Constants.
 */
const bot = new Discord.Client();

const logger = new Logger( props.name );

/**
 * `ready` event handler.
 */
bot.once( "ready", () => {
	bot.user.setStatus( "dnd" );

	bot.user.setActivity( "server tasks.", {
		type: "WATCHING",
	} );

	const channel = bot.channels.get( config.channelID );

	channel.send( `Logged in at ${new Date().toISOString()}` );

	const tasks = require( "./tasks" )( channel );
} );

// tagged: message.mentions.users.get( bot.user.id );

/**
 * `info` event handler.
 */
bot.on( "info", logger.info.bind( logger ) );

/**
 * `debug` event handler.
 */
bot.on( "debug", logger.debug.bind( logger ) );

/**
 * `warn` event handler.
 */
bot.on( "warn", logger.warn.bind( logger ) );

/**
 * `error` event handler.
 */
bot.on( "error", error => {
	logger.error( error );

	if ( /ECONNRESET/.test( error.message ) ) {
		logger.info( "Restarting" );

		bot.login( config.token );
	}
} );

/**
 * Bot login.
 */
bot.login( config.token );
