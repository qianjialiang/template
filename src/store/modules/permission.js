import Vue from 'vue'
import { asyncRoutes, constantRoutes } from '@/router'
import { $Type } from '@/settings'
import { getToken } from '@/utils/auth'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  // if (route.meta && route.meta.roles) {
  //   return roles.some(role => route.meta.roles.includes(role))
  // } else {
  //   return true
  // }
  if (route.meta) {
    return (!route.meta.roles || roles.some(role => route.meta.roles.includes(role))) && (!route.meta.typeFilter || route.meta.typeFilter($Type))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (tmp.meta && tmp.meta.iframe) {
      Vue.component(tmp.name, tmp.component)
    }
    if (tmp.hasToken) {
      tmp.path = tmp.path + (tmp.path.indexOf('?') === -1 ? '?' : '&') + 'token=' + getToken()
    }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      if (!tmp.children || tmp.children.length > 0) {
        res.push(tmp)
      }
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
