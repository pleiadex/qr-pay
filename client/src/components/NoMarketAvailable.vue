<template>
  <v-row>
    <v-col>
      <h1 class='mt-5'>
        열려있는 시장이 없어요 :(
      </h1>
      <p class='font-weight-black mb-5'>
        시장 만들기 버튼을 통해 시장을 열어 보세요!
      </p>
      <v-img
        class='mx-auto'
        width="250"
        :src="imgPath">
      </v-img>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data () {
    return {
      imgPath: require('@/assets/Patrick.png')
    }
  }
}
</script>

<style scoped>
</style>
