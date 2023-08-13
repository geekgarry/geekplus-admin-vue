//import { login, logout, getInfo } from '@/api/user'
import { login, logout, getInfo, getMenuTree } from '@/api/system/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import store from '..'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    userName:'',
    nickName:'',
    userId:'',
    sysUser:{},
    sysRole:{},
    sysRoles:[],
    menus:[],
    sysOrg:'',
    dicts:{},
    notifyStatus:''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USERNAME: (state, userName) => {
    state.userName = userName
  },
  SET_NICKNAME: (state, nickName) => {
    state.nickName = nickName
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USER: (state, user) => {
    state.sysUser = user
  },
  SET_ROLE: (state, role) => {
    state.sysRole = role
  },
  SET_ROLES: (state, roles) => {
    state.sysRoles = roles
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  },
  SET_NOTIFY: (state,notifyStatus) =>{
    state.notifyStatus=notifyStatus
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, validateCode, validateKey } = userInfo
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_USERNAME', data.userName)
        localStorage.setItem("tokenId", data.token + ":" + data.userName)
        localStorage.setItem("onlineUser", data.userName)
        //console.log(data);
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response.data

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar, roleList } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_USER', data)
        commit('SET_ROLES', roleList)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getMenu({ commit, state }) {
    return new Promise((resolve, reject) => {
      getMenuTree().then(response => {
        const { data } = response;
        const menus = data.menuList;
        if (!menus) {
          return reject('Verification failed, please Login again.')
        }
        const avatar = data.avatar == "" ? require("@/assets/image/profile/mai.png") : process.env.VUE_APP_BASE_API + data.avatar;
        commit('SET_MENUS', data.menuList)
        commit('SET_USERNAME', data.userName)
        commit('SET_NICKNAME', data.nickName)
        commit('SET_USERID', data.userId)
        commit('SET_AVATAR', avatar)
        //let onlineUser = localStorage.getItem("onlineUser");
        //console.log(onlineUser)
        // if (onlineUser) {
          //let tokenId = localStorage.getItem("tokenId");
          // let tokenId=store.state.user.token+":"+store.state.user.userName
          //console.log(tokenId);
          // if (null != tokenId) {
          //   this.websocket.Init(tokenId);
          // }
        // }
        //const { name, avatar } = data.avatar
        resolve(menus)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeToken() // must remove  token  first
        //resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

