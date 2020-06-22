import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const UserData = 'User-Data'
const OpenType = 'Open-Type'
const CompanyData = 'Company-Data'
const companyId = 'Company-Id'

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

export function getOpenType() {
  return parseInt(Cookies.get(OpenType) || 1)
}

export function setOpenType(openType) {
  return Cookies.set(OpenType, openType, { expires: 30 })
}

export function getCompanyData() {
  const oUserData = Cookies.get(CompanyData)
  if (oUserData) {
    return JSON.parse(oUserData)
  } else {
    return {}
  }
}

export function setCompanyData(token) {
  return Cookies.set(CompanyData, JSON.stringify(token), { expires: 30 })
}

export function getCompanyId() {
  return Cookies.get(companyId)
}

export function setCompanyId(id) {
  return Cookies.set(companyId, id, { expires: 30 })
}

export function removeCompanyId() {
  return Cookies.remove(companyId)
}

