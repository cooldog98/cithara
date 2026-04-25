from django.db import models
from django.contrib.auth.models import User
from .song import Song

class Playlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    songs = models.ManyToManyField(Song, blank=True)
    cover_image = models.ImageField(upload_to='playlist_covers/', null=True, blank=True) 
    create_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name