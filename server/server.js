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

  console.log(JSON.stringify(tables, undefined, 2));

  tables.forEach(table => {

    const columns = {}

    for (let i in table.entityItems) {
      columns[table.entityItems[i].itemName] = getEntityDataType(table.entityItems[i].dataType);
    }

    table.entityName = sequelize.define(table.entityName, columns, { timestamps: false });

  });

  tables[1].entityName.belongsTo(tables[0].entityName);


  tables.forEach(table => {
    table.entityName.sync({ force: true })
  })

  res.sendStatus(200)
});


app.listen(3000, () => {
  console.log('Started on port ', 3000);
});