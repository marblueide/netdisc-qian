import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path:"/",
    name:"home",
    redirect:"login"
  },
  {
    path:"/login",
    name:"login",
    component:() => import("../views/Login/Login.vue")
  },
  {
    path:"/pandown",
    name:"pandown",
    component:() => import("../views/Pandown/index.vue")
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
