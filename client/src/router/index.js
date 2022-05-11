import Vue from 'vue'
import Router from 'vue-router'
import Markets from '@/components/Markets'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/markets',
      name: 'markets',
      component: Markets
    },
    {
      path: '*',
      redirect: 'markets'
    }
  ]
})
