import Vue from 'vue'
import Router from 'vue-router'
import Markets from '@/components/Markets'
import Dashboard from '@/components/Dashboard'
import Login from '@/components/Login'
import Sell from '@/components/Sell'
import Purchase from '@/components/Purchase'
import CreateMarket from '@/components/CreateMarket'
import ChangePassword from '@/components/ChangePassword'
import Admin from '@/components/Admin'
import store from '@/store/store'
import AuthenticationService from '@/services/AuthenticationService'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/markets',
      name: 'markets',
      component: Markets
    },
    {
      path: '/markets/create',
      name: 'create-market',
      component: CreateMarket
    },
    {
      path: '/markets/:marketId',
      name: 'dashboard',
      component: Dashboard,
      beforeEnter: (to, from, next) => {
        try {
          const isUserLoggedIn = store.state.isUserLoggedIn
          if (isUserLoggedIn) {
            const isAdmin = store.state.user.isAdmin
            const userMarketId = store.state.user.marketId.toString()
            const marketId = to.params.marketId.toString()

            // url로 직접 랜딩 시 비권한자 또는 관리자가 들어올 수 있기 때문에 확인하기
            if ((userMarketId === marketId) && !isAdmin) {
              next()
            } else {
              next('/')
            }
          } else next('/')
        } catch (err) {
          next('/')
        }
      }
    },
    {
      path: '/markets/:marketId/login',
      name: 'login',
      component: Login
    },
    {
      path: '/markets/:marketId/sell',
      name: 'sell',
      component: Sell,
      beforeEnter: (to, from, next) => {
        try {
          const isUserLoggedIn = store.state.isUserLoggedIn
          if (isUserLoggedIn) {
            const isAdmin = store.state.user.isAdmin
            const userMarketId = store.state.user.marketId.toString()
            const marketId = to.params.marketId.toString()

            // url로 직접 랜딩 시 비권한자 또는 관리자가 들어올 수 있기 때문에 확인하기
            if ((userMarketId === marketId) && !isAdmin) {
              next()
            } else {
              next('/')
            }
          } else next('/')
        } catch (err) {
          next('/')
        }
      }
    },
    {
      path: '/markets/:marketId/purchase',
      name: 'purchase',
      component: Purchase,
      beforeEnter: (to, from, next) => {
        try {
          const isUserLoggedIn = store.state.isUserLoggedIn
          if (isUserLoggedIn) {
            const isAdmin = store.state.user.isAdmin
            const userMarketId = store.state.user.marketId.toString()
            const marketId = to.params.marketId.toString()

            // url로 직접 랜딩 시 비권한자 또는 관리자가 들어올 수 있기 때문에 확인하기
            if ((userMarketId === marketId) && !isAdmin) {
              next()
            } else {
              next('/')
            }
          } else next('/')
        } catch (err) {
          next('/')
        }
      }
    },
    {
      path: '/markets/:marketId/change-password',
      name: 'change-password',
      component: ChangePassword,
      beforeEnter: (to, from, next) => {
        try {
          const isUserLoggedIn = store.state.isUserLoggedIn
          if (isUserLoggedIn) {
            const userMarketId = store.state.user.marketId.toString()
            const marketId = to.params.marketId.toString()

            // url로 직접 랜딩 시 비권한자가 들어올 수 있기 때문에 확인하기
            if (userMarketId === marketId) {
              next()
            } else {
              next('/')
            }
          } else next('/')
        } catch (err) {
          next('/')
        }
      }
    },
    {
      path: '/markets/:marketId/admin',
      name: 'admin',
      component: Admin,
      beforeEnter: (to, from, next) => {
        try {
          const isUserLoggedIn = store.state.isUserLoggedIn
          if (isUserLoggedIn) {
            const isAdmin = store.state.user.isAdmin
            const userMarketId = store.state.user.marketId.toString()
            const marketId = to.params.marketId.toString()

            // url로 직접 랜딩 시 비권한자 또는 게스트가 들어올 수 있기 때문에 확인하기
            if ((userMarketId === marketId) && isAdmin) {
              next()
            } else {
              next('/')
            }
          } else next('/')
        } catch (err) {
          next('/')
        }
      }
    },
    {
      path: '*',
      redirect: 'markets'
    }
  ]
})

async function isTokenValid () {
  try {
    const isValid = (await AuthenticationService.isTokenValid()).data
    return isValid
  } catch (err) {
    return false
  }
}
router.beforeEach((to, from, next) => {
  // 로그인 정보가 남아있을 경우, 유효한지 확인
  if (store.state.user) {
    isTokenValid()
      .then((isValid) => {
        // 계정이 존재하지 않는다면, remove login state
        if (!isValid) {
          store.dispatch('setToken', null)
          store.dispatch('setUser', null)
          next('/')
        } else next()
      })
      .catch(() => {
        store.dispatch('setToken', null)
        store.dispatch('setUser', null)
        next('/')
      })
  } else next()
})

export default router
