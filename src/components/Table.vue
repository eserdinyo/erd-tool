<template lang="pug">
  .tablo
    table#myTable
        thead
          th(colspan='4')
              p#tableName {{setTableName(table.entityName)}}
        tbody
          tr.tablo__header
            td Anahtar Tipi
            td Zor/Sec
            td Veri Tipi
            td Sütun İsmi
          template(v-for="(item,key,index) in table.entityItems")
            tr
              td(v-if="(table.multi == 2 && !item.isShow && item.fk == 'fk1')") FK1
              td(v-else-if="(table.multi == 2 && !item.isShow && item.fk == 'fk2')") FK2
              td(v-else-if="item.itemKey== 'unique'") PK
              td.field(v-else)
                select#element()
                  option(value='', selected) None
                  option(title="Unique", value='unique') UK
              td.field
                p(v-if="item.itemKey == 'unique'") #
                p(v-else-if="item.itemKey == 'mandatory'") *
                p(v-else-if="item.itemKey == 'optional'") o
                p(v-else) 
              td.field
                select#element(v-model="item.dataType",
                              @change="changeDataType(key,table,$event.target.value)")
                  option(disabled, value='') Veri Tipi
                  option(title="INT", value='INTEGER') INT
                  option(title="CHAR", value='CHAR') VARCHAR
                  option(title="TEXT", value='TEXT') TEXT
                  option(title="DATE", value='DATETIME') DATE
              td.field
                p {{item.itemName.replace(" ", "_")}}
</template>

<script>
import { ref } from "@/firebase/";

export default {
  name: "Table",
  props: ["table"],

  methods: {
    changeDataType(key, table, value) {
      ref
        .child(table.id)
        .child("entityItems")
        .child(key)
        .update({ dataType: value.toUpperCase() });
    },
    deleteSpace(str) {
      return str.rep;
    },
    setTableName(name) {
      if (name.indexOf("/") != -1) {
        return name.slice(0, name.indexOf("/")).toUpperCase();
      } else if (name.indexOf("/") == -1) {
        return name.toUpperCase();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
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
  background: #1abc9c;
  color: #fff;
}
table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 3px;
  padding-bottom: 3px;
  border: 2px solid rgba(#191919, 0.7);
  border-radius: 3px;
  background-color: rgba(#fff, 1);
  z-index: 99;
}

table,
th,
td {
  border: 2px solid #333;
}

tr:nth-child(even) {
  background: #e9e9e9;
}

th {
  border-bottom: 2px solid rgba(#191919, 0.5);
  padding: 0;
}
td {
  padding: 5px 10px;
  text-align: center;
  border-radius: 3px;
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


