module.exports = channel => ( {
	tasks: [
//		require( "./DemoTask" )( channel ),
		require( "./AdsTxtUpdate" )( channel ),
		require( "./TCGplayerBearerTokenUpdate" )( channel ),
	],

	start() {
		this.tasks.forEach( task => task.start() );
	},
} );