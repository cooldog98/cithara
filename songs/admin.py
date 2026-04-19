from django.contrib import admin
from .models import Song, SongGenerationRequest, SongLibrary, ShareLink, GenerationJob

# Library Admin
class SongLibraryAdmin(admin.ModelAdmin):
    filter_horizontal = ('songs',)


# Song Admin
class SongAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'formatted_date')
    ordering = ('-created_at',)

    def formatted_date(self, obj):
        return obj.created_at.strftime("%d/%m/%Y %H:%M")

    formatted_date.short_description = 'Created At'


# Request Admin
class SongGenerationRequestAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'formatted_date')
    ordering = ('-created_at',) #sort song new create อยุ่บนสุด

    def formatted_date(self, obj):
        return obj.created_at.strftime("%d/%m/%Y %H:%M")

    formatted_date.short_description = 'Created At'

# Generation Job Admin
class GenerationJobAdmin(admin.ModelAdmin):
    list_display = ('task_id', 'status', 'audio_url', 'created_at')
    ordering = ('-created_at',)

# Register Models
admin.site.register(SongLibrary, SongLibraryAdmin)
admin.site.register(Song, SongAdmin)
admin.site.register(SongGenerationRequest, SongGenerationRequestAdmin)
admin.site.register(ShareLink)
admin.site.register(GenerationJob, GenerationJobAdmin)