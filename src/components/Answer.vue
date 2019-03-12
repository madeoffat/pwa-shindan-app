<template>
  <div class="container">
    <div class="title">{{ content }}</div>
    <div class="button">
			<v-btn large class="white--text" color="indigo" @click="goToHome">
        トップに戻る
    </v-btn>
		</div>
  </div>
</template>


<script>
import db from "@/firebase/init";
export default {
	data() {
		return {
			isAnswer: false,
      id: undefined,
      content: undefined
		}
	},
	created() {
    db.collection("questions")
      .doc(this.$route.params.id)
      .get()
      .then(doc => {
        let data = doc.data();
        this.id = doc.id;
        this.isAnswer = data.is_answer;
        this.content = data.content;
      });
	},
	methods: {
		goToHome() {
			this.$router.push({ name: "Home" });
		}
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
  font-size: 20px;
	margin-top: 50px;
  font-weight: bold;
  text-align: center;
  animation-name: fadein;
  animation-duration: 2s;
}
.button {
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
