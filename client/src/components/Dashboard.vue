<template>
  <div>
    <h1 class='market-h1'>여주초 1학년 1반 시장</h1>
    <hr>
    <h2 class='market-h2'>가진 돈: {{numeberWithComma(balance)}}원</h2>
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
      </v-row>
      <v-row>
        <v-col>
          <h2 class='market-h2'>거래 내역</h2>
          <div>
            <v-data-table
              :headers="headers"
              :items="transactions"
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
  </div>
</template>

<script>
export default {
  data () {
    return {
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
      transactions: [
        {
          date: '5/3 16:09',
          user: '소은',
          goods: '물감',
          amount: -3000
        },
        {
          date: '5/2 13:39',
          user: 159,
          goods: 6.0,
          amount: 2400
        },
        {
          date: '5/2 13:39',
          user: 159,
          goods: 6.0,
          amount: 0
        },
        {
          date: '5/2 13:39',
          user: 159,
          goods: 6.0,
          amount: 2400
        },
        {
          date: '5/2 13:39',
          user: 159,
          goods: 6.0,
          amount: 2400
        },
        {
          date: '5/2 13:39',
          user: 159,
          goods: 6.0,
          amount: 2400
        },
        {
          date: '5/2 13:39',
          user: 159,
          goods: 6.0,
          amount: 2400
        },
        {
          date: '5/2 13:39',
          user: 159,
          goods: 6.0,
          amount: 2400
        },
        {
          date: '5/2 13:39',
          user: 159,
          goods: 6.0,
          amount: 2400
        }
      ],
      balance: 10000000
    }
  },
  // // TODO: url로 직접 랜딩 시 관리자가 들어올 수 있기 때문에 확인하기
  // async mounted () {
  // },
  methods: {
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
    }
  }
}
</script>

<style scoped>
</style>
