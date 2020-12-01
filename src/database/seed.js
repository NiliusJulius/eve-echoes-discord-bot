const { spawn } = require('child-process-promise');

const spawnOptions = { stdio: 'inherit' };

(async () => {
  if (process.argv[2]) {
    try {
      await spawn('./node_modules/.bin/sequelize', ['db:seed:undo:all', '--config=src/database/config/config.js'], spawnOptions);
      console.log('*************************');
      console.log('Seed undo successful');
    } catch (err) {
      console.log('*************************');
      console.log('Seed undo failed. Error:', err.message);
      process.exit(1);
    }
    process.exit(0);
  } else {
    try {
      await spawn('./node_modules/.bin/sequelize', ['db:seed:all', '--config=src/database/config/config.js'], spawnOptions);
      console.log('*************************');
      console.log('Seed successful');
    } catch (err) {
      console.log('*************************');
      console.log('Seed failed. Error:', err.message);
      process.exit(1);
    }
    process.exit(0);
  }
})();