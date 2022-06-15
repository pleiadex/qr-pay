<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class='market-h1'>판매하기</h1>
        <div class="pl-4 pr-4 pt-4 pb-2">
          <v-text-field
            type="text"
            name="goods"
            label="판매 물품"
            v-model="transactionData.goods"
            required
            :rules="rules.requiredData">
            </v-text-field>
          <br>
          <v-text-field
            type="number"
            name="price"
            label="가격"
            v-model="transactionData.price"
            required
            :rules="rules.requiredData">
          </v-text-field>
          <br>
          <div class="danger-alert" v-html="error"/>
          <v-btn v-if='!isGenerated' color="#0af" @click="generate" dark>QR코드 생성</v-btn>
          <v-btn v-else color="#0af" @click="generate" dark>다시 QR코드 생성</v-btn>
        </div>
        <div v-if='isGenerated'>
          <v-img
            v-if='qrImageURL'
            class='mx-auto'
            :src='qrImageURL'
            max-height='200'
            max-width='200'
          ></v-img>
          <!-- <div class='red--text' v-if='second > 0'>
            {{second}}초 남음
          </div> -->
          <div class='red--text' v-else>
            QR 코드가 만료되었습니다.
          </div>
          <div class='mt-5 font-weight-black'>
            판매물품: {{goods}}
            <br>
            판매가격: {{price}}
          </div>
        </div>
      </v-col>
    </v-row>
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
  </v-container>
</template>

<script>
import TransactionsService from '@/services/TransactionsService'
import AlertModal from './Modals/AlertModal'
export default {
  components: {
    AlertModal
  },
  data () {
    return {
      goods: null,
      price: null,
      second: 0,
      transactionData: {
        goods: null,
        price: null
      },
      alertModal: {
        showModal: false,
        header: null,
        body: null
      },
      // intervalId: null,
      isGenerated: false,
      error: null,
      qrImageURL: '',
      rules: {
        requiredData: [
          val => (val || '').length > 0 || '항목 입력해주세요.'
        ]
      }
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
  // watch: {
  //   second: function (val) {
  //     if (val <= 0) {
  //       clearInterval(this.intervalId)
  //       this.qrImageURL = null
  //     }
  //   }
  // },
  methods: {
    alertClose () {
      this.alertModal.showModal = false
    },
    async generate () {
      this.error = null
      const areAllFieldsFilledIn = Object
        .keys(this.transactionData)
        .every(key => !!this.transactionData[key])

      // 각 항목의 데이터타입 확실하게 확인하기
      if (!areAllFieldsFilledIn || isNaN(this.transactionData.price)) {
        this.error = '정확한 물품 이름과 가격을 입력해주세요.'
        return
      }

      const marketId = this.$store.state.route.params.marketId
      try {
        this.qrImageURL = (await TransactionsService.sell(marketId, this.transactionData)).data
      } catch (err) {
        this.alertModal.header = '생성 실패'
        this.alertModal.body = err.response.data.error
        this.alertModal.showModal = true
        return
      }

      this.isGenerated = true
      this.price = this.transactionData.price
      this.goods = this.transactionData.goods

      // if (this.intervalId) {
      //   clearInterval(this.intervalId)
      // }
      // this.second = 30
      // this.countDown()
    }
    // countDown () {
    //   this.intervalId = setInterval(() => { this.second -= 1 }, 1000)
    // }
  }
}
</script>

<style scoped>

</style>
