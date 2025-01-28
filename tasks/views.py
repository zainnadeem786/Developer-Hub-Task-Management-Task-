from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from .serializers import TaskSerializer
from .forms import TaskForm
from .models import Task
from datetime import datetime
from rest_framework import generics
from django.contrib.auth import get_user_model
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Task, Notification
from django.views.decorators.csrf import csrf_exempt




# Task Views
class TaskListCreateView(LoginRequiredMixin, generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    login_url = '/login/'  # Redirect to login page if not authenticated

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)  # Only tasks of the logged-in user


class TaskRetrieveUpdateDeleteView(LoginRequiredMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    login_url = '/login/'  # Redirect to login page if not authenticated

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)  # Only tasks of the logged-in user


def task_create(request):
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            task = form.save(commit=False)
            task.user = request.user  # Associate the task with the logged-in user
            task.save()
            return redirect('task-list')  # Redirect to the task list page after submitting
    else:
        form = TaskForm()

    return render(request, 'tasks/task_form.html', {'form': form})


@login_required(login_url='/login/')
def task_list(request):
    search_query = request.GET.get('search', '')
    status_filter = request.GET.get('status', '')

    # Start with only the tasks belonging to the logged-in user
    tasks = Task.objects.filter(user=request.user)

    # Search by title or description
    if search_query:
        tasks = tasks.filter(title__icontains=search_query) | tasks.filter(description__icontains=search_query)
    
    # Filter by status
    if status_filter:
        tasks = Task.objects.filter(user=request.user, status=status_filter)  # Filter tasks by the logged-in user and status

    # Calculate the percentage of completed tasks
    completed_tasks = tasks.filter(status='COMPLETED').count()
    total_tasks = tasks.count()
    progress_percentage = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0

    return render(request, 'tasks/task_list.html', {
        'tasks': tasks,
        'progress_percentage': progress_percentage,
    })


@login_required(login_url='/login/')
def task_update(request, pk):
    task = get_object_or_404(Task, pk=pk, user=request.user)  # Ensure task belongs to the logged-in user

    if request.method == 'POST':
        title = request.POST.get('title')
        description = request.POST.get('description')
        status = request.POST.get('status')
        due_date_str = request.POST.get('due_date')
        
        try:
            due_date = datetime.strptime(due_date_str, '%Y-%m-%d').date()
        except ValueError:
            return JsonResponse({'success': False, 'message': 'Invalid date format'})

        task.title = title
        task.description = description
        task.status = status
        task.due_date = due_date
        task.save()

        return JsonResponse({
            'success': True,
            'title': task.title,
            'description': task.description,
            'status': task.get_status_display(),
            'due_date': task.due_date.strftime('%Y-%m-%d')
        })

    return JsonResponse({'success': False, 'message': 'Invalid request method'})


@login_required(login_url='/login/')
def task_delete(request, pk):
    task = get_object_or_404(Task, pk=pk, user=request.user)  # Ensure task belongs to the logged-in user
    if request.method == 'DELETE':
        task.delete()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False})


# User Authentication Views

def register(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']

        try:
            user = get_user_model().objects.create_user(username=username, email=email, password=password)
            return redirect('login')  # Redirect to login page after successful registration
        except Exception as e:
            return render(request, 'tasks/register.html', {'error': str(e)})

    return render(request, 'tasks/register.html')


def login_user(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('task-list')  # Redirect to task list after login
        else:
            return render(request, 'tasks/login.html', {'error': 'Invalid credentials'})

    return render(request, 'tasks/login.html')


def logout_user(request):
    logout(request)
    return redirect('login')  # Redirect to login page after logout

def task_progress(request):
    total_tasks = Task.objects.count()
    completed_tasks = Task.objects.filter(status='COMPLETED').count()

    progress_percentage = 0
    if total_tasks > 0:
        progress_percentage = (completed_tasks / total_tasks) * 100

    return JsonResponse({'progress_percentage': progress_percentage})



def share_task(request, task_id):
    if request.method == 'GET':
        try:
            # Get task and user to share it with
            task = Task.objects.get(id=task_id)
            username = request.GET.get('username')  # Get username from query parameters
            
            # Ensure the user exists
            user = User.objects.get(username=username)
            
            # Add the user to the task's shared_with field
            task.shared_with.add(user)
            task.save()

            # Create a notification for the user
            message = f"The task '{task.title}' has been shared with you from '{request.user.username}'."
            Notification.objects.create(user=user, message=message)

            # Return success response with updated shared users
            shared_users = task.shared_with.all().values('username')
            return JsonResponse({'status': 'success', 'shared_with': list(shared_users)})
        
        except Task.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Task not found'})
        except User.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'User not found'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method. Use GET.'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def shared_tasks(request):
    tasks = Task.objects.filter(shared_with=request.user)
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    # Fetch notifications for the authenticated user
    notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
    
    # Serialize notifications
    notifications_data = [{'message': notification.message, 'created_at': notification.created_at} for notification in notifications]
    
    return Response(notifications_data, status=status.HTTP_200_OK)


@login_required
def get_notifications(request):
    try:
        # Fetch notifications for the logged-in user
        notifications = Notification.objects.filter(user=request.user).order_by("-timestamp")
        
        # Check if notifications exist
        if not notifications.exists():
            return JsonResponse({"status": "success", "notifications": []})
        
        # Serialize notifications
        notifications_data = [
            {
                "id": n.id,
                "message": n.message,
                "timestamp": n.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                "is_read": n.is_read,
            }
            for n in notifications
        ]
        return JsonResponse({"status": "success", "notifications": notifications_data})
    except Exception as e:
        # Return the error message in JSON format for easier debugging
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
    
@login_required
def mark_notification_as_read(request, notification_id):
    if request.method == "POST":
        try:
            notification = Notification.objects.get(id=notification_id, user=request.user)
            notification.is_read = True
            notification.save()
            return JsonResponse({"status": "success"})
        except Notification.DoesNotExist:
            return JsonResponse({"status": "error", "message": "Notification not found"})
    return JsonResponse({"status": "error", "message": "Invalid request method"})
