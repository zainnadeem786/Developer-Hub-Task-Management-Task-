from django.urls import path
from .views import TaskListCreateView, TaskRetrieveUpdateDeleteView
from . import views
from .views import task_list, task_create, task_progress
from . import views
urlpatterns = [
    path('', views.task_list, name='task-list'),
    path('tasks/create/', views.task_create, name='task-create'),
    path('tasks/<int:pk>/update/', views.task_update, name='task-update'),
    path('tasks/<int:pk>/delete/', views.task_delete, name='task-delete'),
    path('register/', views.register, name='register'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout'),
    path('task-progress/', task_progress, name='task_progress'),
    path('share-task/<int:task_id>/', views.share_task, name='share-task'),
    path("notifications/", views.get_notifications, name="get_notifications"),
    path("notifications/<int:notification_id>/mark-as-read/", views.mark_notification_as_read, name="mark_as_read"),
]
