import Vue from "vue";
import Router from "vue-router";
import Home from "@/components/Home";
import Login from "@/components/auth/Login";
import Signup from "@/components/auth/Signup";

import Setting from "@/components/Setting";
import CreateQuestion from "@/components/CreateQuestion";
import EditQuestion from "@/components/EditQuestion";
import Question from "@/components/Question";
import Answer from "@/components/Answer";

import firebase from 'firebase'

Vue.use(Router);

const router =  new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/home",
      name: "Home",
      component: Home,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/signup",
      name: "Signup",
      component: Signup
    },
    {
      //id = project_id
      path: "/setting/:id",
      name: "Setting",
      component: Setting,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/create/:pid",
      name: "CreateQuestion",
      component: CreateQuestion,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/edit/:pid/:id",
      name: "EditQuestion",
      component: EditQuestion,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/question/:id",
      name: "Question",
      component: Question,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/answer/:id",
      name: "Answer",
      component: Answer,
      meta: {
        requiresAuth: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth) {
    // このルートはログインされているかどうか認証が必要です。
    // もしされていないならば、ログインページにリダイレクトします。
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        next()
      } else {
        next({
          name: 'Login',
        });
      }
    })
  } else {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        next({
          name: 'Home',
        })
      } else {
        next();
      }
    })
  }
})


export default router;