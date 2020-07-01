import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const UserData = 'User-Data'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserData() {
  const oUserData = Cookies.get(UserData)
  if (oUserData) {
    return JSON.parse(oUserData)
  } else {
    return {}
  }
}

export function setUserData(token) {
  return Cookies.set(UserData, JSON.stringify(token))
}

export function removeUserData() {
  return Cookies.remove(UserData)
}

