<template>
  <div class="container">
    <v-btn fab dark class="add-button white--text" color="red" @click="goCreate">
      <v-icon dark>add</v-icon>
    </v-btn>
    <p v-if="!isAnswerSet" class="red-text">答えが設定されていません。</p>
    <label for="first">
      <h3>最初の質問</h3>
    </label>
    <div class="question-form">
      <FilterableDropdown
        :items="questions"
        v-model="selected"
        idKey="id"
        valueKey="id"
        textKey="content"
        filterTargetKey="content"
      />
      <v-btn class="white--text" color="indigo" @click="saveFirst">保存</v-btn>
    </div>
    <p v-if="feedback" class="red-text">{{ feedback }}</p>
    <div class="question-list">
      <div></div>
      <h3 v-if="questions.length > 0">質問</h3>
      <v-list-tile v-for="question in questions" :key="question.id" @click="goEdit(question.id)">
        <v-list-tile-content>
          <v-list-tile-title v-html="question.content"></v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-icon>build</v-icon>
        </v-list-tile-action>
      </v-list-tile>
      <v-divider></v-divider>
    </div>
    <div class="answer-list">
      <h3 v-if="answers.length > 0">答え</h3>
      <v-list-tile v-for="answer in answers" :key="answer.id" @click="goEdit(answer.id)">
        <v-list-tile-content>
          <v-list-tile-title v-html="answer.content"></v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-icon>build</v-icon>
        </v-list-tile-action>
      </v-list-tile>
    </div>
  </div>
</template>

<script>
import db from "@/firebase/init";
import draggable from "vuedraggable";
import FilterableDropdown from "@/components/FilterableDropdown";

export default {
  props: {
    firstQuestionId: String
  },
  data: function() {
    return {
      question: "",
      selected: undefined,
      questions: [],
      answers: [],
      feedback: undefined,
      isAnswerSet: false
    };
  },
  created() {
    let ref = db
      .collection("questions")
      .where("project_id", "==", this.$route.params.id)
      .get()
      .then(questions => {
        questions.docs.forEach(doc => {
          let data = doc.data();
          if (data.is_answer) {
            this.isAnswerSet = true;
          }
          if (!data.is_answer) {
            this.questions.push({
              id: doc.id,
              project_id: data.project_id,
              yes_id: data.yes_id,
              no_id: data.no_id,
              is_answer: data.is_answer,
              content: data.content
            });
          } else {
            this.answers.push({
              id: doc.id,
              project_id: data.project_id,
              yes_id: data.yes_id,
              no_id: data.no_id,
              is_answer: data.is_answer,
              content: data.content
            });
          }
        });
      });
    this.setFirstQuestion();
  },
  methods: {
    setFirstQuestion() {
      if (!this.firstQuestionId) {
        let ref = db
          .collection("projects")
          .doc(this.$route.params.id)
          .get()
          .then(doc => {
            let data = doc.data();
            this.selected = data.first_q_id;
          });
      } else {
        this.selected = this.firstQuestionId;
      }
    },
    goHome() {
      this.$router.push({ name: "Home" });
    },
    goCreate() {
      this.$router.push({
        name: "CreateQuestion",
        params: { pid: this.$route.params.id }
      });
    },
    goEdit(id) {
      this.$router.push({
        name: "EditQuestion",
        params: { pid: this.$route.params.id, id: id }
      });
    },
    saveFirst() {
      if (!this.selected) {
        this.feedback = "最初の質問を設定してください。";
        return;
      }
      db.collection("projects")
        .doc(this.$route.params.id)
        .update({
          first_q_id: this.selected,
          timestamp: Date.now()
        })
        .then(
          this.$router.push({
            name: "Setting",
            params: { pid: this.$route.params.id }
          })
        )
        .catch(err => {
          console.error(err);
        });
      this.newMessage = null;
      this.feedback = null;
    }
  },
  components: {
    FilterableDropdown,
    draggable
  }
};
</script>

<style scoped>
.text-input {
  background-color: white;
  margin-right: 5px;
  flex: 3;
}
.container {
  flex-direction: row;
  padding: 20px;
}
.question-form {
  display: flex;
  justify-content: left;
}
.question-list {
  margin-top: 20px;
  text-align: left;
  margin-bottom: 30px;
}
.answer-list {
  margin-bottom: 40px;
}
.text-color-primary {
  color: blue;
}
.button {
  flex: 1;
  background-color: #008080;
  margin-left: 5px;
  align-items: center;
  justify-content: center;
  padding-top: 10px;
  padding-bottom: 10px;
}
.red-text {
  color: red;
}
.add-button {
  position: absolute;
  bottom: 5px; /** 場合によっては微調整 **/
  right: 5px;  
  position: fixed;
  z-index: 99;
}
.first {
  margin-bottom: 10vh;
}
</style>
