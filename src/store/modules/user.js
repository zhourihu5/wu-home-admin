import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ userName: username.trim(), password: password }).then(response => {
        console.log("response --- ", response);
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        localStorage.setItem('authList', JSON.stringify(data.authorityList)) // 设置菜单
        localStorage.setItem('user', JSON.stringify(data.userInfo)) // 存储用户信息 
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      try {
        let user = JSON.parse(localStorage.getItem("user"));
        console.log("user -- >", user);
        commit('SET_NAME', user.userName)
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      try {
        commit('SET_TOKEN', '')
        commit('SET_NAME', '')
        removeToken()
        resetRouter()
        localStorage.clear(); // 清空localStorage中的数据
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
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

