const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { getEntityDataType } = require("./utils/");
const { sequelize } = require("./config/sequelize");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/tables", (req, res) => {
  const tables = req.body;
  tables.sort((a, b) => a.multi - b.multi);

  // ********** //
  //Create Tables
  tables.forEach(table => {
    let columns = {};

    for (let i in table.entityItems) {
      /* if (table.multi == 2) {
        // Set PK
        columns[table.entityItems[0].itemName] = {
          type: getEntityDataType(table.entityItems[0].dataType),
          primaryKey: true,
          allowNull: false
        };
        // Set PK
        columns[table.entityItems[1].itemName] = {
          type: getEntityDataType(table.entityItems[1].dataType),
          primaryKey: true,
          allowNull: false
        };
      } */

      columns[table.entityItems[i].itemName] = {
        type: getEntityDataType(table.entityItems[i].dataType),
        allowNull: false
      };

      // Set PK
      columns[table.entityItems[0].itemName] = {
        type: getEntityDataType(table.entityItems[0].dataType),
        primaryKey: true,
        allowNull: false
      };
    }

    table.entityName = sequelize.define(table.entityName, columns, {
      underscored: true,
      timestamps: false
    });
  });

  // Creating M:M realtion table
  for (let i = 0; i < tables.length - 1; i++) {
    // Zorunlu taraf
    if (tables[i].entityType == "mandatory") {
      tables[tables.length - 1].entityName.belongsTo(tables[i].entityName, {
        foreignKey: { allowNull: false }
      });
    } else if (tables[i].entityType == "optional") {
      // Seçimli taraf
      tables[tables.length - 1].entityName.belongsTo(tables[i].entityName, {
        foreignKey: { allowNull: true }
      });
    }
  }

  tables.forEach(table => {
    if (table.entityType) {
      table.entityName.sync({ force: true });
    } else {
      setTimeout(() => {
        tables[2].entityName.sync({ force: true });
      }, 1000);
    }
  });

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Started on port ", 3000);
});
