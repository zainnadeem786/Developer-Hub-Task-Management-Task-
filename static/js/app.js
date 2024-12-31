// Helper function to get CSRF token from the DOM
function getCSRFToken() {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    return csrfToken;
}

// Function to handle updating a task
function updateTask(event, taskId) {
    event.preventDefault(); // Prevent form submission

    const form = event.target;
    const formData = new FormData(form);

    fetch(`/tasks/${taskId}/update/`, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': formData.get('csrfmiddlewaretoken'),
        },
    })
    .then(response => {
        if (response.ok) {
            alert('Task updated successfully!');
            window.location.reload(); // Reload the page
        } else {
            alert('Failed to update the task. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error updating task:', error);
        alert('An error occurred while updating the task. Please try again.');
    });
}


// Function to toggle the update form visibility
function editTask(id) {
    const form = document.getElementById(`update-form-${id}`);
    form.classList.toggle('hidden');
}

// Function to handle task deletion
async function deleteTask(id) {
    // Show the delete confirmation modal
    const modal = document.getElementById('delete-confirmation-modal');
    const confirmButton = document.getElementById('confirm-delete');
    const cancelButton = document.getElementById('cancel-delete');

    modal.classList.remove('hidden');

    // When confirming delete
    confirmButton.onclick = async function () {
        try {
            const response = await fetch(`/tasks/${id}/delete/`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': getCSRFToken(), // CSRF token from the DOM
                },
            });

            const data = await response.json();

            if (data.success) {
                alert('Task deleted successfully!');
                window.location.reload(); // Reload the page
            } else {
                alert('Error deleting task');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while deleting the task');
        }

        // Close the modal after confirmation
        modal.classList.add('hidden');
    };

    // When cancelling delete
    cancelButton.onclick = function () {
        modal.classList.add('hidden');
    };
}


// Add event listeners to the update and delete buttons
document.addEventListener('DOMContentLoaded', function() {
    // Attach the event listener for update buttons
    const updateButtons = document.querySelectorAll('.update-btn');
    updateButtons.forEach(button => {
        button.addEventListener('click', function() {
            const taskId = button.getAttribute('data-id');
            document.getElementById(`update-form-${taskId}`).classList.remove('hidden');
        });
    });

    // Attach event listener for delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const taskId = button.getAttribute('data-id');
            showDeleteConfirmation(taskId); // Show delete confirmation modal
        });
    });

    // Attach event listeners for task update forms
    const updateForms = document.querySelectorAll('.update-task-form');
    updateForms.forEach(form => {
        form.addEventListener('submit', function(event) {
            const taskId = form.getAttribute('data-id');
            updateTask(event, taskId); // Handle task update
        });
    });
});
function updateProgressBar() {
    fetch('/task-progress/') // Replace with your task progress endpoint
        .then(response => response.json())
        .then(data => {
            const progressBar = document.getElementById('progress-bar');
            const progressText = document.getElementById('progress-text');
            
            if (progressBar && progressText) {
                const progressPercentage = data.progress_percentage;
                progressBar.style.width = `${progressPercentage}%`;
                progressText.textContent = `Progress: ${Math.round(progressPercentage)}%`;
            }
        })
        .catch(error => console.error('Error fetching progress:', error));
}

// Update progress every 5 seconds
setInterval(updateProgressBar, 5000);

// Initial call to set progress when the page loads
updateProgressBar();

