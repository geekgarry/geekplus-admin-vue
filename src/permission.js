import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login','/redirect','/resumeGenerate','/china/map','/covid','/chinaEchart','/worldCovid'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      let menus = store.state.user.menus!==undefined && store.state.user.menus.length > 0
      var menuslength=store.state.user.menus.length
      //const hasGetUserInfo = store.getters.name
      if (menuslength === 0) {
        try {
          // get user info
          //await store.dispatch('user/getInfo')
          //next()
          store.dispatch('user/getMenu').then(res => { // 拉取 菜单信息
            // console.log(res)
            //console.log(store.getters.nickName)
            //从localStorage中获取用户信息,是登陆状态则能够进行webSocket重连
            const routes=res
            //const permission = {}写在这里可以直接方法名引用，const action={}里必须加getter的注册名称在方法前
            //如果在对象外围加上{},表示去这个对象里面的某个具体的对象的的值适用于JSON对象，JSON数字则不可以
            store.dispatch('generateRoutes', {routes}).then((res) => { // 根据 system 权限生成可访问的路由表
              // console.log(store.getters.addRoutes)
              //router.options.routes=res
              // console.log(res)
              router.addRoutes(store.getters.addRoutes) // 动态添加可访问路由表
              // console.log(router.options.routes)
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            })
          }).catch((err) => {
            //console.log(err)
            store.dispatch('user/logout').then(() => {
              Message.error(err || '用户认证失败, 请重新登录')
              if (to.path !== '/login') {
                next({ path: '/login' })
              }
            })
          })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      } else {
        next()
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
