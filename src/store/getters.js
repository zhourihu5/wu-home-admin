const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  size: state => state.app.size,
  routes: state => state.permission.routes,
  addRoutes: state => state.permission.addRoutes
}
export default getters
