import store from '@/store'
import { asyncRoutes } from '@/router'

const fFormatRoute = (arr) => {
  return arr.map(item => {
    if (item.name) {
      const obj = {
        id: item.name,
        path: item.path.replace('/', ''),
        label: item.meta.title
      }
      if (item.children && item.children.length > 0) {
        obj.children = fFormatRoute(item.children)
      }
      return obj
    }
  })
}

const permissionData = fFormatRoute(asyncRoutes.filter(item => {
  return item.name
}))

const permissionList = []

function fGetPermission(arr) {
  arr.forEach(row => {
    permissionList.push(row.id)
    if (row.children) {
      fGetPermission(row.children)
    }
  })
}

fGetPermission(permissionData)

export {
  permissionData,
  permissionList
}

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
    })
    return hasPermission
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}
