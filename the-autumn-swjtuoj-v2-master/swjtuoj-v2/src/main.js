import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 导入全局样式表
import './assets/css/global.css'

import axios from 'axios'
import { Message } from 'element-ui'
// 显示头像遮罩层
import VueHoverMask from 'vue-hover-mask'
// 图片裁切
import VueCropper from 'vue-cropper'

// 配置请求的根路径
axios.defaults.baseURL = 'http://oj.shinenet.cn/api/'
// 在request拦截器中展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
  config.headers['X-CSRF-TOKEN'] = window.sessionStorage.getItem('token')
  // config.headers.X-CSRFToken = window.sessionStorage.getItem('token')
  // 最后必须returnconfig
  return config
})

axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, function (error) {
  // 对响应错误做点什么
  // console.log(error.response)
  if (error.response.status === 400) {
    if (error.response.data.message) {
      error.response.data = {
        status: 400,
        msg: error.response.data.message + '（建议刷新页面）'
      }
    } else if (error.response.data.msg) {
      error.response.data = {
        status: 400,
        msg: error.response.data.msg
      }
    }
  } else if (error.response.status === 401) {
    window.sessionStorage.clear()
    Message.error('请登录！')
    window.location.href = '/'
  }
  return error.response
})

Vue.prototype.$http = axios

// axios.defaults.withCredentials = true

Vue.config.productionTip = false

// 格式化时间过滤器
Vue.filter('dateFormate', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDay() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}年${m}月${d}日 ${hh}:${mm}:${ss}`
})

Vue.component(VueHoverMask.name, VueHoverMask)
Vue.use(VueCropper)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
