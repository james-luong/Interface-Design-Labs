import JobList from './JobList.js';
import ToDoList from './ToDoList.js';

export default {
    template: `
        <div class="container py-4">
            <h1 class="mb-4">Insight Hire</h1>
            
            <h3 class="mb-3">Job Explorer</h3>
            <div class="row">
                <div class="col-md-3">
                    <JobList />
                </div>
                <div class="col-md-9">
                    <router-view></router-view>
                </div>
            </div>

            <hr class="my-5">
            
            <ToDoList />
        </div>
    `,
    components: {
        JobList,
        ToDoList
    }
};