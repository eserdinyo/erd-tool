import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import entities from './modules/entities'
import connections from './modules/connections'

export default new Vuex.Store({
  modules: {
    entities,
    connections
  }
})