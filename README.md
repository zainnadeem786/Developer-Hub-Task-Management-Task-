# Task Management System

A modern Task Management System built with **Django**, designed to help users organize their tasks effectively. This software incorporates features such as task creation, authentication, progress tracking, filtering, and a user-friendly interface.



## Features

### 1. **Authentication System**
- **User Registration**: New users can register by providing a username, email, and password.
- **Login/Logout**: Secure user login and logout functionality.
- **Session Management**: Ensures that authenticated users can securely access their tasks.

### 2. **Task Management**
- **CRUD Operations**: Users can create, read, update, and delete tasks.
- **Task Fields**:
  - Title
  - Description (optional)
  - Status: Pending, In Progress, Completed
  - Due Date
- **Progress Bar**: Displays task completion status visually.

### 3. **Search and Filters**
- **Search**: Users can search for tasks by title.
- **Filters**: Filter tasks based on:
  - Status (Pending, In Progress, Completed)
  - Due Date (Upcoming, Overdue)

### 4. **Dynamic Dashboard**
- Displays user-specific tasks and their progress.
- Highlights overdue tasks in red for better visibility.

### 5. **Responsive UI**
- Built with **Tailwind CSS** for a clean and modern design.
- Mobile-friendly interface ensures accessibility across all devices.

### 6. **Database Integration**
- **SQLite** is used as the default database.
- Stores user credentials securely using Django's authentication system.
- Task data is managed efficiently using Django ORM.

---

## API Endpoints

### Authentication Endpoints
| Endpoint            | Method | Description                          |
|---------------------|--------|--------------------------------------|
| `/api/register/`    | POST   | Registers a new user.               |
| `/api/login/`       | POST   | Authenticates a user and returns a token. |
| `/api/logout/`      | POST   | Logs out the user.                  |

### Task Endpoints
| Endpoint              | Method | Description                          |
|-----------------------|--------|--------------------------------------|
| `/api/tasks/`         | GET    | Fetch all tasks for the logged-in user. |
| `/api/tasks/`         | POST   | Create a new task.                  |
| `/api/tasks/<id>/`    | GET    | Fetch details of a specific task.   |
| `/api/tasks/<id>/`    | PUT    | Update a specific task.             |
| `/api/tasks/<id>/`    | DELETE | Delete a specific task.             |

### Search and Filter Endpoints
| Endpoint                     | Method | Description                         |
|------------------------------|--------|-------------------------------------|
| `/api/tasks/search/?q=`      | GET    | Search tasks by title.              |
| `/api/tasks/filter/?status=` | GET    | Filter tasks by status.             |
| `/api/tasks/filter/?date=`   | GET    | Filter tasks by due date.           |

---

## Installation

### Prerequisites
- Python 3.9 or higher
- Django 4.2 or higher
- Node.js and npm (optional, for frontend customization)

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/zainnadeem786/Developer-Hub-Task-Management-Task-.git
   cd task-management


2. Create a virtual environment:
  python -m venv .venv
  source .venv/bin/activate  # On Windows: .venv\Scripts\activate

3.  Install dependencies:
  
  pip install -r req.txt

4. Apply migrations:
   
   python manage.py makemigrations
   python manage.py migrate

5. Start the development server:
   
   python manage.py runserver


  ## Usage


  **Authentication**


   Register and log in to access the dashboard.
   Once logged in, users can create, manage, and track their tasks.


  ## Task Operations


  Add a task with a title, description, status, and due date.
  Update the status as the task progresses.
  Delete tasks when they are no longer needed.


  ## Search and Filter


  Use the search bar to quickly find tasks by title.
  Filter tasks by status or due date to manage priorities effectively.


  ## Technologies Used


  Backend: Python, Javascript, Django
  Frontend: HTML, CSS, Javascript, Tailwind CSS
  Database: SQLite (default)
  Authentication: Django's built-in authentication system
  API Development: Django REST Framework


 ## Contribution

  Feel free to fork this repository and create pull requests for any feature improvements or bug fixes. Let's build a better task management system together!

  
This version includes:
- **Task Sharing and Notifications**: Details about the endpoints and notifications when tasks are updated or shared.
- **Admin Dashboard**: Admins have access to an analytics dashboard, which includes task statistics and graphical trends.
- **Graphical Analytics**: Tasks trends and other analytics are visualized using a graphical interface.

