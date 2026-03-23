from django.contrib import admin
from .models import Song, SongGenerationRequest, SongLibrary, ShareLink

admin.site.register(Song)
admin.site.register(SongGenerationRequest)
admin.site.register(SongLibrary)
admin.site.register(ShareLink)
