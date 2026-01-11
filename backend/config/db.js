const { Sequelize } = require('sequelize');

function buildDatabaseUrlFromParts() {
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || '5432';
  const database = process.env.DB_NAME;

  if (!user || !password || !database) return null;

  // Use encodeURIComponent so special characters in creds don't break the URL.
  return `postgres://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
}

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.DB_URL ||
  buildDatabaseUrlFromParts();

if (!databaseUrl) {
  throw new Error(
    'Missing database configuration. Set DATABASE_URL (recommended) or DB_USER/DB_PASSWORD/DB_HOST/DB_PORT/DB_NAME.',
  );
}

const useSsl =
  process.env.DB_SSL === 'true' ||
  process.env.DATABASE_SSL === 'true' ||
  process.env.PGSSLMODE === 'require';

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  ...(useSsl
    ? {
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }
    : {}),
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database');
  } catch (err) {
    console.error('Failed to connect to the database', err.message || err);
    process.exit(1);
  }
};

module.exports = { sequelize, connectToDatabase };
