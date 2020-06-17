import { createRouter, createWebHistory } from 'vue-router'
import Button from '../views/Button.vue'

const routes = [
  {
    path: '/',
    name: 'button',
    component: Button
  },
  {
    path: '/layout',
    name: 'Layout',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Layout.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
