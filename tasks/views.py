from rest_framework import generics
from .models import Task
from .serializers import TaskSerializer
from django.http import HttpResponse

from django.shortcuts import render

def home(request):
    return render(request, 'tasks/index.html')  # Path matches the template location


# List and Create tasks
class TaskListView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

# Retrieve, update, and delete a single task
class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
