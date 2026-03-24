from django.db import models
from django.contrib.auth.models import User

class SongLibrary(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    songs = models.ManyToManyField('Song', blank=True)

    def __str__(self):
        return f"{self.user.username}'s Library"