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
        <div>
          <v-img
            class='mx-auto'
            :src='qrImageURL'
            max-height='200'
            max-width='200'
          ></v-img>
          <div class='mt-5 font-weight-black' v-if='isGenerated'>
            판매물품: {{goods}}
            <br>
            판매가격: {{price}}
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      goods: null,
      price: null,
      transactionData: {
        goods: null,
        price: null
      },
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
  methods: {
    generate () {
      this.error = null
      const areAllFieldsFilledIn = Object
        .keys(this.transactionData)
        .every(key => !!this.transactionData[key])

      // TODO: 각 항목의 데이터타입 확실하게 확인하기
      if (!areAllFieldsFilledIn || isNaN(this.transactionData.price)) {
        this.error = '정확히 물품과 가격을 입력해주세요.'
        return
      }

      const dummyUrl = 'data:image/png;base64,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'
      this.qrImageURL = dummyUrl
      console.log('generate')

      this.isGenerated = true
      this.price = this.transactionData.price
      this.goods = this.transactionData.goods
    }
  }
}
</script>

<style scoped>

</style>
