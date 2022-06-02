import Api from '@/services/Api'

export default {
  index () {
    return Api().get('markets')
  },
  search (index) {
    return Api().get(`markets/${index}`)
  }
}
