import axios from 'axios'
import { Notification, MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import errorCode from '@/utils/errorCode'
import { getToken } from '@/utils/auth'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 11000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // 是否需要设置 token store.getters.token
    const isToken = (config.headers || {}).isToken === false
    if (getToken()) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Plus-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    Message.error("请求超时！！！");
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    const status = response.status
    const message = res.msg || errorCode[status] || errorCode['default']

    // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    if (res.code === 403 || res.code === 208 || res.code === 214 || res.code === 215 || res.code === 219 || res.code === 206) {
      //if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      // to re-login
      MessageBox.confirm('你已失去登录状态, 你可以取消或者再次回到登录页面重新登录', '退出登录', {
        //MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/logout').then(() => {
          //store.dispatch('user/resetToken').then(() => {
          location.reload()
          // location.href = '/index';
        })
      })
    } else if (res.code === 400 || res.code === 404 || res.code === 405 || res.code === 409 || res.code === 415 || res.code === 500 || res.code=== 501) {
      // if the custom code is not 20000, it is judged as an error.
      Message({
        message: message,
        type: 'error',
        duration: 4 * 1000
      })
      return Promise.reject(new Error(message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    }
    else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    }
    else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
