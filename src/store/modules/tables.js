import { ref } from "@/firebase/";

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
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}