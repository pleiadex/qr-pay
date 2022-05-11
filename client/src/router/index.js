import Vue from 'vue'
import Router from 'vue-router'
import Markets from '@/components/Markets'
import Dashboard from '@/components/Dashboard'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/markets',
      name: 'markets',
      component: Markets
    },
    {
      path: '/markets/:marketId',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/markets/:marketId/login',
      name: 'login',
      component: Login
    },
    {
      path: '*',
      redirect: 'markets'
    }
  ]
})
