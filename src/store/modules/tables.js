import httpTable from '../../utils/axios-config'

const state = {

}

const getters = {

}

const mutations = {

}

const actions = {
  async sendTables() {
    try {
      let res = httpTable.post('/tables', "fuck me")
      console.log(res);

    } catch (e) {
      console.log(e.response) // undefined
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}