import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import NotcieList from '@/components/notice/NotcieList'
import Info from '@/components/user/Info'
import Setting from '@/components/user/Setting'
import Notice from '@/components/notice/Notice'
import QuestionList from '@/components/question/QuestionList'
import Question from '@/components/question/Question'
import ClassIn from '@/components/ClassIn'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/welcome',
    component: Welcome,
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: Home
      },
      {
        path: '/notice',
        component: NotcieList
      },
      {
        path: '/info',
        component: Info
      },
      {
        path: '/setting',
        component: Setting
      },
      {
        name: 'notice',
        path: '/notice/:id',
        component: Notice
      },
      {
        path: '/question',
        component: QuestionList
      },
      {
        name: 'question',
        path: '/question/:id',
        component: Question
      },
      {
        name: 'classin',
        path: '/class',
        component: ClassIn
      }

    ]
  }
]

const router = new VueRouter({
  routes
})

export default router

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
