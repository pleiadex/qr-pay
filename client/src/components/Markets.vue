<template>
  <div>
    <v-container>
    <v-row>
      <v-col v-if="markets.length > 0">
        <div
          class="mb-5 justify-space-between"
          v-for='(market, index) in markets'
          :key='index'>
          <v-card
            :color='colorList[index % 4]'
            dark
          >
            <v-card-title class="text-h5">
              {{market.title}}
            </v-card-title>

            <v-card-subtitle>
              {{market.numOfUsers}}명 참여중
            </v-card-subtitle>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="mr-2 mb-3"
                outlined
                rounded
                @click="enter(market.id)">
                참여하기
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-col>
      <no-market-available v-else></no-market-available>
    </v-row>
    </v-container>
    <AlertModal
      v-if="alertModal.showModal"
      @close="alertClose">
      <h3 slot="header">
        {{alertModal.header}}
      </h3>
      <div slot="body">
        {{alertModal.body}}
      </div>
    </AlertModal>
  </div>
</template>

<script>
import MarketsSevice from '@/services/MarketsService'
import NoMarketAvailable from './NoMarketAvailable'
import AlertModal from './Modals/AlertModal'
export default {
  components: {
    NoMarketAvailable,
    AlertModal
  },
  data () {
    return {
      // Card Color List
      colorList: [
        '#93748A',
        '#AE7E32',
        '#395c6b',
        '#6b4e71'
      ],
      markets: [],
      alertModal: {
        showModal: false,
        header: null,
        body: null
      }
    }
  },
  async mounted () {
    // Fetch the markets
    try {
      this.markets = (await MarketsSevice.index()).data
    } catch (err) {
      this.alertModal.header = '에러 발생'
      this.alertModal.body = err.response.data.error
      this.alertModal.showModal = true
    }
  },
  methods: {
    enter (marketId) {
      try {
        // Login state 확인하고 로그인 필요 없이 자동으로 대시보드 혹은 관리자 페이지로 넘기기
        const isUserLoggedIn = this.$store.state.isUserLoggedIn
        // 조건문 다시 정리하기 로그인 요구: 로그인 정보가 없거나, 로그인된 시장과 입장하는 시장이 다를 경우
        // 로그인이 되어 있는 경우
        if (isUserLoggedIn) {
          const userMarketId = this.$store.state.user.marketId.toString()
          const isAdmin = this.$store.state.user.isAdmin
          if (marketId.toString() === userMarketId) {
            if (isAdmin) {
              // console.log('admin')
              this.moveTo('admin', marketId)
            } else {
              // console.log('dashboard')
              this.moveTo('dashboard', marketId)
            }
          } else {
            // console.log('logged in but wrong market')
            this.moveTo('login', marketId)
          }
        } else {
          // console.log('not logged in')
          this.moveTo('login', marketId)
        }
      } catch (err) {
        this.moveTo('login', marketId)
      }
    },
    moveTo (dest, marketId) {
      this.$router.push({
        name: dest,
        params: {
          marketId: marketId
        }
      })
    },
    alertClose () {
      this.alertModal.showModal = false
    }
  }
}
</script>

<style scoped>
.title {
  size: 10px;
}
.v-card__subtitle {
  text-align: left;
}
</style>
