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

// Helper function to get CSRF token from the DOM
function getCSRFToken() {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    return csrfToken;
}

// Function to share a task with other users
function shareTask(event, taskId) {
    event.preventDefault(); // Prevent form submission

    const form = event.target;
    const formData = new FormData(form);
    const usernames = formData.get('shared_with').split(','); // Assuming comma-separated usernames input

    fetch(`/api/tasks/${taskId}/share/`, {
        method: 'PUT',
        headers: {
            'X-CSRFToken': getCSRFToken(),  // CSRF token
            'Content-Type': 'application/json', // Ensure the server handles JSON
        },
        body: JSON.stringify({ shared_with: usernames }), // Send usernames as a list
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Task shared successfully!');
            window.location.reload(); // Reload the page
        } else {
            alert('Failed to share the task: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error sharing task:', error);
        alert('An error occurred while sharing the task. Please try again.');
    });
}

// Attach event listeners to share buttons
document.addEventListener('DOMContentLoaded', function() {
    // Attach event listeners to share buttons
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const taskId = button.getAttribute('data-id');
            const form = document.getElementById(`share-form-${taskId}`);
            shareTask(event, taskId); // Handle task sharing
        });
    });
});

// Share Task Function (Updated for GET Request)
function shareTask(taskId) {
    let username = prompt("Enter the username to share the task with:");
    if (username) {
        // Make a GET request to share the task
        fetch(`/share-task/${taskId}/?username=${encodeURIComponent(username)}`, {
            method: 'GET',
            headers: {
                'X-CSRFToken': getCSRFToken(), // Pass CSRF token in the request headers
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Successfully shared the task with the user
                alert('Task shared successfully with ' + username);
                
                // Update the shared users list on the frontend
                let sharedWithList = document.getElementById('task-' + taskId).querySelector('.shared-with');
                sharedWithList.innerHTML = ''; // Clear the current list
                data.shared_with.forEach(user => {
                    let userSpan = document.createElement('span');
                    userSpan.classList.add('text-teal-600');
                    userSpan.textContent = user.username;
                    sharedWithList.appendChild(userSpan);
                    sharedWithList.appendChild(document.createTextNode(', ')); // Add comma between users
                });
                
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Something went wrong. Please try again.');
        });
    }
}

// Function to get CSRF token from cookie
function getCSRFToken() {
    let csrfToken = null;
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith('csrftoken=')) {
            csrfToken = cookie.substring('csrftoken='.length, cookie.length);
            break;
        }
    }
    return csrfToken;
}

fetch(`/tasks/share-task/${taskId}/?username=${encodeURIComponent(username)}`, {
    method: 'GET',
    headers: {
        'X-CSRFToken': getCSRFToken(),
    }
})



async function fetchNotifications() {
    try {
      const response = await fetch("/notifications/"); // URL to fetch notifications
      const data = await response.json();

      if (data.status === "success") {
        const notificationList = document.getElementById("notification-list");
        notificationList.innerHTML = "";

        data.notifications.forEach((notification) => {
          const notificationItem = document.createElement("div");
          notificationItem.className = "p-4 bg-gray-100 rounded-md shadow";

          notificationItem.innerHTML = `
            <p class="text-sm text-gray-700">${notification.message}</p>
            <div class="flex justify-between items-center mt-2">
              <span class="text-xs text-gray-500">${notification.timestamp}</span>
              ${
                notification.is_read
                  ? `<span class="text-green-500 text-xs">Read</span>`
                  : `<button onclick="markAsRead(${notification.id})" 
                          class="text-blue-500 text-xs hover:underline">Mark as Read</button>`
              }
            </div>
          `;

          notificationList.appendChild(notificationItem);
        });

        document.getElementById("notification-popup").classList.remove("hidden");
      } else {
        alert("Failed to fetch notifications.");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }

  async function markAsRead(notificationId) {
    try {
      const response = await fetch(`/notifications/${notificationId}/mark-as-read/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"), // Ensure CSRF token for POST request
        },
      });

      const data = await response.json();

      if (data.status === "success") {
        alert("Notification marked as read.");
        fetchNotifications(); // Refresh notifications
      } else {
        alert("Failed to mark notification as read.");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }

  function closeNotifications() {
    document.getElementById("notification-popup").classList.add("hidden");
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }