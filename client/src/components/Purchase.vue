<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class='market-h1'>구매하기</h1>
        <hr class='mb-5'>
        <p class='mb-5'>카메라에 판매자의 QR코드를 스캔하여 구매할 수 있어요!</p>
        <div class='qr-scanner mx-auto'>
          <qrcode-stream
            :camera="camera"
            @decode="onDecode"
            :track='this.paintOutline'/>
        </div>
      </v-col>
      <ConfirmationModal
        v-if="confirmationModal.showModal"
        @cancel="confirmationClose"
        @confirm="purchase">
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
    </v-row>
  </v-container>

</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'
import ConfirmationModal from './Modals/ConfirmationModal'
import AlertModal from './Modals/AlertModal'
import TransactionsService from '@/services/TransactionsService'

export default {
  components: {
    QrcodeStream,
    ConfirmationModal,
    AlertModal
  },
  data () {
    return {
      isValid: undefined,
      camera: 'auto',
      transactionData: {},
      alertModal: {
        showModal: false,
        header: null,
        body: null
      },
      confirmationModal: {
        showModal: false,
        header: null,
        body: null
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
  computed: {
    validationPending () {
      return this.isValid === undefined && this.camera === 'off'
    },
    validationSuccess () {
      return this.isValid === true
    },
    validationFailure () {
      return this.isValid === false
    }
  },
  methods: {
    onInit (promise) {
      promise
        .catch(console.error)
        .then(this.resetValidationState)
    },
    resetValidationState () {
      this.isValid = undefined
    },
    onDecode (decodedString) {
      const decodedUrl = decodeURIComponent(decodedString)

      const parsedUrl = this.parseUrl(decodedUrl)
      if (parsedUrl) {
        this.transactionData = parsedUrl
        this.confirmationModal.header = '구매하시겠습니까?'
        this.confirmationModal.body = `${parsedUrl['sellerName']}의 ${parsedUrl['goods']}를 ${parsedUrl['price']}원에 구매하시겠습니까?`
        this.confirmationModal.showModal = true
      } else {
        this.alertModal.header = '잘못된 QR 코드'
        this.alertModal.body = '유효하지 않은 QR 코드가 인식되었습니다.'
        this.alertModal.showModal = true
      }
      this.isValid = true
      this.turnCameraOff()
    },
    turnCameraOn () {
      this.camera = 'auto'
    },
    turnCameraOff () {
      this.camera = 'off'
    },
    paintOutline (detectedCodes, ctx) {
      for (const detectedCode of detectedCodes) {
        const [ firstPoint, ...otherPoints ] = detectedCode.cornerPoints

        ctx.strokeStyle = 'green'
        ctx.lineWidth = 3

        ctx.beginPath()
        ctx.moveTo(firstPoint.x, firstPoint.y)
        for (const { x, y } of otherPoints) {
          ctx.lineTo(x, y)
        }
        ctx.lineTo(firstPoint.x, firstPoint.y)
        ctx.closePath()
        ctx.stroke()
      }
    },
    confirmationClose () {
      this.confirmationModal.showModal = false
      this.turnCameraOn()
    },
    alertClose () {
      this.alertModal.showModal = false
      this.turnCameraOn()
    },
    async purchase () {
      const marketId = this.$store.state.route.params.marketId
      try {
        await TransactionsService.purchase(marketId, this.transactionData)
        this.alertModal.header = '구매 성공'
        this.alertModal.body = '성공적으로 구매했습니다.'
      } catch (err) {
        this.alertModal.header = '구매 실패'
        this.alertModal.body = err.response.data.error
      }
      this.confirmationModal.showModal = false
      this.alertModal.showModal = true
    },
    parseUrl (url) {
      // qr-pay://sellerName=test2&marketId=1&goods=바나나&price=1000     // &otp=373878
      let urlJson = {}
      try {
        const splittedUrl = url.split('://')
        if (splittedUrl[0] !== 'qr-pay') return false
        const params = splittedUrl[1].split('&')

        urlJson['sellerName'] = params[0].split('sellerName=')[1]
        urlJson['marketId'] = params[1].split('marketId=')[1]
        urlJson['goods'] = params[2].split('goods=')[1]
        urlJson['price'] = params[3].split('price=')[1]
        // urlJson['otp'] = params[4].split('otp=')[1]

        for (const key in urlJson) {
          if (urlJson.hasOwnProperty(key) && !urlJson[key]) {
            return false
          }
        }
        return urlJson
      } catch (err) {
        return false
      }
    }
  }
}
</script>

<style scoped>
.qr-scanner {
  /* width: 70%; */
  height: 70%;

}
.v-application p {
  text-align: left;
}
</style>
