from django.shortcuts import render

# Create your views here.

# Home page view
def home(request):

    return render(request, 'home.html')

# Login page view
def login_page(request):
    return render(request, 'login.html' )

# Pomodoro page view
def pomodoro_page(request):
    return render(request, 'pomodoro.html')

# Task Manager page view
def task_manager_page(request):
    return render(request, 'task.html')
