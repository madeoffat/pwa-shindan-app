<template>
  <div class="container">
    <div class="project-form">
      <v-flex>
        <v-text-field label="プロジェクト名" v-model="name" @input="edit"></v-text-field>
      </v-flex>
      <v-btn class="white--text" :class='{disabled: !isEdited}' color="indigo" @click="addProject">追加</v-btn>
    </div>
    <v-list subheader>
      <p v-if="feedback" class="red-text">{{ feedback }}</p>
      <v-subheader>プロジェクト</v-subheader>
      <v-list-tile
        v-for="project in projects"
        :key="project.name"
        @click="goQuestion(project.id, project.firstQuestionId)"
      >
        <v-list-tile-content>
          <v-list-tile-title v-html="project.name"></v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn icon ripple @click="goSetting(project.id, project.firstQuestionId)">
            <v-icon>build</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>
      <v-divider></v-divider>
    </v-list>
  </div>
</template>
<script>
import db from "@/firebase/init";
import firebase from "firebase";

export default {
  data() {
    return {
      text: "Home",
      isEdited: false,
      name: undefined,
      projects: [],
      feedback: undefined
    };
  },
  created() {
    let userId = firebase.auth().currentUser.uid;
    let ref = db.collection("projects").where("user_id", "==", userId);
    ref.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type == "added") {
          let doc = change.doc;
          let data = doc.data();
          this.projects.push({
            id: doc.id,
            name: data.name,
            user_id: userId,
            firstQuestionId: data.first_q_id
          });
          this.name = undefined;
        }
      });
    });
  },
  methods: {
    edit() {
      isEdited = true
    },
    goSetting(id, firstQuestionId) {
      this.$router.push({
        name: "Setting",
        params: { id: id, firstQuestionId: firstQuestionId }
      });
    },
    goQuestion(projectId, firstQuestionId) {
      let isAnswerSet = false;
      let ref = db
        .collection("questions")
        .where("project_id", "==", projectId)
        .where("is_answer", "==", true)
        .get()
        .then(questions => {
          if (questions.empty) {
            this.feedback = "解答が設定されていません。";
            return;
          }
        });
      if (!isAnswerSet) {
      }
      this.$router.push({ name: "Question", params: { id: firstQuestionId } });
    },
    addProject() {
      if (!this.name) {
        return;
      }
      db.collection("projects")
        .add({
          name: this.name,
          user_id: firebase.auth().currentUser.uid,
          timestamp: Date.now()
        })
        .then(this.$router.push({ name: "Home" }))
        .catch(err => {
          console.error(err);
        });
    },
    start(firstQuestionId) {
      this.$router.push({ name: "Question", params: { id: firstQuestionId } });
    }
  }
};
</script>
<style scoped>
.container {
  margin-top: 20px;
  background-color: white;
  align-items: center;
  justify-content: center;
  flex: 1;
}
.text-color-primary {
  color: blue;
}
.project-form {
  display: flex;
  justify-content: space-between;
}
.red-text {
  color: red;
}
</style>