const { sequelize } = require('../models');

async function waitForDb() {
  const maxAttempts = parseInt(process.env.WAIT_DB_ATTEMPTS || '30', 10);
  const delayMs = parseInt(process.env.WAIT_DB_DELAY_MS || '2000', 10);

  let attempts = 0;
  while (attempts < maxAttempts) {
    try {
      await sequelize.authenticate();
      console.log('Database is available.');
      process.exit(0);
    } catch (err) {
      attempts += 1;
      console.log(`DB not ready, attempt ${attempts}/${maxAttempts} — retrying in ${delayMs}ms`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  console.error('Database did not become ready in time.');
  process.exit(1);
}

waitForDb();
