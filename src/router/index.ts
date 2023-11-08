import { createRouter, createWebHashHistory } from "vue-router";
// import layoutRouter from './modules/dataAssets'
import layoutRouter from './layoutRouter'
import ViewUIPlus from "view-ui-plus";
const { Spin  } = <any>ViewUIPlus;
// 
const routes = [
  {
    path: '/',
    redirect: "/dataAssets"
  },
  {
    path: '/dataAssets',
    redirect: "/dataAssets/homePage"
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'login'
    },
    component: () => import('../view/login/index.vue')
  },
  ...layoutRouter
]


const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})

router.beforeEach((to, from, next) => { 
  Spin.hide()
  document.title = <string>to.meta.title
  next()
})

export default router