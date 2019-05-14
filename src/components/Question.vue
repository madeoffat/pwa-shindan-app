<template>
  <div class="container">
    <div class="content">{{ content }}</div>
    <!-- <div class="buttons"> -->
       <v-container grid-list-md text-xs-center>
    <v-layout row fill-height wrap>
       <v-flex  xm6s>
        <v-card dark color="secondary">
          <v-card-text class="px-0">Yes</v-card-text>
        </v-card>
        </v-flex>
        <v-flex xs6s>
        <v-card dark color="secondary">
          <v-card-text class="px-0">No</v-card-text>
        </v-card>
        </v-flex>
      <!-- <v-btn style="width: 50px;" color="primary" @click="goNext(nextYesId)">Yes</v-btn>
      <v-btn large color="error" @click="goNext(nextNoId)">No</v-btn> -->
    <!-- </div> -->
     </v-layout>
  </v-container>
  </div>
</template>

<script>
import db from "@/firebase/init";
export default {
  data() {
    return {
      isAnswer: false,
      nextYesId: undefined,
      nextNoId: undefined,
      feedback: null,
      id: undefined,
      content: undefined
    };
  },
  created() {
    db.collection("questions")
      .doc(this.$route.params.id)
      .get()
      .then(doc => {
        let data = doc.data();
        this.id = doc.id;
        this.isAnswer = data.is_answer;
        this.nextYesId = data.yes_id;
        this.nextNoId = data.no_id;
        this.content = data.content;
      });
  },
  methods: {
    goNext(nextId) {
      this.$router.push({ name: "Question", params: { id: nextId } });
    }
  },
  beforeRouteUpdate(to, from, next) {
    db.collection("questions")
      .doc(to.params.id)
      .get()
      .then(doc => {
        let data = doc.data();
        this.id = doc.id;
        this.isAnswer = data.is_answer;
        this.nextYesId = data.yes_id;
        this.nextNoId = data.no_id;
        this.content = data.content;
        if (this.isAnswer) {
          this.$router.push({ name: "Answer", params: { id: this.id } });
        }
      });
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  animation-name: fadein;
  animation-duration: 2s;
}
.content {
  display: flex;
  justify-content: center;
	margin-top: 50px;
  font-size: 50px;
  font-weight: bold;
  text-align: center;
  animation-name: fadein;
  animation-duration: 2s;
}

.buttons {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}

@keyframes fadein {
  from {
    opacity: 0;
    /* transform: translateY(20px); */
  }
  to {
    opacity: 1;
    /* transform: translateY(0); */
  }
}
</style>
