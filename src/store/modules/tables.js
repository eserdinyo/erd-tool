import { ref } from "@/firebase/";
import getConnType from "@/utils/getConnType";
import http from "@/utils/http-tables";

const state = {
  tables: []
};

const getters = {
  tables: state => state.tables
};

const mutations = {};

const actions = {
  getTables({ state, rootState }) {
    ref.on("value", snap => {
      const data = snap.val();

      const tables = [];
      for (let key in data) {
        const table = data[key];
        if (table.projectID == rootState.projects.projectID) {
          table.id = key;
          tables.push(table);
        }
      }

      state.tables = tables;
    });
  },
  async sendDatabase({ state, rootState }) {
    const tables = [];
    let connID = rootState.connections.connections[0].connType;
    const connections = rootState.connections.connections;

    state.tables.forEach(table => {
      if (table.entityName.indexOf("(") != -1) {
        table.entityName = table.entityName.slice(
          0,
          table.entityName.indexOf("(")
        );
        tables.push(table);
      } else {
        tables.push(table);
      }
    });

    if (connections.length > 1) {
      connID = getConnType(connections);
    }

    const res = await http.post("/tables", {
      tables,
      // connID
    });
    if (res.data == "OK") {
      alert("Tablolar veritabanına aktarıldı!");
    }
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
