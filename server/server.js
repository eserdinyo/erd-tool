const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const { getEntityDataType } = require('./utils/');
const { sequelize } = require('./config/sequelize')

const app = express();
app.use(cors())
app.use(bodyParser.json());

app.post('/tables', (req, res) => {
  const tables = req.body;

  tables.sort((a, b) => a.multi - b.multi);

  tables.forEach(table => {

    if (table.multi == 2) {
      table.entityItems = "";
    }

    let columns = {}

    for (let i in table.entityItems) {
      columns[table.entityItems[i].itemName] = { type: getEntityDataType(table.entityItems[i].dataType), allowNull: false };
    }

    table.entityName = sequelize.define(table.entityName, columns, { timestamps: false });

  });

  // Creating M:M realtion table
  for (let i = 0; i < tables.length - 1; i++) {
    //Çift taraf seçimli ise
    if (tables[i].entityType == "mandatory") {
      tables[tables.length - 1].entityName.belongsTo(tables[i].entityName, { foreignKey: { allowNull: false } });
    } else if (tables[i].entityType == "optional") {
      // Çift taraf zorunlu ise 
      tables[tables.length - 1].entityName.belongsTo(tables[i].entityName, { foreignKey: { allowNull: true } });
    }
  }

  tables.forEach(table => {
    table.entityName.sync({ force: true })
  })

  res.sendStatus(200)
});


app.listen(3000, () => {
  console.log('Started on port ', 3000);
});