const TokenKey = '8100-Token'
const PhoneKey = '8100-Phone'

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}

export function getPhone() {
  return localStorage.getItem(PhoneKey)
}

export function setPhone(token) {
  return localStorage.setItem(PhoneKey, token)
}

export function removePhone() {
  return localStorage.removeItem(PhoneKey)
}
