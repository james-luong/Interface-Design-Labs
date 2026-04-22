import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Travel from '../components/Travel.vue'
import About from '../components/About.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/travel', name: 'Travel', component: Travel },
  { path: '/about', name: 'About', component: About }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router