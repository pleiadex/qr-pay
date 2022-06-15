<template>
  <v-container>
    <h1 class='market-h1'>{{title}}</h1>
    <hr class='mb-5'>
    <v-row>
      <v-col>
        금액 입금
        <v-text-field
          label="Amount"
          value="1000"
          prefix="₩"
          v-model="depositAmount"
          required
          :rules="rules.requiredData">
        </v-text-field>
        <v-btn
          color='blue'
          dark
          @click="clicked('DEPOSIT')">
          입금
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          @click="moveTo('change-password')">
          관리자 비밀번호 변경
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          @click="clicked('RESET_PASSWORD')">
          비밀번호 초기화
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          color='orange'
          dark
          @click="clicked('DELETE_USERS')">
          사용자 삭제
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          color='error'
          @click="clicked('DELETE_MARKET')">
          시장 삭제
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
            :headers="headers"
            :items="accounts"
            :page.sync="page"
            :items-per-page='itemsPerPage'
            hide-default-footer
            mobile-breakpoint='0'
            class="elevation-1"
            @page-count="pageCount = $event"
          >
          <template v-slot:[`item.isChecked`]="{ item }">
            <v-simple-checkbox
              v-model="item.isChecked"
              :on-icon="'check_box'"
              :off-icon="'check_box_outline_blank'"
              color='primary'
            ></v-simple-checkbox>
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
      </v-col>
    </v-row>
      <ConfirmationModal
        v-if="confirmationModal.showModal"
        @cancel="confirmationClose"
        @confirm="confirm">
        <h3 slot="header">
          {{confirmationModal.header}}
        </h3>
        <div slot="body">
          {{confirmationModal.body}}
        </div>
      </ConfirmationModal>
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
import MarketsService from '@/services/MarketsService'
import TransactionsService from '@/services/TransactionsService'
import AuthenticationService from '@/services/AuthenticationService'
import AlertModal from './Modals/AlertModal'
import ConfirmationModal from './Modals/ConfirmationModal'

const MODE = {
  DEPOSIT: 'DEPOSIT',
  RESET_PASSWORD: 'RESET_PASSWORD',
  DELETE_USERS: 'DELETE_USERS',
  DELETE_MARKET: 'DELETE_MARKET'
}

export default {
  components: {
    AlertModal,
    ConfirmationModal
  },
  data () {
    return {
      MODE: null,
      alertModal: {
        showModal: false,
        header: null,
        body: null
      },
      confirmationModal: {
        showModal: false,
        header: null,
        body: null
      },
      title: '',
      depositAmount: 0,
      page: 1,
      pageCount: 0,
      itemsPerPage: 5,
      headers: [
        {
          text: '아이디',
          align: 'start',
          sortable: false,
          value: 'name'
        },
        { text: '잔액 (₩)',
          value: 'balance'
        },
        {
          text: '선택',
          value: 'isChecked'
        }
      ],
      accounts: [],
      rules: {
        requiredData: [
          val => (val || '').length > 0 || '내용을 입력해주세요'
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
  },
  async mounted () {
    const marketId = this.$store.state.route.params.marketId
    this.MODE = null
    try {
      this.title = (await MarketsService.search(marketId)).data.title
    } catch (err) {
      this.alertModal.header = '오류 발생'
      this.alertModal.body = err.response.data.error
      this.alertModal.showModal = true
    }

    try {
      this.accounts = (await AuthenticationService.getAllUsersOfMarket(marketId)).data
    } catch (err) {
      this.alertModal.header = '오류 발생'
      this.alertModal.body = err.response.data.error
      this.alertModal.showModal = true
    }
  },
  methods: {
    numeberWithComma (num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    confirm () {
      switch (this.MODE) {
        case MODE.DEPOSIT:
          this.deposit()
          this.confirmationModal.showModal = false
          this.alertModal.showModal = true
          break
        case MODE.RESET_PASSWORD:
          this.resetPasswords()
          this.confirmationModal.showModal = false
          this.alertModal.showModal = true
          break
        case MODE.DELETE_USERS:
          this.deleteUsers()
          this.confirmationModal.showModal = false
          this.alertModal.showModal = true
          break
        case MODE.DELETE_MARKET:
          this.deleteMarket()
          this.confirmationModal.showModal = false
          this.alertModal.showModal = true
          break
      }
    },
    clicked (mode) {
      // Swtich에서 Confirmation Modal 내용 구성하기
      switch (mode) {
        case MODE.DEPOSIT:
          if (isNaN(this.depositAmount)) {
            this.alertModal.header = '오류 발생'
            this.alertModal.body = '입금 금액을 숫자로 입력해주세요.'
            this.alertModal.showModal = true
            return
          }
          if (this.depositAmount <= 0) {
            this.alertModal.header = '오류 발생'
            this.alertModal.body = '입금 금액은 0원보다 커야 합니다.'
            this.alertModal.showModal = true
            return
          }
          this.MODE = MODE.DEPOSIT
          this.confirmationModal.header = '입금하기'
          this.confirmationModal.body = this.depositAmount + '원씩 입급하시겠습니까?'
          this.confirmationModal.showModal = true
          break
        case MODE.RESET_PASSWORD:
          this.MODE = MODE.RESET_PASSWORD
          this.confirmationModal.header = '비밀번호 초기화'
          this.confirmationModal.body = '선택된 사용자의 비밀번호를 초기화하시겠습니까?'
          this.confirmationModal.showModal = true

          break
        case MODE.DELETE_USERS:
          this.MODE = MODE.DELETE_USERS
          this.confirmationModal.header = '사용자 삭제'
          this.confirmationModal.body = '선택된 사용자를 삭제하시겠습니까?'
          this.confirmationModal.showModal = true
          break
        case MODE.DELETE_MARKET:
          this.MODE = MODE.DELETE_MARKET
          this.confirmationModal.header = '시장 삭제'
          this.confirmationModal.body = '현재 시장을 삭제하시겠습니까?'
          this.confirmationModal.showModal = true
          break
        default:
          this.alertModal.header = '오류 발생'
          this.alertModal.body = '잘못된 버튼이 눌렸습니다. 새로고침 후 다시 시도해주세요.'
          this.alertModal.showModal = true
      }
    },
    async deposit () {
      const selectedUsers = this.getSelectedUsers()
      if (selectedUsers.length === 0) {
        this.alertModal.header = '입금 실패'
        this.alertModal.body = '사용자를 선택해주세요.'
        return
      }

      if (this.depositAmount <= 0) {
        this.alertModal.header = '입금 실패'
        this.alertModal.body = '입금 금액을 0원보다 크게 입력해주세요.'
        return
      }

      if (isNaN(this.depositAmount)) {
        this.alertModal.header = '입금 실패'
        this.alertModal.body = '입금 금액을 숫자로 입력해주세요.'
        return
      }
      const marketId = this.$store.state.route.params.marketId

      try {
        const successUsers = (await TransactionsService.putMoney(
          marketId,
          {
            selectedUsers: selectedUsers,
            amount: this.depositAmount
          }
        )).data
        this.alertModal.header = '입급 성공'
        if (successUsers.length === 1) {
          this.alertModal.body = `${selectedUsers[0].name}에게 ${this.depositAmount}원 입급하였습니다.`
        } else if (successUsers.length > 1) {
          this.alertModal.body = ` ${this.depositAmount}원씩 ${selectedUsers[0].name}외 ${selectedUsers.length - 1}에게 입급하였습니다.`
        }
      } catch (err) {
        this.alertModal.header = '입급 실패'
        this.alertModal.body = err.response.data.error
      }
    },
    async resetPasswords () {
      const marketId = this.$store.state.route.params.marketId
      const selectedUsers = this.getSelectedUsers()

      if (selectedUsers.length === 0) {
        this.alertModal.header = '비밀번호 초기화 실패'
        this.alertModal.body = '사용자를 선택해주세요.'
        return
      }
      try {
        const affectedUsers = (await AuthenticationService.resetPasswords(marketId, selectedUsers)).data
        if (affectedUsers.length > 0) {
          this.alertModal.header = '비밀번호 초기화 성공'
          this.alertModal.body = `${affectedUsers.length} 명의 비밀번호를 1234로 초기화했습니다.`
        } else {
          this.alertModal.header = '비밀번호 초기화 실패'
          this.alertModal.body = '선택된 사용자의 비밀번호 초기화에 실패했습니다.'
        }
      } catch (err) {
        this.alertModal.header = '비밀번호 초기화 실패'
        this.alertModal.body = err.response.data.error
      }
    },
    async deleteUsers () {
      const marketId = this.$store.state.route.params.marketId
      const selectedUsers = this.getSelectedUsers()

      if (selectedUsers.length === 0) {
        this.alertModal.header = '사용자 삭제 실패'
        this.alertModal.body = '사용자를 선택해주세요.'
        return
      }
      try {
        const affectedUsers = (await AuthenticationService.deleteUsers(marketId, selectedUsers)).data
        if (affectedUsers.length > 0) {
          this.alertModal.header = '사용자 삭제 성공'
          this.alertModal.body = `${affectedUsers.length} 명을 삭제했습니다.`
        } else {
          this.alertModal.header = '사용자 삭제 실패'
          this.alertModal.body = '삭제된 사용자가 없습니다.'
        }
      } catch (err) {
        this.alertModal.header = '사용자 삭제 실패'
        this.alertModal.body = err.response.data.error
      }
    },
    async deleteMarket () {
      const marketId = this.$store.state.route.params.marketId

      try {
        await MarketsService.delete(marketId)
        this.alertModal.header = '시장 삭제 성공'
        this.alertModal.body = '메인 화면으로 이동합니다.'
      } catch (err) {
        this.alertModal.header = '시장 삭제 실패'
        this.alertModal.body = err.response.data.error
      }
    },
    confirmationClose () {
      this.confirmationModal.showModal = false
    },
    async alertClose () {
      // 시장 삭제 시 /markets 로 이동하기; 성공과 실패 여부 상관없다.
      if (this.MODE === MODE.DELETE_MARKET) {
        this.$router.push({name: 'markets'})
      }
      this.alertModal.showModal = false
      const marketId = this.$store.state.route.params.marketId
      this.accounts = (await AuthenticationService.getAllUsersOfMarket(marketId)).data
    },
    getSelectedUsers () {
      let selectedUsers = []
      this.accounts.forEach(account => {
        if (account.isChecked) {
          selectedUsers.push({
            name: account.name
          })
        }
      })
      return selectedUsers
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
