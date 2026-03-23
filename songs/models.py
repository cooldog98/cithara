from django.db import models
from django.contrib.auth.models import User
import uuid

class SongLibrary(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username}'s Library"


class SongGenerationRequest(models.Model):

    MOOD_CHOICES = [
        ('happy', 'Happy'),
        ('sad', 'Sad'),
        ('romantic', 'Romantic'),
        ('excited', 'Excited'),
        ('calm', 'Calm'),
        ('nostalgic', 'Nostalgic'),
        ('inspirational', 'Inspirational'),
    ]

    OCCASION_CHOICES = [
        ('birthday', 'Birthday'),
        ('wedding', 'Wedding'),
        ('anniversary', 'Anniversary'),
        ('graduation', 'Graduation'),
        ('christmas', 'Christmas'),
        ('party', 'Party'),
        ('farewell', 'Farewell'),
    ]

    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('both', 'Both'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)

    mood = models.CharField(max_length=50, choices=MOOD_CHOICES)
    occasion = models.CharField(max_length=50, choices=OCCASION_CHOICES)
    singer_gender = models.CharField(max_length=50, choices=GENDER_CHOICES)

    prompt = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Song(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    library = models.ForeignKey(SongLibrary, on_delete=models.CASCADE)
    request = models.OneToOneField(SongGenerationRequest, on_delete=models.CASCADE)

    title = models.CharField(max_length=255)
    duration = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class ShareLink(models.Model):
    song = models.OneToOneField(Song, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, editable=False)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return str(self.token)
