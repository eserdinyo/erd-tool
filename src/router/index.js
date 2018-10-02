import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Main from '../views/Main'
import Tables from '../views/Tables'
export default new Router({
    mode: 'history',
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
    ]
})


