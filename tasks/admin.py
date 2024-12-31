from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'due_date')  # Columns shown in the admin list view
    list_filter = ('status', 'due_date')  # Add filters for easier searching
    search_fields = ('title', 'description')  # Enable search by title and description
