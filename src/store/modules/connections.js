import { refConn, refConnType } from "@/firebase";
import connectionTypes from '../data/connectionTypes';

const state = {
    connType: "",
    connections: [],
    connTypes: [],
    globalConnType: "",
}

const getters = {
    connections: state => state.connections,
    connTypes: state => state.connTypes,
    connType: state => state.connType,
}

const mutations = {
    initConnectionTypes(state) {
        state.connTypes = Object.values(connectionTypes);
    },
    setConnectionType(state, paylaod) {

        state.globalConnType = paylaod;
        switch (paylaod) {
            case 1:
                state.connType = state.connTypes[0];
                break;
            case 2:
                state.connType = state.connTypes[0];
                break;
            case 3:
                state.connType = state.connTypes[2];
                break;
            case 4:
                state.connType = state.connTypes[2];
                break;
            case 5:
                state.connType = state.connTypes[10];
                break;
            default:
                state.connType = state.connTypes[0];
                break;
        }
    }
}
const actions = {
    initConnections({ state }) {
        return new Promise((resolve, reject) => {
            refConn.on("value", snap => {
                const data = snap.val();

                const connections = [];
                for (let key in data) {
                    const conn = data[key];
                    conn.id = key;
                    connections.push(conn);
                }
                state.connections = connections;
                resolve('OK')
            });
        })
    },

    async getConnType({ state, commit }) {
        await refConnType.on('value', snap => {
            const data = snap.val();
            commit('setConnectionType', data.connType)
        });
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}