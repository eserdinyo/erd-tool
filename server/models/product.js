const Sequelize = require('sequelize')
const { sequelize } = require('../config/sequelize');

const Product = sequelize.define("product", {
  name: Sequelize.STRING,
  price: Sequelize.FLOAT,
  image: Sequelize.STRING
  /*  uuid: { type: Sequelize.STRING, primaryKey: true }, */
});

module.exports = { Product };