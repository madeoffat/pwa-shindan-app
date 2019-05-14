<template>
  <div class="container">
    <div class="new-content">
      <v-radio-group v-model="isAnswer" row>
        <v-radio label="種別：質問" v-bind:value="false"></v-radio>
        <v-radio label="種別：結果" v-bind:value="true"></v-radio>
      </v-radio-group>
      <form @submit.prevent="addContent">
        <v-flex class="content-text">
          <v-text-field label="内容" type="text" name="new-content" v-model="content"></v-text-field>
        </v-flex>
        <section v-if="!isAnswer">
          <FilterableDropdown
            :items="questions"
            v-model="selectedYesId"
            placeholder="はいと選んだ場合の次の質問または答え"
            idKey="id"
            valueKey="id"
            textKey="content"
            filterTargetKey="content"
          />
          <FilterableDropdown
            :items="questions"
            v-model="selectedNoId"
            placeholder="いいえと選んだ場合の次の質問または答え"
            idKey="id"
            valueKey="id"
            textKey="content"
            filterTargetKey="content"
          />
        </section>
        <p v-if="feedback" class="red-text">{{ feedback }}</p>
        <div class="save-button">
          <v-btn @click="back()">戻る</v-btn>
          <v-btn class="white--text" color="indigo" @click="addContent">保存</v-btn>
        </div>
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
      selectedYesId: undefined,
      selectedNoId: undefined,
      questions: [],
      feedback: null,
      id: undefined,
      content: undefined,
      projectId: undefined
    };
  },
  created() {
    //選択されてる質問を取得
    let ref = db.collection("questions");
    ref.doc(this.$route.params.id)
      .get()
      .then(doc => {
        let data = doc.data();
        this.id = doc.id;
        this.isAnswer = data.is_answer;
        this.selectedYesId = data.yes_id;
        this.selectedNoId = data.no_id;
        this.content = data.content;
        this.projectId = data.project_id;
      });
    ref.where("project_id", '==', this.$route.params.pid).get().then(questions => {
      questions.docs.forEach(doc => {
        let data = doc.data();
        if (doc.id === this.$route.params.id) {
          return;
        }
        let question = {
          id: doc.id,
          project_id: data.project_id,
          yes_id: data.yes_id,
          no_id: data.no_id,
          is_answer: data.is_answer,
          content: data.content
        };
        //idがrouteparamと同じだったら弾く
        this.questions.push(question);
      });
    });
  },
  methods: {
    addContent() {
      if (!this.content) {
        this.feedback = "質問内容または答えを入力してください。";
        return;
      }
      db.collection("questions")
        .doc(this.id)
        .update({
          yes_id: this.selectedYesId,
          no_id: this.selectedNoId,
          is_answer: this.isAnswer,
          content: this.content,
          timestamp: Date.now()
        })
        .then(
          this.$router.push({ name: "Setting", params: { id: this.projectId } })
        )
        .catch(err => {
          console.error(err);
        });
      this.newMessage = null;
      this.feedback = null;
    },
    back() {
      this.$router.go(-1)
    }
  },
  filters: {
  },
  components: {
    FilterableDropdown
  }
};
</script>

<style scoped>
.content-text {
  margin-bottom: 20px;
}
.new-content {
  margin-bottom: 30px;
}
.save-button {
  position: absolute;
  right: 10px;  
  bottom: 0px; 
}
.red-text {
  color: red;
}
</style>
