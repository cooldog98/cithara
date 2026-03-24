from django.db import models
import uuid
from .song import Song

class ShareLink(models.Model):
    song = models.OneToOneField(Song, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, editable=False)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return str(self.token)