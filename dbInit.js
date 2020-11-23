const db = require('./database/models');

const force = process.argv.includes('--force') || process.argv.includes('-f');

db.sequelize.sync({ force }).then(async () => {
  console.log('Database synced');

  // const serverLines = [
  //   db.Server.upsert({ serverId: 1, name: 'Cool' }),
  //   db.Server.upsert({ serverId: 2, name: 'awesome' }),
  // ];
  // await Promise.all(serverLines);

  // const serverSettingLines = [
  //   db.ServerSetting.upsert({ serverSettingId: 1, name: 'prefix', serverId: 1 }),
  //   db.ServerSetting.upsert({ serverSettingId: 2, name: 'leader', serverId: 1 }),
  // ];
  // await Promise.all(serverSettingLines);

  db.sequelize.close();
}).catch(console.error);