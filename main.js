import App from './App'
import https from '@/utils/request.js'
import './utils/interceptor.js'


// 挂载全局自定义方法
Vue.prototype.$https = https;
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'

Vue.config.productionTip = false
App.mpType = 'app'
//全局路由守卫
uni.$on('beforeRouterEnter',(to,from,next)=>{
	next()
})


const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
