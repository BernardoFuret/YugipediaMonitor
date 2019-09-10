/**
 * Logger
 */

const wrap = s => `[${s}]`;

const getDate = () => new Date().toISOString();

const formatArgs = ( color, date, label, task, ...args ) => [
	`\x1b[${color}m%s`,
	wrap( date ),
	wrap( task ),
	label,
	...args,
	"\x1b[0m"
];

const LABELS = {
	DEBUG: wrap( "debug" ),
	ERROR: wrap( "error" ),
	INFO: wrap( "info" ),
	WARN: wrap( "warn" ),
};

const COLORS = {
	PURPLE: 35,
	WHITE: 0,
	YELLOW: 33,
	RED: 31,
};

module.exports = class Logger {

	constructor( name ) {
		this.name = name;
		this.console = global.console;
	}

	debug( ...args ) {
		this.date = getDate();

		return this.console.info( ...formatArgs( COLORS.PURPLE, this.date, LABELS.DEBUG, this.name, ...args ) );
	}

	info( ...args ) {
		this.date = getDate();

		return this.console.log( ...formatArgs( COLORS.WHITE, this.date, LABELS.INFO, this.name, ...args ) );
	}

	warn( ...args ) {
		this.date = getDate();

		return this.console.warn( ...formatArgs( COLORS.YELLOW, this.date, LABELS.WARN, this.name, ...args ) );
	}

	error( ...args ) {
		this.date = getDate();

		return this.console.error( ...formatArgs( COLORS.RED, this.date, LABELS.ERROR, this.name, ...args ) );
	}

};
