import { jobs } from '../jobs.js';

export default {
    template: `
        <div class="list-group">
            <router-link to="/" class="list-group-item list-group-item-action text-primary border-0">
                Overview
            </router-link>
            <router-link 
                v-for="job in jobs" 
                :key="job.job_id" 
                :to="'/job/' + job.job_id" 
                class="list-group-item list-group-item-action text-primary border-0">
                {{ job.job_id }}
            </router-link>
        </div>
    `,
    data() {
        return {
            jobs: jobs
        };
    }
};