import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(vuex)

import entities from './modules/entities'

export default new Vuex.Store({
  modules: {
    entities
  }
})