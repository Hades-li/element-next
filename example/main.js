import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ele from 'src/index'
import 'src/theme-chalk/src/index.scss'
createApp(App)
  .use(router)
  .use(store)
  .use(ele, {
    size: 'small'
  })
  .mount('#app')
