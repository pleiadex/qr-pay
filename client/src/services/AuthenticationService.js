import Api from '@/services/Api'

export default {
  login (credentials, marketId) {
    return Api().post(`markets/${marketId}/login`, credentials)
  }
}
