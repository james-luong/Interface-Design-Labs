import { createRouter, createWebHistory } from 'vue-router'
import Task1 from '../components/Task1.vue'
import Task2 from '../components/Task2.vue'

const routes = [
  { path: '/', redirect: '/task1' }, // Redirect home to task1
  { path: '/task1', name: 'Task1', component: Task1 },
  { path: '/task2', name: 'Task2', component: Task2 }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router