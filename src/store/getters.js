const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  phone: state => state.user.phone,
  name: state => state.user.name,
  avatar: state => state.user.avatar,
  roles: state => state.user.roles,
  permissionData: state => state.user.permissionData,
  permissionList: state => state.user.permissionList,
  permission_routes: state => state.permission.routes,
  permission_addRoutes: state => state.permission.addRoutes,
  errorLogs: state => state.errorLog.logs
}
export default getters
