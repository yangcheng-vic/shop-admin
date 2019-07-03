import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/login.vue'
import Home from './views/home.vue'
import User from './views/user.vue'
import Roles from './views/roles.vue'
import Rights from './views/rights.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: 'user',
          component: User
        },
        {
          path: 'roles',
          component: Roles
        },
        {
          path: 'rights',
          component: Rights
        }
      ]
    }
  ]
})
