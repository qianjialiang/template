
/* eslint-disable no-undef */

// import { sNowUrl } from '@/utils'
import { fOauth2GetPublicKey, fSm2PublicKey, fWhiteSendSm4 } from '@/api/key'
import { fFactorAccountLogin, fSendSmsCodeByUuid } from '@/api/key'
import { fAccountLogin, fQuickLogin } from '@/api/key'

const state = {
  newKey: oKey.newKey(),
  uuid: '',
  publicKey: ''
}

const mutations = {
  SET_NEW_KEY: (state) => {
    // if (uuid) {
    //   setToken(uuid)
    // }
    state.newKey = oKey.newKey()
  },
  SET_UUID: (state, uuid) => {
    // if (uuid) {
    //   setToken(uuid)
    // } else {
    //   removeToken()
    // }
    state.uuid = uuid
  },
  SET_PUBLIC_KEY: (state, publicKey) => {
    // if (publicKey) {
    //   setToken(publicKey)
    // } else {
    //   removeToken()
    // }
    state.publicKey = publicKey
  }
}

const actions = {
  // user login
  getPublicKey({ commit, state }) {
    return new Promise((resolve, reject) => {
      fOauth2GetPublicKey().then(res => {
        const datagram = res.datagram || ''
        if (datagram) {
          const oData = JSON.parse(datagram)
          commit('SET_UUID', oData.uuid)
          commit('SET_PUBLIC_KEY', oData.publicKey)
          fSm2PublicKey({
            publicKeyHex: oData.publicKey,
            data: state.newKey
          }).then(res => {
            // commit('SET_NEW_KEY')
            fWhiteSendSm4({
              uuid: oData.uuid,
              secret: res
            })
          })
        }
      })
    })
  },
  login({ dispatch }, data) {
    const obj = {
      ...data,
      client_id: oKey.client_id,
      redirect_uri: oKey.redirect_uri
    }

    return new Promise((resolve, reject) => {
      if (oKey.type === 2) {
        fAccountLogin(obj).then(res => {
          console.log(JSON.stringify(obj))
          // const { data } = response
          // commit('SET_TOKEN', data.token)
          const datagram = res.datagram || ''
          if (datagram) {
            const data = oKey.sm4.decrypt(datagram, oKey.keyFilter(state.newKey))
            if (data) {
              try {
                const oData = JSON.parse(data)
                const uuid = oData && oData.uuid
                // console.log(oData)
                // fSendSmsCodeByUuid(uuid)
                fQuickLogin({
                  client_id: oKey.client_id,
                  redirect_uri: oKey.redirect_uri,
                  uuid: uuid,
                  relatedType: '01'
                }).then(({ datagram }) => {
                  if (datagram) {
                    const data = oKey.sm4.decrypt(datagram, oKey.keyFilter(state.newKey))
                    if (data) {
                      try {
                        const oData = JSON.parse(data)
                        dispatch('user/setToken', oData.access_token, { root: true })
                        // console.log(oData)
                        // fSendSmsCodeByUuid(uuid)
                        resolve()
                      } catch (error) {
                        console.log(error)
                      }
                    }
                  }
                })
              } catch (error) {
                console.log(error)
              }
            }
            // console.log(data)
          }
        }).catch(error => {
          reject(error)
        })
      } else {
        fFactorAccountLogin(obj).then(res => {
          // const { data } = response
          // commit('SET_TOKEN', data.token)
          const datagram = res.datagram || ''
          if (datagram) {
            const data = oKey.sm4.decrypt(datagram, oKey.keyFilter(state.newKey))
            if (data) {
              try {
                const oData = JSON.parse(data)
                const uuid = oData && oData.uuid
                fSendSmsCodeByUuid(uuid)
              } catch (error) {
                console.log(error)
              }
            }
            // console.log(data)
          }
          // resolve()
        }).catch(error => {
          reject(error)
        })
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
