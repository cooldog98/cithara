from django.urls import path
from .views import song_list

urlpatterns = [
    path('songs/', song_list, name='song_list'),
]