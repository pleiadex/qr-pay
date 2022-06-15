import Api from '@/services/Api'

export default {
  login (credentials, marketId) {
    return Api().post(`markets/${marketId}/login`, credentials)
  },
  changePassword (credentials, marketId) {
    return Api().post(`markets/${marketId}/change-password`, credentials)
  },
  getAllUsersOfMarket (marketId, credentials) {
    return Api().get(`markets/${marketId}/admin`, credentials)
  },
  resetPasswords (marketId, params, credentials) {
    return Api().put(`markets/${marketId}/reset-passwords`, params, credentials)
  },
  deleteUsers (marketId, params, credentials) {
    return Api().delete(`markets/${marketId}/delete-users`, { data: params }, credentials)
  },
  isTokenValid (credentials) {
    return Api().get('/user', credentials)
  }
}
