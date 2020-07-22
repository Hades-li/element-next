import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import element from 'src/index'
import './assets/css/normalize.css'
import 'src/theme-chalk/src/index.scss'
import './assets/css/common.scss'

const app = createApp(App)

app.use(router)
  .use(store)
  .use(element)
  .mount('#app')

app.config.devtools = process.env.NODE_ENV === 'development'

