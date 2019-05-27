const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { getEntityDataType } = require("./utils/");
const { sequelize } = require("./config/sequelize");

const app = express();
app.use(cors());
app.use(bodyParser.json());

function nullOrNotNullAndPK(columns, item, index) {
  if (item.itemKey == "mandatory") {
    columns[item.itemName.replace(' ', '_')] = {
      type: getEntityDataType(item.dataType),
      allowNull: false
    };
  } else if (item.itemKey == "optional") {
    columns[item.itemName.replace(' ', '_')] = {
      type: getEntityDataType(item.dataType),
      allowNull: true
    };
  }

  // SET PRIMARY KEY
  if (index == 0) {
    columns[item.itemName] = {
      type: getEntityDataType(item.dataType),
      primaryKey: true,
      allowNull: false
    };
  }
}

app.post("/tables", (req, res) => {
  const connID = req.body.connID;
  const tables = req.body.tables;

  let notFK = tables.filter(table => table.multi == 0);
  let withFK = tables.filter(table => table.multi != 0);
  let notYay = tables.filter(table => !table.isYay);
  let yay = tables.find(table => table.isYay);
  let yayItems = Object.values(yay.entityItems).filter(item => item.fk == 'fk');

  if (withFK.some(table => table.isYay)) {
    tables.forEach(table => {
      let columns = {};

      // SET COLUMNS NULL OR NOT NULL
      Object.values(table.entityItems).forEach((item, index) => {
        nullOrNotNullAndPK(columns, item, index);
      });

      // DEFINE TABLES
      table.entityName = sequelize.define(table.entityName.toLowerCase(), columns, {
        underscored: true,
        timestamps: false
      });
    })

    // DEFINE RELATIONS


    yayItems.forEach(item => {
      tables.forEach(table => {

        if (table.belongsYay) {
          yay.entityName.belongsTo(table.entityName);
        }

      })
    })


    /* tables.forEach(table => {
      if (table.isYay) {
        Object.values(table.entityItems).forEach(item => {
          if (item.fk == 'fk') {
            notYay.forEach(nTable => {
              if (item.itemName.includes(nTable.entityName)) {
                table.entityName.belongsTo(nTable.entityName, {
                  foreignKey: {
                    name: item.itemName,
                  }
                });
              }
            })
          }
        })
      }
    }) */



    // CREATING TABLES
    tables.forEach(table => {
      if (table.belongsYay) {
        table.entityName.sync({ force: true });
      } else {
        setTimeout(() => {
          table.entityName.sync({ force: true });
        }, 1000)
      }
    })
  } else {
    tables.forEach(table => {
      let columns = {};

      // SET COLUMNS NULL OR NOT NULL
      Object.values(table.entityItems).forEach((item, index) => {
        nullOrNotNullAndPK(columns, item, index);
      });

      // SET SUBENTITY COLUMNS NULL OR NOT NULL
      if (table.subEntities) {
        Object.values(table.subEntities).forEach(subEntity => {
          Object.values(subEntity.entityItems).forEach((item, index) => {
            nullOrNotNullAndPK(columns, item, index + 1);
          });
        })
      }

      // DEFINE TABLES
      table.entityName = sequelize.define(table.entityName.toLowerCase(), columns, {
        underscored: true,
        timestamps: false
      });

      // SET FK TO ITSELF
      Object.values(table.entityItems).forEach(item => {
        if (item.itemName.includes('_type')) {
          table.entityName.belongsTo(table.entityName, {
            foreignKey: {
              name: item.itemName,
            }
          });
        }
      })


    })

    // DEFINE RELATIONS
    notFK.forEach((table, idx) => {
      withFK.forEach(fkTable => {
        let fkNames = Object.values(fkTable.entityItems).filter(item => item.fk == 'fk').reverse();
        fkTable.entityName.belongsTo(table.entityName, {
          foreignKey: {
            name: fkNames[idx].itemName,
            allowNull: fkTable.entityType == 'mandatory' ? false : true
          }
        });
      })
    })

    // CREATING TABLES
    table.forEach(table => {
      if (table.multi == 0) {
        table.entityName.sync({ force: true });
      } else {
        setTimeout(() => {
          table.entityName.sync({ force: true });
        }, 1000)
      }
    })

  }

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Started on port ", 3000);
});