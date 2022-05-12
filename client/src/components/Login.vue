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
  </div>
</template>

<script>
export default {
  data () {
    return {
      id: '',
      password: '',
      error: null,
      title: ''
    }
  },
  // TODO: Fetch title of the market corresponding to marketId
  // TODO: 로그인이 되어 있어도 몇번 시장으로 로그인되어 있는지 확인해야 됨!!!
  mounted () {
    const title = '여주초 5학년 5반 시장'
    this.title = title
    // if (this.$store.state.isUserLoggedIn) {
    //   const marketId = this.$store.state.route.params.marketId
    //   this.$router.push({
    //     name: 'dashboard',
    //     params: {
    //       marketId: marketId
    //     }
    //   })
    // }
  },
  methods: {
    login () {
      try {
        const marketId = this.$store.state.route.params.marketId
        console.log('marketID', marketId)

        // test code
        this.$store.state.isUserLoggedIn = true

        this.$router.push({
          name: 'dashboard',
          params: {
            marketId: marketId
          }
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
.danger-alert {
  color: red;
}
</style>
