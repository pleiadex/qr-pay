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
        <Modal
          v-if="showModal"
          @close="closeModal"
          @purchase="purchase">
          <h3 slot="header">
            판매자 정보
          </h3>
          <div slot="body">
            소은님이 물감을 3000원에 판매하려고 합니다.
          </div>
        </Modal>
    </v-row>
  </v-container>

</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'
import Modal from './Modal'

export default {
  components: {
    QrcodeStream,
    Modal
  },
  data () {
    return {
      isValid: undefined,
      camera: 'auto',
      result: null,
      showModal: false
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
      this.result = decodedString
      this.isValid = true

      this.turnCameraOff()
      this.showModal = true
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
    closeModal () {
      console.log('취소')
      this.showModal = false
      this.turnCameraOn()
    },
    purchase () {
      console.log('구매!')
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
