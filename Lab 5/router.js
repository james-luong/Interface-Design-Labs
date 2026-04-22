import JobOverview from './components/JobOverview.js';
import JobDetail from './components/JobDetail.js';

const routes = [
    { path: '/', component: JobOverview },
    { path: '/job/:id', component: JobDetail }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
});

export default router;