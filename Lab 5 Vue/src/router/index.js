import { createRouter, createWebHistory } from 'vue-router'
import JobOverview from './components/JobOverview.js';
import JobDetail from './components/JobDetail.js';

const routes = [
    { path: '/', component: JobOverview },
    { path: '/job/:id', component: JobDetail }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
