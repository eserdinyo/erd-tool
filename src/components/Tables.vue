<template lang="pug">
    .cover
        .main
            .container
              .col-md-6(v-for='table in tables')
                .tablo
                    table#myTable
                        thead
                          th(colspan='4')
                              p#tableName {{makeUpper(table.entityName)}}
                        tbody
                          tr.tablo__header
                            td Anahtar Tipi
                            td Veri Tipi
                            td Sütun İsmi
                          template(v-for="(item,key,index) in table.entityItems")
                            tr(v-if="key == 0")
                              td.field
                                  p PK
                              td.field
                                p INT
                              td.field
                                p {{deleteSpace(item.itemName)}}
                            tr(v-else)
                              td.field
                                select#element()
                                  option(value='', selected) None
                                  option(title="Unique", value='unique') UK
                              td.field
                                select#element(v-model="item.dataType",@change="changeDataType(key,table,$event.target.value)")
                                  option(disabled, value='') Veri Tipi
                                  option(title="INT", value='int') INT
                                  option(title="VARCHAR", value='varchar(255)') VARCHAR
                                  option(title="TEXT", value='TEXT') TEXT
                                  option(title="DATE", value='DATETIME') DATE
                              td.field
                                p {{deleteSpace(item.itemName)}}
                            tr(v-if="index == objSize(table.entityItems) && table.multi")
                              td.field
                                p FK
                              td.field
                                p INT
                              td.field
                                p {{foreignKey(table.fk)}}
                            
                           
                          
        sidebar

</template>

<script>
import Sidebar from "./Siderbar";
import { EventBus } from "../main";
import { ref, refConn } from "../firebase/";
import axios from "axios";
import $ from "jquery";

export default {
  data() {
    return {
      tables: [],
      show: true
    };
  },
  methods: {
    changeDataType(key, table, value) {
      console.log("..");

      ref
        .child(table.id)
        .child("entityItems")
        .child(key)
        .update({ dataType: value });
    },
    getTables() {
      ref.on("value", snap => {
        const data = snap.val();

        const tables = [];
        for (let key in data) {
          const table = data[key];
          table.id = key;
          tables.push(table);
        }

        this.tables = tables;
      });
    },
    makeUpper(str) {
      if (str) return str.toUpperCase() + "S";
    },
    deleteSpace(str) {
      if (str)
        return str
          .trim()
          .toLowerCase()
          .replace(" ", "_");
    },
    foreignKey(str) {
      if (str)
        return (
          str
            .trim()
            .toLowerCase()
            .replace(" ", "_") + "_id"
        );
    },
    forTable(str) {
      if (str) return str.trim().toLowerCase() + "s";
    },
    createTable() {
      this.tables.sort((a, b) => {
        return a.multi - b.multi;
      }); 

      for (let i in this.tables) {
        if (this.tables[i].multi == true) {
          var data2 = `, ${this.foreignKey(
            this.tables[i].fk
          )} int, FOREIGN KEY (${this.foreignKey(
            this.tables[i].fk
          )}) REFERENCES ${this.forTable(this.tables[i].fk)} (${this.foreignKey(
            this.tables[i].fk
          )})`;
        } else {
          data2 = "";
        }
        var data = `CREATE TABLE ${this.forTable(this.tables[i].entityName)} (`;

        let counter = 1;
        for (let j in this.tables[i].entityItems) {
          if (counter == this.findObjectSize(this.tables[i].entityItems)) {
            let isNull = "";

            if (this.tables[i].entityItems[j].itemKey == "mandatory") {
              isNull = "NOT NULL";
              console.log(isNull);
            } else {
              isNull = "";
            }
            data += `${this.deleteSpace(
              this.tables[i].entityItems[j].itemName
            )} ${this.tables[i].entityItems[j].dataType} ${isNull} ${data2}) `;
            data2 = "";
          } else {
            if (j == 0) {
              data += `${this.deleteSpace(
                this.tables[i].entityItems[j].itemName
              )} int , PRIMARY KEY (${this.deleteSpace(
                this.tables[i].entityItems[j].itemName
              )}), `;
            } else {
              let isNull = "";

              if (this.tables[i].entityItems[j].itemKey == "mandatory") {
                isNull = "NOT NULL";
                console.log(isNull);
              } else {
                isNull = "";
              }

              data += `${this.deleteSpace(
                this.tables[i].entityItems[j].itemName
              )} ${this.tables[i].entityItems[j].dataType} ${isNull},`;
            }
          }
          counter++;
        }

        $.post(
          "http://localhost/main.php",
          {
            data: data
          },
          function(result) {}
        );
        console.log(data);
      }

      alert("Veri tabanına aktarıldı")
    },
    findObjectSize(obj) {
      let size = 0;
      for (let i in obj) {
        size++;
      }
      return size;
    },
    objSize(obj) {
      let size = 0;
      for (let i in obj) {
        size++;
      }
      return size - 1;
    }
  },
  computed: {},
  components: {
    Sidebar
  },
  created() {
    this.getTables();

    EventBus.$on("emitTable", table => {
      this.createTable();
    });
  },
  mounted() {
    EventBus.$emit("hideBtn", 1);
  }
};
</script>

<style lang="scss" scoped>
.cover {
  display: flex;
}
.main {
  background-image: url(http://freedevelopertutorials.azurewebsites.net/wp-content/uploads/2015/06/grid.png);
  background-repeat: repeat;
  border: 1px solid rgba(#000, 0.2);
  text-align: center;
  flex-grow: 15;
  height: 100vh;
}

// Tablo
.tablo {
  width: 400px;
  margin-top: 30px;
  select {
    background: transparent;
    padding: 3px 10px;
    border: 1px solid (#191919, 0.3);
    color: #191919;
  }

  &__header {
    font-size: 13px;
    background-color: #f2f2f2;
  }
}
#tableName {
  font-weight: 700;
  padding-top: 3px;
  padding-bottom: 3px;
}
table {
  width: 100%;
  margin-bottom: 3px;
  padding-bottom: 3px;
  border: 2px solid rgba(#191919, 0.7);
  border-radius: 3px;
  background-color: rgba(#fff, 1);
  z-index: 99;
}
th {
  border-bottom: 1px solid rgba(#191919, 0.5);
  padding: 0;
}
td {
  padding: 5px 10px;
  text-align: center;
}
input[type="text"] {
  width: 100%;
  padding: 5px 5px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  background: transparent;
  color: #000;
  border-radius: 4px;
  box-sizing: border-box;
  text-align: center;
  &::-webkit-input-placeholder {
    color: rgb(121, 121, 121);
  }
}
.field input {
  margin: 0;
}
</style>


