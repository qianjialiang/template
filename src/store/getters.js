let url = 'http://47.98.49.65:9000/showServer'
if (location && location.hostname !== 'localhost') {
  url = 'http://' + location.hostname + ':' + (location.port || 9000) + '/showServer'
}
const getters = {
  url: () => url,
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs
}
export default getters
