
const schedule = require( 'node-schedule' );

module.exports = class ScheduledTask {
	
	constructor( schedule, logger, task ) {
		//this.name = name; TODO: necessary?
		this.schedule = schedule;
		this.logger = logger;
		this.task = task;
		this.job = null;
	}

	start() {
		this.logger.info( `Starting.` );

		this.job = schedule.scheduleJob( this.schedule, async () => {
			try {
				await this.task();
			} catch ( err ) {
				this.logger.error( err );
			}
		} );
	}

};