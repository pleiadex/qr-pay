<template>
  <div id="app">
    <v-app>
      <page-header></page-header>
      <main>
        <router-view/>
      </main>
    </v-app>
  </div>
</template>

<script>
import PageHeader from '@/components/Header'
export default {
  components: {
    PageHeader
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.market-h1 {
  text-align: left;
  margin-left: 5px;
}
.market-h2 {
  text-align: left;
  margin-left: 5px;
}
.danger-alert {
  color: red;
}
</style>
