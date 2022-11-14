import Vue from 'vue'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
Element.Dialog.props.closeOnClickModal.default = false
Element.Dialog.props.top.default = '5vh'
// import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import '@/mixins/defaultMixin'

import { $Type } from '@/settings'
Vue.prototype.$Type = $Type

import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts

import { Base64 } from 'js-base64'
Vue.prototype.$Base64 = Base64

// eslint-disable-next-line no-undef
Vue.prototype.$$ = $

// import PlayVideo from '@/components/PlayVideo'
// Vue.component('PlayVideo', PlayVideo)

import TablePage from '@/components/TablePage'
Vue.component('TablePage', TablePage)

// import resize from '@/directive/resize.js' // 元素宽高监听
// Vue.use(resize)

import * as filters from './filters' // global filters

Vue.use(Element, {
  size: localStorage.getItem('size') || 'medium' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
