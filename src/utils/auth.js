const TokenKey = 'Admin-Token'
const UserData = 'User-Data'

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}

export function getUserData() {
  return localStorage.getItem(UserData)
}

export function setUserData(token) {
  return localStorage.setItem(UserData, JSON.stringify(token))
}

export function removeUserData() {
  return localStorage.removeItem(UserData)
}

