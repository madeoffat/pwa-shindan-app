
<template>
  <div id="app">
    <v-app>
    <div class="wrapper">
      <Header></Header>
      <div class="content-wrapper">
        <router-view/>
      </div>
    </div>
    </v-app>

  </div>
</template>

<script>
import Header from "@/components/common/Header";
export default {
  name: "App",
  components: {
    Header
  }
};
</script>

<style>
body {
  background: #eee;
}
</style>
