module.exports = channel => ( {
	tasks: [
		"DemoTask"
//		"AdsTxtUpdate",
//		"TCGplayerBearerTokenUpdate",
	],

	start() {
		this.tasks.forEach( task => require( `./${task}` )( channel ).start() );
	},
} );
