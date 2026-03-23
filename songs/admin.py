from django.contrib import admin
from .models import Song, SongGenerationRequest, SongLibrary, ShareLink
class SongInline(admin.TabularInline):
    model = Song
    extra = 0

class SongLibraryAdmin(admin.ModelAdmin):
    inlines = [SongInline]

admin.site.register(SongLibrary, SongLibraryAdmin)
admin.site.register(Song)
admin.site.register(SongGenerationRequest)
admin.site.register(ShareLink)
