<template>
  <div class="pl-4 pr-4 pt-2 pb-2">
    <h1>환영합니다!</h1>
    <h2>🤑{{title}}🤑</h2>
    <v-text-field type="text" name="id" label="아이디" v-model="id" placeholder="아이디"></v-text-field>
    <br>
    <v-text-field type="password" name="password" label="비밀번호" v-model="password" placeholder="비밀번호"></v-text-field>
    <br>
    <p>설정한 아이디와 비밀번호로 로그인 해주세요. 만약 <b>로그인이 처음</b>이라면 자동으로 사용자 등록이 됩니다.</p>
    <p>만약 로그인에 문제가 있다면 시장을 개설한 관리자에게 문의 부탁드립니다. 🙇‍♂️</p>
    <div class="danger-alert" v-html="error"/>
    <v-btn color="#0af" @click="login" dark>로그인</v-btn>
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
import AuthenticationService from '@/services/AuthenticationService'
import AlertModal from './Modals/AlertModal'
export default {
  components: {
    AlertModal
  },
  data () {
    return {
      id: '',
      password: '',
      error: null,
      title: '',
      alertModal: {
        header: null,
        body: null,
        showModal: false
      }
    }
  },
  async mounted () {
    // Fetch title of the market corresponding to marketId
    const marketId = this.$store.state.route.params.marketId
    try {
      this.title = (await MarketsService.search(marketId)).data.title
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
    async login () {
      try {
        const marketId = this.$store.state.route.params.marketId

        if (this.id.length * this.password.length === 0) {
          console.log('Required!')
          this.error = '아이디와 비밀번호 모두 입력해주세요'
          return
        }
        const response = (await AuthenticationService.login({
          name: this.id,
          password: this.password
        }, marketId)).data

        // Set vuex state
        this.$store.dispatch('setToken', response.token)
        this.$store.dispatch('setUser', response.user)

        // 관리자 계정으로 로그인 시 관리자 페이지로 넘어가고, 아니면 게스트 대시보드로 넘어가기
        const isAdmin = response.user.isAdmin
        if (isAdmin) {
          this.$router.push({
            name: 'admin',
            params: {
              marketId: marketId
            }
          })
        } else {
          this.$router.push({
            name: 'dashboard',
            params: {
              marketId: marketId
            }
          })
        }
      } catch (err) {
        this.error = err.response.data.error
      }
    }
  }
}
</script>

<style scoped>
.danger-alert {
  color: red;
}
</style>
