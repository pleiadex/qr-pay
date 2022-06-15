<template>
<v-container>
    <v-row>
      <v-col>
        <h1 class='market-h1'>비밀번호 변경하기</h1>
        <div class="pl-4 pr-4 pt-4 pb-2">
          <v-text-field
            type="password"
            name="oldPassword"
            label="기존 비밀번호"
            v-model="oldPassword"
            required
            :rules="rules.requiredData">
            </v-text-field>
          <br>
          <v-text-field
            type="password"
            name="newPassword"
            label="새 비밀번호"
            v-model="newPassword"
            required
            :rules="rules.requiredData">
          </v-text-field>
          <br>
          <div class="danger-alert mb-5" v-html="error"/>
          <v-btn color="#0af" @click="changePassword" dark>변경</v-btn>
        </div>
      </v-col>
      <ConfirmationModal
        v-if="showConfirmation"
        @cancel="close"
        @confirm="confirm">
        <h3 slot="header">
          비밀번호 변경하시겠습니까?
        </h3>
      </ConfirmationModal>
      <AlertModal
        v-if="showAlert"
        @close="close">
        <h3 slot="header">
          {{response.header}}
        </h3>
        <div slot="body">
          {{response.body}}
        </div>
      </AlertModal>
    </v-row>
  </v-container>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import ConfirmationModal from './Modals/ConfirmationModal'
import AlertModal from './Modals/AlertModal'
export default {
  components: {
    ConfirmationModal,
    AlertModal
  },
  data () {
    return {
      oldPassword: null,
      newPassword: null,
      showConfirmation: false,
      showAlert: false,
      error: null,
      response: {
        header: null,
        body: null
      },
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
        const userMarketId = this.$store.state.user.marketId.toString()
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
  },
  methods: {
    changePassword () {
      if (!this.oldPassword || !this.newPassword) {
        this.error = '비밀번호를 빠짐없이 입력해주세요.'
        return
      }
      if (this.oldPassword.toString() === this.newPassword.toString()) {
        this.error = '기존 비밀번호와 새 비밀번호가 동일합니다.'
        return
      }
      this.showConfirmation = true
    },
    close () {
      const marketId = this.$store.state.route.params.marketId
      if (this.showConfirmation) this.showConfirmation = false
      if (this.showAlert) this.showAlert = false
      if (this.response.header.includes('성공')) {
        if (this.$store.state.user.isAdmin) {
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
      }
    },
    async confirm () {
      const marketId = this.$store.state.route.params.marketId
      try {
        await AuthenticationService.changePassword({
          oldPassword: this.oldPassword,
          newPassword: this.newPassword
        }, marketId)

        this.response.header = '비밀번호 변경 성공'
        this.response.body = '성공적으로 변경되었습니다.'
      } catch (err) {
        this.response.header = '비밀번호 변경 실패'
        this.response.body = err.response.data.error
      }
      this.showConfirmation = false
      this.showAlert = true
    }
  }
}
</script>

<style scoped>

</style>
