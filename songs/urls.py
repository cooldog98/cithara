from django.urls import path
# from .views import song_list
from . import views

urlpatterns = [
    path('', views.song_list, name='song_list'),
    path('api/generate/', views.api_generate, name='api_generate'),
    path('api/status/<str:task_id>/', views.api_status, name='api_status'),
    path('api/songs/', views.api_songs, name='api_songs'),
    path('api/login/', views.api_login, name='api_login'),
    path('api/logout/', views.api_logout, name='api_logout'),
    path('api/register/', views.api_register, name='api_register'),
    path('api/songs/delete/<int:song_id>/', views.api_delete_song, name='api_delete_song'),
    path('api/playlists/', views.api_playlists),
    path('api/playlists/<int:playlist_id>/', views.api_playlist_detail),
    path('api/playlists/<int:playlist_id>/songs/', views.api_playlist_songs),
    path('api/songs/<int:song_id>/', views.api_song_detail),
    path('api/me/', views.api_me, name='api_me'),
]