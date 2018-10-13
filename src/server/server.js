const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const { sequelize } = require('./config/sequelize')
const Sequelize = require('sequelize')


const { Product } = require('./models/product');

const app = express();
app.use(cors())
app.use(bodyParser.json());

app.post('/tables', (req, res) => {
  const tables = req.body;

  function getEntityDataType(type) {
    if (type == 'CHAR')
      return Sequelize.CHAR
    else if (type == 'INTEGER')
      return Sequelize.INTEGER
    else if (type == 'TEXT')
      return Sequelize.TEXT
  }


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

  /* const Player = sequelize.define('player', { name: Sequelize.STRING }, { timestamps: false });
  const Team = sequelize.define('team', { name: Sequelize.STRING }, { timestamps: false });

  Player.belongsTo(Team);

  Team.sync({ force: true });
  Player.sync({ force: true }); */
});

app.get('/products', (req, res) => {
  Product.findAll().then(products => {
    res.send(products)
  })
})


app.listen(3000, () => {
  console.log('Started on port ', 3000);
});