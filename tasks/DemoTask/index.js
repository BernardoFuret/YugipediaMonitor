/**
 * Demo task.
 */

const DiscordLogger = require( "../../DiscordLogger.js" );

const ScheduledTask = require( "../ScheduledTask.js" );

const props = require( "./properties.json" );

const task = function() {
	if ( Math.floor( Math.random() * 10 ) < 5 ) {
		this.logger.info( "Demo task executed!" );
		console.log( "Demo task executed! (raw)" );
	} else {
		( {} ).will.explode;
	}
};

module.exports = channel => new ScheduledTask(
	props.schedule,
	new DiscordLogger( props.name, channel ),
	task,
);