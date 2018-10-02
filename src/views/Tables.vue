<template lang="pug">
    .cover
        .main
          app-table(v-for="table in tables",
            :table="table"
            :key="table.id")
        app-sidebar

</template>

<script>
import AppSidebar from "@/components/global/Sidebar";
import AppTable from "@/components/Table";

import { EventBus } from "@/main";
import { ref, refConn } from "@/firebase/";

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
      }

      alert("Veri tabanına aktarıldı");
    }
  },
  computed: {},
  components: {
    AppSidebar,
    AppTable
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
  border: 1px solid rgba(#000, 0.2);
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
}
</style>


