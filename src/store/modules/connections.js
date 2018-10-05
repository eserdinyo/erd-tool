import { refConn } from "@/firebase";
import connectionTypes from '../data/connectionTypes';

const state = {
    connType: "",
    connections: [],
    connTypes: [],
    leftEndpoint: 1,
    rightEndpoint: 1,
}

const getters = {
    connections: state => state.connections,
    leftEndpoint: state => state.leftEndpoint,
    rightEndpoint: state => state.rightEndpoint,
    connTypes: state => state.connTypes,
    connType: state => state.connType,
}

const mutations = {
    setLeftEndpoint(state, payload) {
        state.leftEndpoint = payload;
    },
    setRightEndpoint(state, payload) {
        state.rightEndpoint = payload;
    },
    initConnectionTypes(state) {
        state.connTypes = Object.values(connectionTypes);
    },
    setConnectionType(state) {
        let l = state.leftEndpoint;
        let r = state.rightEndpoint;


        if (l == 1 && r == 1) {
            state.connType = state.connTypes[0];
        } else if (l == 1 && r == 2) {
            state.connType = state.connTypes[1];
        } else if (l == 1 && r == 3) {
            state.connType = state.connTypes[2];
        } else if (l == 1 && r == 4) {
            state.connType = state.connTypes[3];
        } else if (l == 2 && r == 1) {
            state.connType == state.connTypes[4];
        } else if (l == 2 && r == 2) {
            state.connType = state.connTypes[5];
        } else if (l == 2 && r == 3) {
            state.connType = state.connTypes[6];
        } else if (l == 2 && r == 4) {
            state.connType = state.connTypes[7];
        } else if (l == 3 && r == 1) {
            state.connType = state.connTypes[8];
        } else if (l == 3 && r == 2) {
            state.connType = state.connTypes[9];
        } else if (l == 3 && r == 3) {
            state.connType = state.connTypes[10];
        } else if (l == 3 && r == 4) {
            state.connType = state.connTypes[11];
        } else if (l == 4 && r == 1) {
            state.connType = state.connTypes[12];
        } else if (l == 4 && r == 2) {
            state.connType = state.connTypes[13];
        } else if (l == 4 && r == 3) {
            state.connType = state.connTypes[14];
        } else if (l == 4 && r == 4) {
            state.connType = this.con15;
        }
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