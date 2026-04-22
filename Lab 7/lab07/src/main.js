import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' // import router configuration

// import bootstrap css and js
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// create app using router
createApp(App).use(router).mount('#app')
