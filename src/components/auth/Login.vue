<template>
  <div id="app">
    <v-container>
      <v-layout justify-center>
        <v-flex xs12 sm10 md8 lg6>
          <v-card ref="form">
            <v-card-title primary-title>
              <h4>ログイン</h4>
            </v-card-title>
            <v-card-text>
              <form @submit.prevent="login">
                <v-text-field prepend-icon="mail" name="Username" label="Email" v-model="email"></v-text-field>
                <v-text-field
                  prepend-icon="lock"
                  name="Password"
                  label="Password"
                  type="password"
                  v-model="password"
                ></v-text-field>

                <p v-if="feedback" class="red-text center">{{ feedback }}</p>
                <v-card-actions>
                  <v-btn @click="login()" large block>ログイン</v-btn>
                </v-card-actions>
              </form>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  data() {
    return {
      email: null,
      password: null,
      feedback: null
    };
  },
  methods: {
    login() {
      if (!this.email || !this.password) {
        this.feedback = "メールアドレスまたはパスワードが入力されていません。";
        return;
      }
      this.feedback = null;
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(user => {
          console.log(user);
          this.$router.push({ name: "Home" });
        })
        .catch(err => {
          this.feedback = err.message;
        });
    }
  }
};
</script>

<style>
.red-text {
  color: red;
}
</style>
