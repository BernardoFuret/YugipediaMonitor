/**
 * Tasks index.
 * Once the connection to Discord is ready,
 * it will load and start all declared tasks.
 */
module.exports = channel => {
	require( "./Tasks.js" ).forEach( task => {
		require( `./${task}` )( channel );
	} );
};
