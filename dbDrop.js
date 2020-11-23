const db = require('./database/models');

db.sequelize.drop().then(() => {
  console.log('Database tables dropped');
  db.sequelize.close();
}).catch(console.error);