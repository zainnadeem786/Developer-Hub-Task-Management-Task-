# Task Management System

A modern Task Management System built with **Django**, designed to help users organize their tasks effectively. This software incorporates features such as task creation, authentication, progress tracking, filtering, task sharing with notifications, graphical analytics, and an admin-only analytics dashboard.

---

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
- **Task File/Images**: Optionally upload files or images related to tasks.

### 3. **Task Sharing and Notifications**
- **Share Tasks**: Users can share tasks with other users, making collaboration easy.
- **Task Notifications**: Users receive real-time notifications when tasks are updated, assigned to them, or shared with them.

### 4. **Search and Filters**
- **Search**: Users can search for tasks by title.
- **Filters**: Filter tasks based on:
  - Status (Pending, In Progress, Completed)
  - Due Date (Upcoming, Overdue)

### 5. **Admin Dashboard with Graphical Analytics**
- **Admin Access Only**: Only admin users can access the analytics dashboard.
- **Task Overview**: The dashboard displays:
  - Total tasks
  - Completed tasks
  - Pending tasks
  - In-progress tasks
- **Task Status Breakdown**: A pie chart showing the distribution of task statuses (Pending, In Progress, Completed).
- **Weekly Trends**: A line graph showing task trends (e.g., new tasks, completed tasks) over the last few weeks.
- **Visual Analytics**: Includes graphical representations of task performance and user engagement.

### 6. **Responsive UI**
- Built with **Tailwind CSS** for a clean and modern design.
- Mobile-friendly interface ensures accessibility across all devices.

### 7. **Database Integration**
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

### Task Sharing Endpoints
| Endpoint              | Method | Description                          |
|-----------------------|--------|--------------------------------------|
| `/api/tasks/share/`   | POST   | Share a task with another user.     |
| `/api/tasks/notify/`  | POST   | Send notifications when a task is updated. |

### Admin Dashboard Endpoints (Admin Only)
| Endpoint                     | Method | Description                         |
|------------------------------|--------|-------------------------------------|
| `/api/admin/analytics/`      | GET    | Fetch the admin dashboard data including task statistics, status breakdown, and trends. |
| `/api/admin/weekly-trends/`  | GET    | Fetch task trends for the last 7 days (graphical data). |

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
