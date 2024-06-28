const path = require("path");
require('dotenv').config()

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, "src", "database", "database.db")
    },    
    useNullAsDefault: true,
    pool: {
      afterCreate: (connection, cb) => connection.run("PRAGMA foreign_keys = ON", cb)
    },
    migrations: {
      directory: path.resolve(__dirname, "src", "database", "knex", "migrations")
    },
  },
};

// module.exports = {
//   development: {
//     client: 'pg',
//     connection: process.env.DB_CONNECTION,
//     searchPath: ['knex', 'public'],
//     pool: {
//       min: 2,
//       max: 10,
//       afterCreate: (connection, cb) => connection.run("PRAGMA foreign_keys = ON", cb)
//     },
//     migrations: {
//       directory: path.resolve(__dirname, "src", "database", "knex", "migrations")
//     },
//   },
// };