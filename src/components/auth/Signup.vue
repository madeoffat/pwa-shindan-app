<template>
  <div id="app">
    <v-container>
      <v-layout justify-center>
        <v-flex xs12 sm10 md8 lg6>
          <v-card ref="form">
              <v-card-title primary-title>
                <h4>登録</h4>
              </v-card-title>
               <v-card-text>
              <form>
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
                  <v-btn :disabled="isRequesting" @click="signup()" large block>登録</v-btn>
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
import db from "@/firebase/init";
import firebase from "firebase";
export default {
  name: "Signup",
  data() {
    return {
      email: null,
      password: null,
      feedback: null,
      isRequesting: false
    };
  },
  methods: {
    signup() {
      if (!this.email || !this.password) {
        this.feedback = "Please fill in all fields";
        return;
      }
      this.feedback = null;
      let ref = db.collection("users").doc(this.email);
      ref.get().then(doc => {
        if (doc.exists) {
          this.feedback = "このメールアドレスはすでに使用されています。";
          this.isRequesting = false;
          return;
        }
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(res => {
            ref.set({
              user_id: res.user.uid
            });
          })
          .then(() => {
            this.$router.push({ name: "Home" });
          })
          .catch(err => {
            this.feedback = err.message;
            this.isRequesting = false;
          });
      });
    }
  }
};
</script>

<style scoped>
.signup {
  max-width: 400vw;
  margin-top: 60px;
}
.signup h2 {
  font-size: 2.4em;
}
.signup .field {
  margin-bottom: 16px;
}
.red-text {
  color: red;
}
</style>
