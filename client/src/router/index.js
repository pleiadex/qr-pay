import Vue from 'vue'
import Router from 'vue-router'
import Markets from '@/components/Markets'
import Dashboard from '@/components/Dashboard'
import Login from '@/components/Login'
import Sell from '@/components/Sell'
import Purchase from '@/components/Purchase'
import CreateMarket from '@/components/CreateMarket'
import Admin from '@/components/Admin'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/markets',
      name: 'markets',
      component: Markets
    },
    {
      path: '/markets/create',
      name: 'createMarket',
      component: CreateMarket
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
      path: '/markets/:marketId/sell',
      name: 'sell',
      component: Sell
    },
    {
      path: '/markets/:marketId/purchase',
      name: 'purchase',
      component: Purchase
    },
    {
      path: '/markets/:marketId/admin',
      name: 'admin',
      component: Admin
    },
    {
      path: '*',
      redirect: 'markets'
    }
  ]
})
