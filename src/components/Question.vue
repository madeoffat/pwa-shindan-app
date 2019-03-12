<template>
  <div class="container">
    <div class="title">{{ content }}</div>
    <div class="buttons">
      <v-btn large color="primary" @click="goNext(nextYesId)">Yes</v-btn>
      <v-btn large color="error" @click="goNext(nextNoId)">No</v-btn>
    </div>
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
.title {
  display: flex;
  justify-content: center;
	margin-top: 50px;
  font-size: 45px;
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
