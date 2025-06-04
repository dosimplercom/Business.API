var dbConfig = {
  synchronize: false,
  migrations: ['migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
};

switch (process.env.NODE_ENV) {
  case 'development':
     Object.assign(dbConfig, {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['dist/**/*.entity.js'], // compiled JS files in production
      ssl: {
        rejectUnauthorized: false, // required by Azure Postgres
        ca: process.env.PG_CA ? Buffer.from(process.env.PG_CA, 'base64').toString('ascii') : undefined
      },
      migrationsRun: true,
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['**/*.entity.ts'],
      migrationsRun: true,
    });
    break;
  case 'production':
    Object.assign(dbConfig, {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['dist/**/*.entity.js'], // compiled JS files in production
      ssl: {
        rejectUnauthorized: false, // required by Azure Postgres
        ca: process.env.PG_CA ? Buffer.from(process.env.PG_CA, 'base64').toString('ascii') : undefined
      },
      migrationsRun: true,
    });
    break;

  default:
    throw new Error('unknown environment');
}

module.exports = dbConfig;
