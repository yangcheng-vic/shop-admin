import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/login.css'

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
