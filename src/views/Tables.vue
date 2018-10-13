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
import { mapGetters } from "vuex";

import $ from "jquery";

export default {
  data() {
    return {
      show: true
    };
  },
  methods: {
    forTable(str) {
      return str.trim().toLowerCase() + "s";
    },
    forRefrence(str) {
      return str.substr(0, str.length - 3).toLowerCase() + "s";
    },
    findObjectSize(obj) {
      let size = 0;
      for (let i in obj) {
        size++;
      }
      return size;
    }
    /* createTable() {
      // multi= there is fk on it
      // if there is 'multi' create first
      this.tables.sort((a, b) => {
        return a.multi - b.multi;
      });

      for (let i in this.tables) {
        if (this.tables[i].multi == true) {
          var data2 = `,${this.tables[i].fk} int, FOREIGN KEY (${
            this.tables[i].fk
          }) REFERENCES ${this.forRefrence(this.tables[i].fk)}(id)`;
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
            } else {
              isNull = "";
            }
            data += `${this.tables[i].entityItems[j].itemName} ${
              this.tables[i].entityItems[j].dataType
            } ${isNull} ${data2}) `;
            data2 = "";
          } else {
            if (j == 0) {
              data += `${
                this.tables[i].entityItems[j].itemName
              } int , PRIMARY KEY (${
                this.tables[i].entityItems[j].itemName
              }), `;
            } else {
              let isNull = "";

              if (this.tables[i].entityItems[j].itemKey == "mandatory") {
                isNull = "NOT NULL";
                console.log(isNull);
              } else {
                isNull = "";
              }

              data += `${this.tables[i].entityItems[j].itemName} ${
                this.tables[i].entityItems[j].dataType
              } ${isNull},`;
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
      alert("DB is ready!!!");
    } */
  },
  computed: {
    ...mapGetters(["tables"])
  },
  components: {
    AppSidebar,
    AppTable
  },
  created() {
    this.$store.dispatch("getTables");

    EventBus.$on("createTable", id => {
      this.$store.dispatch("sendDatabase");
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


