import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/login.css'
import axios from "axios"
// 把axios添加到vue原型上
Vue.prototype.$http = axios

axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

axios.interceptors.request.use(function (config) {
    // console.log(config)
    config.headers.Authorization = localStorage.getItem("token")
    return config;
  });

Vue.use(ElementUI)

Vue.config.productionTip = false


// 注册导航守卫
router.beforeEach((to, from , next) => {
  if (to.path === '/login' || to.path === '/') {
    next()
    return
  }

  if(localStorage.getItem("token")) {
    next()
  }else{
    router.push("/login")
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
