from django.contrib import admin
from .models import Task, Notification
from django.contrib import admin
from .models import Notification
@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'user', 'status', 'due_date')
    list_filter = ('status', 'due_date', 'user')
    search_fields = ('title', 'description', 'user__username')
    filter_horizontal = ('shared_with',)  # For the ManyToManyField

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'message', 'timestamp', 'is_read')  # Columns to display in the admin list view
    list_filter = ('is_read', 'timestamp')  # Add filtering options
    search_fields = ('user__username', 'message')  # Add search functionality
    ordering = ('-timestamp',)  # Order notifications by most recent first

