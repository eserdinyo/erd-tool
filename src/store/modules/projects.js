import { refProjects } from "@/firebase";

const state = {
    projects: [],
    userID: "",
    projectID: localStorage.getItem("projectID") || null,
}

const getters = {
    projects: state => state.projects.filter(project => project.userID == state.userID),
    projectID: state => state.projectID,
}

const mutations = {
    setProjects(state, payload) {
        state.projects = payload;
    },
    setUserID(state, payload) {
        state.userID = payload;
    },
    setProjectID(state, payload) {
        state.projectID = payload;
    }
}

const actions = {
    async getProjects({ commit }) {
        await refProjects.on('value', snap => {
            const data = snap.val();
            const projects = [];

            for (let key in data) {
                const project = data[key];
                project.id = key;
                projects.push(project);
            }
            commit('setProjects', projects)
        });
    },
}
export default {
    state,
    getters,
    mutations,
    actions
}