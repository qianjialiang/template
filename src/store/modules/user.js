import { fLogin, fLogout, fGetAccountInfo } from '@/api/user'
import { getToken, setToken, removeToken, getPhone, setPhone, removePhone } from '@/utils/auth'
import { permissionData, permissionList } from '@/utils/permission'
// import { sNowUrl } from '@/utils'

const state = {
  token: getToken(),
  phone: getPhone(),
  name: '',
  avatar: '',
  permissionData,
  permissionList,
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    if (token) {
      setToken(token)
    } else {
      removeToken()
    }
    state.token = token
  },
  SET_PHONE: (state, phone) => {
    if (phone) {
      setPhone(phone)
    } else {
      removePhone()
    }
    state.phone = phone
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      fLogin(userInfo).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      fGetAccountInfo().then(response => {
        // eslint-disable-next-line no-undef
        // showVideo.setVideoOption({
        //   type: 2,
        //   url: sNowUrl,
        //   token: state.token,
        //   src: ''
        // })

        const { data } = response
        if (data.auth === 'all') {
          data.roles = permissionList
        } else if (data.auth) {
          data.roles = data.auth.split(',')
        } else {
          data.roles = ['admin']
        }
        const { roles, realname, username } = data
        commit('SET_ROLES', roles)
        commit('SET_NAME', realname)
        commit('SET_PHONE', username)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      fLogout().then(() => {
        dispatch('resetToken')

        // reset visited views and cached views
        dispatch('tagsView/delAllViews', null, { root: true })

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
      commit('SET_ROLES', [])
      // commit('SET_PHONE', '')

      location.reload()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
