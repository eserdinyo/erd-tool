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

    const res = await http.post('/tables', state.tables);
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