import { refConn } from "@/firebase";
import connectionTypes from '../connectionTypes';

const state = {
    connections: [],
    connTypes: [],
    leftEndpoint: 0,
    rightEndpoint: 0,
}

const getters = {
    connections: state => state.connections,
    leftEndpoint: state => state.leftEndpoint,
    rightEndpoint: state => state.rightEndpoint,
    connTypes: state => state.connTypes,
}

const mutations = {
    setLeftEndpoint(state, payload) {
        state.leftEndpoint = payload;
    },
    setRightEndpoint(state, payload) {
        state.rightEndpoint = payload;
    },
    initConnections(state) {
        state.connTypes = Object.values(connectionTypes);
    }
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