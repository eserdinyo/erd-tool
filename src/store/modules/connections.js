import { refConn } from "@/firebase";

const state = {
  connections: [],
}

const getters = {
  connections: state => state.connections,
}

const mutations = {

}

const actions = {
  initConnections({ state }) {
    refConn.on("value", snap => {
      const data = snap.val();

      const connections = [];
      for (let key in data) {
        const conn = data[key];
        conn.id = key;
        connections.push(conn);
      }
      state.connections = connections;
    });
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}