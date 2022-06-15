import Api from '@/services/Api'

export default {
  index () {
    return Api().get('markets')
  },
  search (index) {
    return Api().get(`markets/${index}`)
  },
  post (params) {
    return Api().post('markets', params)
  },
  delete (marketId, credentials) {
    return Api().delete(`markets/${marketId}`, credentials)
  }
}
