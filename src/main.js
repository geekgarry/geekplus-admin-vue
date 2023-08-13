import Vue from 'vue'

import Cookies from 'js-cookie'
import {_getCookie, _setCookie, _removeCookie} from '@/utils/storage'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
// import element_locale from 'element-ui/lib/locale'

import '@/assets/styles/index.scss' // global css
import './assets/styles/element-variables.scss'
import '@/assets/styles/geekplusadmin.scss' // ruoyi css
import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import Pagination from "@/components/Pagination";
//自定义表格工具扩展
import RightToolbar from "@/components/RightToolbar"

import i18n from './lang' // Internationalization
// import VueI18n from 'vue-i18n'
// import 'default-passive-events'
import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts;

//引入一些通用工具js类
import { parseTime, dateFormat, resetForm, addDateRange, selectDictLabel, selectDictLabels, download, handleTree, firstUpperCase } from "@/utils/gputil";

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// Vue.use(VueI18n)
// const i18n = new VueI18n({
//     locale: 'zh-CN',    // 语言标识
//     //this.$i18n.locale // 通过切换locale的值来实现语言切换
//     messages: {
//       'zh-CN': require('./lang/zh'),   // 中文语言包
//       'en-US': require('./lang/en')    // 英文语言包
//     }
// })
import Print from 'vue-print-nb'
Vue.use(Print);  //注册
// 引入 Froala Editor js file.
require('froala-editor/js/froala_editor.pkgd.min')
//引入中文语言包
require('froala-editor/js/languages/zh_cn')
//引入 Froala Editor css files.
require('froala-editor/css/froala_editor.pkgd.min.css')
// require('font-awesome/css/font-awesome.css')//此处可在index.html中引入：font-awesome cdn地址：<link href="https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
require('froala-editor/css/froala_style.min.css')
// Import and use Vue Froala lib.
import VueFroala from 'vue-froala-wysiwyg'
Vue.use(VueFroala)

// set ElementUI lang to EN
Vue.use(ElementUI, { 
    size: Cookies.get('size') || 'medium', // set element-ui default size
    locale,
    i18n: (key, value) => i18n.t(key, value)
  })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
import websocket from './utils/wesocket'

Vue.config.productionTip = false
// Vue.prototype.$echarts = echarts

Vue.prototype.parseTime = parseTime
Vue.prototype.dateFormat = dateFormat
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.websocket=websocket
Vue.prototype.getCookie=_getCookie
Vue.prototype.setCookie=_setCookie
Vue.prototype.removeCookie=_removeCookie
Vue.prototype.Base64=require("js-base64").Base64//引入加密方式
Vue.prototype.firstUpperCase=firstUpperCase

Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
}

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
}

// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
new Vue({
  el: '#app',
  router,
  store,
  i18n,// 不要忘记
  render: h => h(App)
})
