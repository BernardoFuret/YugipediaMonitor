/**
 * ScheduledTask
 */

const schedule = require( 'node-schedule' );

function start( self ) {
	self.logger.info( 'Starting.' );

	self.job = schedule.scheduleJob( self.schedule, () => {
		self.logger.debug( 'Executing scheduled job.' );

		self.exec();
	} );
}

module.exports = class ScheduledTask {
	
	constructor( schedule, logger, task ) {
		this.schedule = schedule;
		this.logger = logger;
		this.task = task;
		this.job = null;

		start( this );
	}

	async exec() {
		try {
			await this.task();
		} catch ( err ) {
			this.logger.error( err );
		}
	}

};