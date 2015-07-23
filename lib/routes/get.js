/**
 * Retrieve a Thing from the database by ID (Item, Mob or Vendor). Requires an
 * active database connection.
 */

/**
 * Retrieve a single object by ID.
 *
 * @param {Object} db   Active MongoDB database connection object
 * @param {String} type Type of object to retrieve: 'item', 'mob' or 'vendor'
 * @param {String} id   ID of object to retrieve
 *
 * @return {Object} Returns promise with results or error if not (including
 * not found)
 */
module.exports = function ( db, type, id ) {
  // Make the request
  return db.collection( type + 's' )
    .findOne({ id: id });
};
