from django.db import models
from django.contrib.auth.models import User
from .song_library import SongLibrary
from .song_generation_request import SongGenerationRequest

class Song(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    request = models.OneToOneField(SongGenerationRequest, on_delete=models.CASCADE)

    title = models.CharField(max_length=255)
    duration = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title