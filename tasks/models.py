from django.contrib.auth.models import User  # Import the User model
from django.db import models

class Task(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    due_date = models.DateField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')  # Owner of the task
    shared_with = models.ManyToManyField(User, related_name='shared_tasks', blank=True)  # Shared users
    created_at = models.DateTimeField(auto_now_add=True)  # Add this field
    task_file = models.FileField(upload_to='tasks/', null=True, blank=True)

    def __str__(self):
        return self.title

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.message}"

