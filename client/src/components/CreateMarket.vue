<template>
  <div class="pl-4 pr-4 pt-2 pb-2">
    <h1>시장 개설</h1>
    <v-text-field
      type="text"
      name="title"
      label="시장 이름"
      v-model="market.title"
      required
      :rules="rules.requiredData"></v-text-field>
    <br>
    <v-text-field
      type="text"
      name="id"
      label="관리자 아이디"
      v-model="market.name"
      required
      :rules="rules.requiredData"></v-text-field>
    <br>
    <v-text-field
      type="password"
      name="password"
      label="관리자 비밀번호"
      v-model="market.password"
      required
      :rules="rules.requiredData"></v-text-field>
    <br>
    <p>시장 개설 시, 시장 이름과 사용할 관리자 계정을 설정해주세요.</p>
    <p>이후에 설정한 관리자 계정으로 시장을 입장하시면 자동으로 관리자 화면으로 이동합니다.</p>
    <div class="danger-alert" v-html="error"/>
    <v-btn color="#0af" @click="createMarket" dark>시장 만들기</v-btn>
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
import AlertModal from './Modals/AlertModal'
export default {
  components: {
    AlertModal
  },
  data () {
    return {
      market: {
        title: null,
        name: null,
        password: null
      },
      alertModal: {
        header: null,
        body: null,
        showModal: false
      },
      error: null,
      rules: {
        requiredData: [
          val => (val || '').length > 0 || '내용을 입력해주세요'
        ]
      }
    }
  },
  methods: {
    async createMarket () {
      // Post request
      this.error = null
      const areAllFieldFilledIn = Object
        .keys(this.market)
        .every(key => !!this.market[key])
      if (!areAllFieldFilledIn) {
        this.error = '모든 항목을 입력해주세요.'
        return
      }
      try {
        await MarketsService.post(this.market)
        this.$router.push({
          name: 'markets'
        })
      } catch (err) {
        this.alertModal.header = '에러 발생'
        this.alertModal.body = err.response.data.error
        this.alertModal.showModal = true
      }
    },
    alertClose () {
      this.alertModal.showModal = false
    }
  }
}
</script>

<style scoped>

</style>
