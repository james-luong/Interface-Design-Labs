import { jobs } from '../jobs.js';

export default {
    template: `
        <div class="p-4 border rounded shadow-sm border-success h-100" v-if="job">
            <h4 class="mb-3">{{ job.job_title }} ({{ job.job_id }})</h4>
            <p><strong>Company:</strong> {{ job.company }}</p>
            <p><strong>Location:</strong> {{ job.location }}</p>
            <p><strong>Category:</strong> {{ job.category }}</p>
            <p><strong>Employment Type:</strong> {{ job.employment_type }}</p>
            <p><strong>Salary Range:</strong> {{ job.salary_range }}</p>
            <p><strong>Job Level:</strong> {{ job.job_level }}</p>
            <p><strong>Required Skills:</strong> {{ job.required_skills.join(', ') }}</p>
            <p><strong>Preferred Qualifications:</strong> {{ job.preferred_qualifications.join(', ') }}</p>
            <p><strong>Description:</strong> {{ job.job_description }}</p>
            <p><strong>Application Deadline:</strong> {{ job.application_deadline }}</p>
            <p><strong>Posted Date:</strong> {{ job.posted_date }}</p>
            <p><strong>Supervisor:</strong> {{ job.supervisor }}</p>
            <p><strong>Positions Available:</strong> {{ job.positions_available }}</p>
            <p><strong>Start Date:</strong> {{ job.start_date }}</p>
        </div>
        <div v-else>
            <p>Job not found.</p>
        </div>
    `,
    computed: {
        job() {
            const jobId = this.$route.params.id;
            return jobs.find(j => j.job_id === jobId);
        }
    }
};