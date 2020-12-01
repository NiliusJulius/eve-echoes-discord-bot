const { spawn } = require('child-process-promise');

const spawnOptions = { stdio: 'inherit' };

(async () => {
  if (process.argv[2]) {
    try {
      await spawn('./node_modules/.bin/sequelize', ['db:migrate:undo:all', '--config=src/database/config/config.js'], spawnOptions);
      console.log('*************************');
      console.log('Migration undo successful');
    } catch (err) {
      console.log('*************************');
      console.log('Migration undo failed. Error:', err.message);
      process.exit(1);
    }
    process.exit(0);
  } else {
    try {
      await spawn('./node_modules/.bin/sequelize', ['db:migrate', '--config=src/database/config/config.js'], spawnOptions);
      console.log('*************************');
      console.log('Migration successful');
    } catch (err) {
      console.log('*************************');
      console.log('Migration failed. Error:', err.message);
      process.exit(1);
    }
    process.exit(0);
  }
})();