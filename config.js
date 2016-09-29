var config = {};

config.db = {};
// for heroku: 'https://darthvoter.herokuapp.com/' 
config.webhost = 'https://darthvoter-evilloria.c9users.io/';

// your MongoDB host and database name
config.db.host = 'localhost';
config.db.name = 'darthvoter';

module.exports = config;