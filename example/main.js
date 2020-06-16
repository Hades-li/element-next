import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ele from 'src/index'
import 'src/theme-chalk/lib/index.css'
createApp(App)
  .use(router)
  .use(store)
  .use(ele)
  .mount('#app')
