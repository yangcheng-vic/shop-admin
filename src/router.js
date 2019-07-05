import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/login.vue'

const Home = () => import('./views/home.vue')
const User = () => import('./views/user.vue')
const Roles = () => import('./views/roles.vue')
const Rights = () => import('./views/rights.vue')
const Goods = () => import('./views/goods.vue')
const GoodsAdd = () => import('./views/goods-add.vue')
const Categories = () => import('./views/categories.vue')

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
          path: '/users',
          component: User
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/goods-add',
          component: GoodsAdd
        }
        ,
        {
          path: '/categories',
          component: Categories
        }
      ]
    }
  ]
})
