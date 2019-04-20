import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);



import Main from "../views/Main";
import Tables from "../views/Tables";
import Projects from "../views/Projects";
import Login from "../views/Login";
import Register from "../views/Register";

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Main,
      meta: { requiresAuth: true }
    },
    {
      path: "/tables",
      name: "tables",
      component: Tables,
      meta: { requiresAuth: true }
    },
    {
      path: "/projects",
      name: "projects",
      component: Projects,
      meta: { requiresAuth: true }
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: { requiresGuest: true }
    },
    {
      path: "/register",
      name: "register",
      component: Register,
      meta: { requiresGuest: true }
    }
  ]
});


