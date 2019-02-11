const Sequelize = require('sequelize')

const sequelize = new Sequelize('senior', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  port: '8889',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },

  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false,
});

module.exports = { sequelize }