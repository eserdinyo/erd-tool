const Sequelize = require('sequelize')

function getEntityDataType(type) {
  if (type == 'CHAR')
    return Sequelize.CHAR
  else if (type == 'INTEGER')
    return Sequelize.INTEGER
  else if (type == 'TEXT')
    return Sequelize.TEXT
}

module.exports = { getEntityDataType }