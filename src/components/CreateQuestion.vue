<template>
  <div class="container">
    <div class="new-content">
      <v-radio-group v-model="isAnswer" row>
        <v-radio label="種別：質問" v-bind:value="false"></v-radio>
        <v-radio label="種別：結果" v-bind:value="true"></v-radio>
      </v-radio-group>
      <form @submit.prevent="addContent">
        <v-flex class="content-text">
          <v-text-field label="内容" type="text" name="new-content" v-model="newContent"></v-text-field>
        </v-flex>
        <section v-if="!isAnswer">
          <FilterableDropdown
            :items="questions"
            v-model="selectedYesId"
            placeholder="はいと選んだ場合の次の質問"
            idKey="id"
            valueKey="id"
            textKey="content"
            filterTargetKey="content"
          />
          <FilterableDropdown
            :items="questions"
            v-model="selectedNoId"
            placeholder="いいえと選んだ場合の次の質問"
            idKey="id"
            valueKey="id"
            textKey="content"
            filterTargetKey="content"
          />
        </section>
        <v-btn class="white--text" color="indigo" @click="addContent">保存</v-btn>
        <p v-if="feedback" class="red-text">{{ feedback }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import db from "@/firebase/init";
import FilterableDropdown from "@/components/FilterableDropdown";
import firebase from "firebase";

export default {
  data: function() {
    return {
      isAnswer: false,
      newContent: null,
      selectedYesId: null,
      selectedNoId: null,
      questions: [],
      feedback: null
    };
  },
  created() {
    console.log(this.$route.params.pid);
    let ref = db
      .collection("questions")
      .where("project_id", '==', this.$route.params.pid)
      .get()
      .then(questions => {
        questions.docs.forEach(doc => {
          let data = doc.data();
          let question = {
            id: doc.id,
            project_id: data.project_id,
            yes_id: data.yes_id,
            no_id: data.no_id,
            is_answer: data.is_answer,
            content: data.content
          };
          this.questions.push(question);
        });
      });
  },
  methods: {
    addContent() {
      if (!this.newContent) {
        this.feedback = "質問内容または答えを入力してください。";
        return;
      }
      db.collection("questions")
        .add({
          yes_id: this.selectedYesId,
          no_id: this.selectedNoId,
          is_answer: this.isAnswer,
          content: this.newContent,
          project_id: this.$route.params.pid,
          timestamp: Date.now()
        })
        .then(
          this.$router.push({
            name: "Setting",
            params: { id: this.$route.params.pid }
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
    FilterableDropdown
  }
};
</script>

<style>
.content-text {
  margin-bottom: 20px;
}
</style>
