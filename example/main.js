import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ele from 'src/index'
import './assets/css/normalize.css'
import 'src/theme-chalk/src/index.scss'
import './assets/css/common.scss'
createApp(App)
  .use(router)
  .use(store)
  .use(ele)
  .mount('#app')
