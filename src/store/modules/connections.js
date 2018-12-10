import { refConn, refConnType, refDashType, refGlobalConnType } from "@/firebase";
import connectionTypes from '../data/connectionTypes';


const state = {
    connType: "",
    connections: [],
    connTypes: [],
    globalConnType: "",
    dashType: "",
}

const getters = {
    connections: state => state.connections,
    connTypes: state => state.connTypes,
    connType: state => state.connType,
    dashType: state => state.dashType,
    globalConnType : state => state.globalConnType,
}

const mutations = {
    initConnectionTypes(state) {
        state.connTypes = Object.values(connectionTypes);
    },
    setConnectionType(state, payload) {
        state.globalConnType = payload;
        state.connType = state.connTypes[payload];
    },
    setDashType(state, payload) {
        state.dashType = payload;
    },
    setGlobalConnType(state, payload) {
        state.globalConnType = payload;
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

    async getConnType({ commit }) {
        await refConnType.on('value', snap => {
            const data = snap.val();
            commit('setConnectionType', data.connType)
        });
    },

    async getDashType({ commit }) {
        await refDashType.on('value', snap => {
            const data = snap.val();
            commit('setDashType', data.dashType)
        });
    },
    async getGlobalConnType({commit}) {
        await refGlobalConnType.on('value', snap => {
            const data = snap.val();
            console.log(data.globalConnType);
            
            commit('setGlobalConnType', data.globalConnType);
        })
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}