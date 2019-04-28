const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { getEntityDataType } = require("./utils/");
const { sequelize } = require("./config/sequelize");

const app = express();
app.use(cors());
app.use(bodyParser.json());

function nullOrNotNullAndPK(columns, item, index) {
  if (item.itemKey == 'mandatory') {
    columns[item.itemName] = {
      type: getEntityDataType(item.dataType),
      allowNull: false
    }
  } else if (item.itemKey == 'optional') {
    columns[item.itemName] = {
      type: getEntityDataType(item.dataType),
      allowNull: true
    }
  }

  // SET PRIMARY KEY 
  if (index == 0) {
    columns[item.itemName] = {
      type: getEntityDataType(item.dataType),
      primaryKey: true,
      allowNull: false,
    }
  }
}

app.post("/tables", (req, res) => {
  const connID = req.body.connID;
  const tables = req.body.tables;

  if (connID == 0) {
    let emptyIndex;
    tables.forEach((table, index) => {
      if (table.multi == 0) {
        emptyIndex = index;
      }
    })
    tables.forEach(table => {
      let columns = {};

      // SET COLUMNS NULL OR NOT NULL
      Object.values(table.entityItems).forEach((item, index) => {
        nullOrNotNullAndPK(columns, item, index);
      })

      // DEFINE TABLES
      table.entityName = sequelize.define(table.entityName, columns, {
        underscored: true,
        timestamps: false
      });
    })

    // DEFINE RELATIONS
    tables.forEach(table => {
      if (table.multi == 1) {
        tables[emptyIndex].entityName.belongsTo(table.entityName, {
          foreignKey: { name: Object.values(tables[emptyIndex].entityItems)[Object.values(tables[emptyIndex].entityItems).length - 1].itemName, allowNull: true }
        });
      }
    })

    // CREATING TABLES
    tables.forEach(table => {
      if (table.multi == 1) {
        table.entityName.sync({ force: true });
      }
      else {
        setTimeout(() => {
          table.entityName.sync({ force: true });
        }, 1000);
      }
    });

    res.sendStatus(200);
  }

  if (connID == 1) {
    let emptyIndex;
    tables.forEach((table, index) => {
      if (table.multi == 0) {
        emptyIndex = index;
      }
    })
    tables.forEach(table => {
      let columns = {};

      // SET COLUMNS NULL OR NOT NULL
      Object.values(table.entityItems).forEach((item, index) => {
        nullOrNotNullAndPK(columns, item, index);
      })

      // DEFINE TABLES
      table.entityName = sequelize.define(table.entityName, columns, {
        underscored: true,
        timestamps: false
      });
    })

    // DEFINE RELATIONS
    tables.forEach(table => {
      if (table.multi == 1) {
        tables[emptyIndex].entityName.belongsTo(table.entityName, {
          foreignKey: { name: Object.values(tables[emptyIndex].entityItems)[Object.values(tables[emptyIndex].entityItems).length - 1].itemName, allowNull: false }
        });
      }
    })

    // CREATING TABLES
    tables.forEach(table => {
      if (table.multi == 1) {
        table.entityName.sync({ force: true });
      }
      else {
        setTimeout(() => {
          table.entityName.sync({ force: true });
        }, 1000);
      }
    });

    res.sendStatus(200);
  }

  if (connID == 14) {

    tables.forEach(table => {
      let columns = {};

      // SET COLUMNS NULL OR NOT NULL
      Object.values(table.entityItems).forEach((item, index) => {

        nullOrNotNullAndPK(columns, item, index);

        // SET FK TO PK ALSO
        if (index == Object.values(table.entityItems).length - 1 && !table.entityType) {
          columns[item.itemName] = {
            type: getEntityDataType(item.dataType),
            primaryKey: true,
            allowNull: false,
          }
        }
      })

      // DEFINE TABLES
      table.entityName = sequelize.define(table.entityName, columns, {
        underscored: true,
        timestamps: false
      });
    });

    // DEFINE RELATIONS
    tables[0].entityName.belongsTo(tables[1].entityName, {
      foreignKey: { name: Object.values(tables[0].entityItems)[Object.values(tables[0].entityItems).length - 1].itemName, allowNull: false }
    });

    // CREATING TABLES
    tables.forEach(table => {
      if (table.entityType) {
        table.entityName.sync({ force: true });
      }
      else {
        setTimeout(() => {
          table.entityName.sync({ force: true });
        }, 1000);
      }
    });

    res.sendStatus(200);
  }
});

app.listen(3000, () => {
  console.log("Started on port ", 3000);
});
