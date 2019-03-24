import { ref } from "@/firebase/"
import http from '@/utils/http-tables'

const state = {
  tables: [],
}

const getters = {
  tables: state => state.tables,
}

const mutations = {

}

const actions = {

  getTables({ state }) {
    ref.on("value", snap => {
      const data = snap.val();

      const tables = [];
      for (let key in data) {
        const table = data[key];
        table.id = key;
        tables.push(table);
      }

      state.tables = tables;
    });
  },
  async sendDatabase({ state }) {
    const tables = [];
    state.tables.forEach(table => {

      if (table.entityName.indexOf("[") != -1) {
        table.entityName = table.entityName.slice(0, table.entityName.indexOf("["))
        tables.push(table);
      } else {
        tables.push(table);
      }

    })

    const res = await http.post('/tables', tables);
    if (res.data == "OK") {
      alert("Tablolar veritabanına aktarıldı!")
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}