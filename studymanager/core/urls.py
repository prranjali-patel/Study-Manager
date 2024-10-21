
from django.urls import path, include
from .views import login_page, pomodoro_page, task_manager_page, home


urlpatterns = [
  
    path('', home, name='home'),
    path('login/', login_page, name='login'),
    path('pomodoro/', pomodoro_page, name='pomodoro'),
    path('tasks/', task_manager_page, name='tasks'),
]
