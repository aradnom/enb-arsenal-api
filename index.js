// Pull in the app config
var config = require( './lib/config' );

// Set up app-wide logger
var logger = require( './lib/logger' );

// Attempt to create database connection - if we can't connect don't bother
// doing anything else
var dbConnect = require( './lib/db' );
var db;

// Build the Express app
var Express     = require( 'express' );
var Compression = require( 'compression' );
var app         = Express();

// Set the app up
app.use( Compression() );

// Pull in route controllers
var apiGet    = require( './lib/routes/get' );
var apiSearch = require( './lib/routes/search' );

// First attempt database connection
dbConnect
  .then( function ( _db ) {
    db = _db;

    ///////////////////////////////////////////////////////////////////////////////
    // Routes /////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////

    // Get object (Item, Vendor or Mob)
    app.get( '/get/:type/:id', function( req, res ) {
      apiGet( db, req.params.type, req.params.id )
        .then( function ( result ) {
          return res.jsonp({ success: true, result: result });
        })
        .catch( function ( err ) {
          logger.error( 'Error fetching database object: ', err );

          return res.jsonp({ error: 'Error fetching object', errorCode: 'databaseError' });
        });
    });

    // Other API routes
    //app.get( '/api/dosomething', api.DoSomething );

    // FOUR OH FOUR
    app.get( '*', function( req, res ) {
      return res.status( 404 ).jsonp({ error: 'Nothin\' there, chief.', errorCode: 'pageNotFound' });
    });

    ///////////////////////////////////////////////////////////////////////////////
    // Away we go /////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////

    // Then if that went well, start the app
    app.listen( config.port, function () {
      logger.info( 'API server active.', { port: config.port } );
    });
  })
  .catch( function ( err ) {
    logger.error( 'Unable to establish database connection.', err );
  });

///////////////////////////////////////////////////////////////////////////////
// Exit ///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// Prevents node from existing instantly by starting to read stdInput
process.stdin.resume();

// Interrupt signal (Ctrl+C)
process.on( 'SIGINT', cleanup );

///////////////////////////////////////////////////////////////////////////////
// Internal functions /////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function cleanup () {
  // Close the database connection
  if ( db && typeof( db.close ) === 'function' ) {
    db.close();
  }

  logger.info( 'Exiting...' );

  process.exit();
}
