module.exports = {
  development: {
    client: 'mysql2',

    connection: {
      host: 'sonara-db.mysql.database.azure.com',
      user: 'sonara_adm',
      password: 'Senai@127',
      database: 'sonara_db',
      port: 3306,
      charset: 'utf8mb4',

      ssl: {
        rejectUnauthorized: false
      }
    },

    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations'
    },

    seeds: {
      directory: './db/seeds'
    }
  },
};