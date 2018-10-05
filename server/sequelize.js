const Sequelize = require('sequelize')

const sequelize = new Sequelize('senior', 'root', '12345678', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false,
});

module.exports = { sequelize };
