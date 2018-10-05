import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import entities from './modules/entities'
import connections from './modules/connections'
import tables from './modules/tables'

export default new Vuex.Store({
  modules: {
    entities,
    connections,
    tables
  }
})