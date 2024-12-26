document.addEventListener("DOMContentLoaded", function () {
    const taskForm = document.getElementById("taskForm");
    const taskList = document.getElementById("taskList");

    // Fetch tasks and display them
    function fetchTasks() {
        axios.get("/api/tasks/")
            .then(response => {
                const tasks = response.data;
                taskList.innerHTML = "";  // Clear the task list
                tasks.forEach(task => {
                    const li = document.createElement("li");
                    li.className = "p-4 border mb-2 rounded";
                    li.innerHTML = `<strong>${task.title}</strong><br>${task.description} - ${task.status}`;
                    taskList.appendChild(li);
                });
            })
            .catch(error => console.error("Error fetching tasks:", error));
    }

    // Handle form submission to add a new task
    taskForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const taskTitle = document.getElementById("taskTitle").value;
        const taskDescription = document.getElementById("taskDescription").value;
        const taskDueDate = document.getElementById("taskDueDate").value;

        axios.post("/api/tasks/", {
            title: taskTitle,
            description: taskDescription,
            status: "Pending",
            due_date: taskDueDate,
        })
            .then(response => {
                fetchTasks();  // Refresh the task list
                taskForm.reset();  // Clear the form
            })
            .catch(error => console.error("Error adding task:", error));
    });

    fetchTasks();  // Fetch tasks when the page loads
});
