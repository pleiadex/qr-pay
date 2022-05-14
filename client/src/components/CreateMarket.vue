<template>
  <div class="pl-4 pr-4 pt-2 pb-2">
    <h1>시장 개설</h1>
    <v-text-field type="text" name="title" label="시장 이름" v-model="title"></v-text-field>
    <br>
    <v-text-field type="text" name="id" label="관리자 아이디" v-model="id"></v-text-field>
    <br>
    <v-text-field type="password" name="password" label="관리자 비밀번호" v-model="password"></v-text-field>
    <br>
    <p>시장 개설 시, 시장 이름과 사용할 관리자 계정을 설정해주세요.</p>
    <p>이후에 설정한 관리자 계정으로 시장을 입장하시면 자동으로 관리자 화면으로 이동합니다.</p>
    <div class="danger-alert" v-html="error"/>
    <v-btn color="#0af" @click="createMarket" dark>시장 만들기</v-btn>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      id: '',
      password: '',
      error: null
    }
  },
  methods: {
    createMarket () {
      // TODO: Post request
      try {
        this.$router.push({
          name: 'markets'
        })
      } catch (err) {
        console.log(err)
        this.error = err
      }
    }
  }
}
</script>

<style scoped>

</style>
