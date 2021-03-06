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
  const tables = req.body.tables;

  let notFK = tables.filter(table => table.multi == 0);
  let withFK = tables.filter(table => table.multi != 0);

  let notYay = tables.filter(table => !table.isYay);
  let yay = tables.find(table => table.isYay);
  let yayItems;
  if (yay) {
    yayItems = Object.values(yay.entityItems).filter(item => item.fk == 'fk');
  }

  // JUST FOR YAY
  if (tables.some(table => table.isYay)) {
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
    tables.forEach(fkTable => {
      notFK.forEach(table => {
        if ((fkTable.ID == table.belongsTo) && !fkTable.isYay) {
          Object.values(fkTable.entityItems).forEach(item => {
            if (item.belongsTo == table.ID) {
              fkTable.entityName.belongsTo(table.entityName, {
                foreignKey: {
                  name: item.itemName,
                }
              });
            }
          })
        }
      })
    })

    // DEFINE RELATIONS FOR YAY
    yayItems.forEach(item => {
      tables.forEach(table => {
        if (item.belongsTo == table.ID) {
          yay.entityName.belongsTo(table.entityName, {
            foreignKey: {
              name: item.itemName,
              allowNull: table.entityType == 'mandatory' ? false : true
            }
          })
        }
      })
    })

    // CREATING TABLES
    tables.forEach(table => {
      if (table.multi == 0) {
        table.entityName.sync({ force: true });
      } else if (table.multi != 0 && !table.isYay) {
        setTimeout(() => {
          table.entityName.sync({ force: true });
        }, 500)
      } else {
        setTimeout(() => {
          table.entityName.sync({ force: true });
        }, 1000)
      }
    })
  }
  else {

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
    tables.forEach(tableOne => {
      console.log(tableOne);
      if (tableOne.belongsTo) {
        tables.forEach(tableTwo => {
          if (Object.values(tableOne.belongsTo).includes(tableTwo.ID)) {

            Object.values(tableTwo.entityItems).forEach(item => {
              if (item.belongsTo == tableOne.ID) {
                tableTwo.entityName.belongsTo(tableOne.entityName, {
                  foreignKey: {
                    name: item.itemName,
                    allowNull: item.itemKey == 'mandatory' ? false : true
                  }
                });

              }
            })
          }
        })
      }
    })

    // CREATE TABLES 
    tables.forEach(table => {
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