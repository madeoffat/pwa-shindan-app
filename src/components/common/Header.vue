<template>
  <v-toolbar color="indigo" dark>
    <v-toolbar-side-icon class="heading" v-if="showArrow">
      <v-icon @click="goBack">arrow_back</v-icon>
    </v-toolbar-side-icon>
    <router-link class="toolbar-title" to="/edit" exact>

    <v-toolbar-title>診断
       <!-- <v-btn flat to="/"></v-btn> -->
       </v-toolbar-title>
       </router-link>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn flat v-if="!user" to="/signup">登録</v-btn>
      <v-btn flat v-if="!user" to="/login">ログイン</v-btn>
      <!-- <v-btn flat v-if="user" to="/">{{ user.email }}</v-btn> -->
      <v-btn flat v-if="user" @click="logout">ログアウト</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import firebase from "firebase";

export default {
  data() {
    return {
      user: null,
      showArrow: false
    };
  },
  created() {
    if (
      this.$router.currentRoute.path === "/create" ||
      this.$router.currentRoute.path === "/edit" ||
      this.$router.currentRoute.path === "/setting"
    ) {
      this.showArrow = true;
    }
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
      } else {
        this.user = null;
      }
    });
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push({ name: "Login" });
        });
    },
    goBack() {
      if (this.$router.currentRoute.path === '/setting') {
        this.$router.push({ name: "Home" })
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style>
h2 {
  color: white;
}
.toolbar-title {
  color: inherit;
  text-decoration: inherit;
}
</style>
