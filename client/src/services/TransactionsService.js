import Api from '@/services/Api'

export default {
  get (marketId) {
    return Api().get(`markets/${marketId}/transactions`)
  },
  putMoney (marketId, params, credentials) {
    return Api().post(`markets/${marketId}/transactions`, params, credentials)
  },
  sell (marketId, params, credentials) {
    return Api().post(`markets/${marketId}/sell`, params, credentials)
  },
  purchase (marketId, params, credentials) {
    return Api().post(`markets/${marketId}/purchase`, params, credentials)
  }
}
