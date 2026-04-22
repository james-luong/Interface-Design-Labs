export default {
    template: `
        <div class="mt-5">
            <h3>To-Do List</h3>
            <div class="input-group mb-4">
                <input type="text" class="form-control" v-model="newTask" placeholder="Enter a new task" @keyup.enter="addTask">
                <button class="btn btn-primary" @click="addTask">Add</button>
            </div>
            
            <ul class="list-group">
                <li v-for="(task, index) in tasks" :key="index" class="list-group-item d-flex justify-content-between align-items-center mb-2 border rounded">
                    <span>{{ task.text }} <span v-if="task.priority === 'High'"> (High Priority)</span><span v-if="task.priority === 'Low'"> (Low Priority)</span></span>
                    <div>
                        <button class="btn btn-warning btn-sm me-2" @click="togglePriority(index)">
                            {{ getPriorityButtonText(task.priority) }}
                        </button>
                        <button class="btn btn-danger btn-sm" @click="deleteTask(index)">Delete</button>
                    </div>
                </li>
            </ul>
        </div>
    `,
    data() {
        return {
            newTask: '',
            tasks: [
                { text: 'Update resume and LinkedIn profile', priority: 'High' },
                { text: 'Review AI Research Assistant job description', priority: 'Low' },
                { text: 'Submit job application form for Insight Hire', priority: 'None' }
            ]
        };
    },
    methods: {
        addTask() {
            if (this.newTask.trim() !== '') {
                // Insert new tasks at the beginning of the array
                this.tasks.unshift({ text: this.newTask, priority: 'None' });
                this.newTask = '';
            }
        },
        deleteTask(index) {
            this.tasks.splice(index, 1); // Delete button allows users to remove the task 
        },
        togglePriority(index) {
            // Cycles between High, Low, and None 
            const currentPriority = this.tasks[index].priority;
            if (currentPriority === 'None') {
                this.tasks[index].priority = 'High';
            } else if (currentPriority === 'High') {
                this.tasks[index].priority = 'Low';
            } else {
                this.tasks[index].priority = 'None';
            }
        },
        getPriorityButtonText(priority) {
            // Button caption toggles based on current state 
            if (priority === 'None') return 'Mark as High Priority';
            if (priority === 'High') return 'Mark as Low Priority';
            return 'Remove Priority'; 
        }
    }
};