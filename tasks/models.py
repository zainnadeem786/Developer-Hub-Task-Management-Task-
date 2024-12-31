from django.db import models
from django.contrib.auth.models import User  # Import the User model

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
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Link task to a user

    def __str__(self):
        return self.title
