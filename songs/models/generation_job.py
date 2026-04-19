from django.db import models
from .song_generation_request import SongGenerationRequest

class GenerationJob(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('SUCCESS', 'Success'),
        ('ERROR', 'Error'),
    ]

    request = models.ForeignKey(SongGenerationRequest, on_delete=models.CASCADE)
    task_id = models.CharField(max_length=255)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='PENDING')
    audio_url = models.URLField(null=True, blank=True)
    error = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Job {self.task_id} [{self.status}]"