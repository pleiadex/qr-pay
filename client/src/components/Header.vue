<template>
    <v-app-bar dense fixed color="blue">
        <v-app-bar-title class="mr-4">
            <router-link
              class="home"
              tag="span"
              :to="{name: 'markets'}">
                즐거운 시장 놀이
            </router-link>
        </v-app-bar-title>
        <v-spacer></v-spacer>
        <v-btn
          v-if="$store.state.route.name === 'markets'"
          class='ml-2'
          text
          dark
          :to="{name: 'create-market'}">
          시장 만들기
        </v-btn>
        <v-btn
          v-if="$store.state.isUserLoggedIn"
          class='ml-2'
          text
          dark
          @click='logout'>
          로그아웃
        </v-btn>
    </v-app-bar>
</template>

<script>
export default {
  data () {
    return {
      mode: null
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
      this.$router.push({
        name: 'markets'
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.h1 {
  font-weight: bolder;
}
.v-toolbar__title {
  font-weight: bold;
}
.v-btn:not(.v-btn--round).v-size--default {
    background-color: #0af;
}
.home {
    cursor: pointer;
    color: white;
}
.home:hover {
    color: rgb(207, 208, 206);
}
</style>
