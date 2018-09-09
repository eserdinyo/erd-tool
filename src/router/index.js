import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Main from '../components/Main'
import Tables from '../components/Tables'
export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Main,
        },
        {
            path: '/tables',
            name: 'tables',
            component: Tables,
        }
    ],
    mode: 'history',
})


