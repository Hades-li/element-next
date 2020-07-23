import { createRouter, createWebHistory } from 'vue-router'
// import Button from '../views/Button.vue'
const Button = require('../views/Button')

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
    component: () => import(/* webpackChunkName: "layout" */ '../views/Layout.vue')
  },
  {
    path: '/container',
    name: 'Container',
    component: () => import(/* webpackChunkName: "container" */ '../views/Container.vue')
  },
  {
    path: '/link',
    name: 'Link',
    component: () => import(/* webpackChunkName: "link" */ '../views/Link.vue')
  },
  {
    path: '/radio',
    name: 'Radio',
    component: () => import(/* webpackChunkName: "link" */ '../views/Radio.vue')
  },
  {
    path: '/checked',
    name: 'Check',
    component: () => import(/* webpackChunkName: "link" */ '../views/Checked.vue')
  },
  {
    path: '/form',
    name: 'Form',
    component: () => import(/* webpackChunkName: "link" */ '../views/Form.vue')
  },
  {
    path: '/input',
    name: 'Input',
    component: () => import(/* webpackChunkName: "link" */ '../views/Input.vue')
  },
  {
    path: '/inputNumber',
    name: 'inputNumber',
    component: () => import(/* webpackChunkName: "link" */ '../views/InputNumber.vue')
  },
  {
    path: '/Select',
    name: 'Select',
    component: () => import('../views/Select')
  },
  {
    path: '/Tag',
    name: 'tag',
    component: () => import('../views/Tag')
  },
  /*{
    path: '/test',
    name: 'test',
    component: () => import('../views/test')
  },*/

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
