import defaultSettings from '@/settings'
import variables from '@/assets/styles/element-variables.scss'
import sidebarVariables from '@/assets/styles/variables.scss'
import Cookies from 'js-cookie'

const { showSettings, switchLangs, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  theme: Cookies.get("theme-color") || variables.theme,
  showSettings: showSettings,
  switchLangs: switchLangs,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
  SWITCH_LANG: (state, { key, value }) => {
    if (state.hasOwnProperty(key)){
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  switchLang({ commit }, data) {
    commit('SWITCH_LANG', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

