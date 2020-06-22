// import { login, logout } from '@/api/user'
import { login } from '@/api/user'
import { getToken, setToken, removeToken, getUserData, setUserData, removeUserData } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit, dispatch }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      // const data = {
      //   account: {
      //     url: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      //     name: 'Super Admin',
      //     token: '123456'
      //   },
      //   roles: ['admin']
      // }
      // setUserData(data)
      // commit('SET_TOKEN', data.account.token)
      // setToken(data.account.token)
      // resolve()
      login({ username: username.trim(), password: password }).then(response => {
        const { account, authCode } = response
        let roles = []
        if (authCode === 'all') {
          roles = ['auth', 'model', 'log', 'emp', 'money', 'server', 'price', 'business']
        } else if (authCode) {
          roles = authCode.split(',')
        } else {
          roles.push('onlyReadMoney')
        }
        response.roles = roles
        setUserData(response)

        // videoPort 端口
        commit('SET_TOKEN', account.token)
        setToken(account.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      const oUserData = getUserData()
      const { roles, account } = oUserData

      commit('SET_ROLES', roles)
      commit('SET_NAME', account.name)
      resolve(oUserData)
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      removeUserData()
      resetRouter()

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()

      // logout(state.token).then(() => {
      //   commit('SET_TOKEN', '')
      //   commit('SET_ROLES', [])
      //   removeToken()
      //   resetRouter()
      //
      //   // reset visited views and cached views
      //   dispatch('tagsView/delAllViews', null, { root: true })
      //
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      removeUserData()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

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
