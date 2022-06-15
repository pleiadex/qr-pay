<template>
  <div>
    <h1 class='market-h1 ml-3'>{{title}}</h1>
    <hr>
    <h2 class='market-h2 ml-3'>가진 돈: {{numeberWithComma(balance)}}원</h2>
    <v-container>
      <v-row
        class='mt-5 mb-5'>
        <v-btn
          class='ml-2'
          rounded
          color="deep-purple lighten-1"
          dark
          @click="moveTo('purchase')"
        >
          구매하기
        </v-btn>
        <v-btn
          class='ml-5'
          rounded
          color="blue"
          dark
          @click="moveTo('sell')"
        >
          판매하기
        </v-btn>
        <v-btn
          class='ml-5'
          rounded
          color="red"
          dark
          @click="moveTo('change-password')"
        >
          비밀번호 변경
        </v-btn>
      </v-row>
      <v-row>
        <v-col>
          <h2 class='market-h2'>거래 내역</h2>
          <div>
            <v-data-table
              :headers="headers"
              :items="transactions"
              :sort-by="['date']"
              :sort-desc="[true]"
              :page.sync="page"
              :items-per-page='itemsPerPage'
              hide-default-footer
              mobile-breakpoint='0'
              class="elevation-1"
              @page-count="pageCount = $event"
            >
              <template v-slot:[`item.amount`]="{ item }">
                <v-chip
                  v-if='item.amount > 0'
                  color='green'
                  dark
                >
                  + {{ numeberWithComma(item.amount) }} ₩
                </v-chip>
                <v-chip
                  v-else-if='item.amount === 0'
                  color='gray'
                  dark
                >
                  {{ numeberWithComma(item.amount) }} ₩
                </v-chip>
                <v-chip
                  v-else
                  color='red'
                  dark
                >
                  - {{ numeberWithComma(item.amount * (-1)) }} ₩
                </v-chip>
              </template>
            </v-data-table>
            <div class="text-center pt-2">
              <v-pagination
                v-model="page"
                :length="pageCount"
                prev-icon="chevron_left"
                next-icon="chevron_right">
              </v-pagination>
            </div>
          </div>
        </v-col>
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
import MarketsService from '@/services/MarketsService'
import TransactionsService from '@/services/TransactionsService'
import AlertModal from './Modals/AlertModal'
export default {
  components: {
    AlertModal
  },
  data () {
    return {
      title: '',
      alertModal: {
        header: null,
        body: null,
        showModal: false
      },
      marketId: null,
      page: 1,
      pageCount: 0,
      itemsPerPage: 5,
      headers: [
        {
          text: '일시',
          align: 'start',
          sortable: false,
          value: 'date',
          width: '25%'
        },
        { text: '거래한 사람',
          value: 'user',
          width: '25%'
        },
        { text: '내역', value: 'goods' },
        { text: '금액',
          value: 'amount',
          width: '10%'
        }
      ],
      transactions: [],
      balance: 0
    }
  },
  beforeRouteUpdate (to, from, next) {
    try {
      const isUserLoggedIn = this.$store.state.isUserLoggedIn
      if (isUserLoggedIn) {
        const isAdmin = this.$store.state.user.isAdmin
        const userMarketId = this.$store.state.user.marketId.toString()
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
  },
  async mounted () {
    const marketId = this.$store.state.route.params.marketId
    try {
      this.title = (await MarketsService.search(marketId)).data.title
    } catch (err) {
      this.alertModal.header = '에러 발생'
      this.alertModal.body = err.response.data.error
      this.alertModal.showModal = true
      return
    }
    try {
      const response = (await TransactionsService.get(marketId)).data
      this.balance = response.balance
      this.transactions = response.transactions.map(
        transaction => this.parseTransaction(transaction)
      )
    } catch (err) {
      this.alertModal.header = '에러 발생'
      this.alertModal.body = err.response.data.error
      this.alertModal.showModal = true
    }
  },
  methods: {
    alertClose () {
      this.alertModal.showModal = false
    },
    // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
    numeberWithComma (num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    moveTo (route) {
      this.$router.push({
        name: route,
        params: {
          marketId: this.$store.state.route.params.marketId
        }
      })
    },
    parseTransaction (transaction) {
      const userName = this.$store.state.user.name

      if (transaction['sender'].name.toString() === userName.toString()) { // 송금한 경우
        transaction['user'] = transaction['receiver'].name
        transaction['amount'] *= (-1)
      } else if (transaction['receiver'].name.toString() === userName.toString()) { // 입금된 경우
        transaction['user'] = transaction['sender'].name
      }
      transaction['date'] = this.convertUtcToGmt(transaction['updatedAt'])
      return transaction
    },
    convertUtcToGmt (utcTime) {
      // "2022-06-03T06:58:50.797Z" + 9Hour -> 5/3 16:09
      const time = new Date(utcTime)
      const date = time.toLocaleString('ko-KR')
      return date
    }
  }
}
</script>

<style scoped>
</style>
