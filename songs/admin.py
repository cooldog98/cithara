from django.contrib import admin
from .models import Song, SongGenerationRequest, SongLibrary, ShareLink


# Inline: แสดงเพลงใน Library
class SongInline(admin.TabularInline):
    model = Song
    extra = 0


# Library Admin
class SongLibraryAdmin(admin.ModelAdmin):
    inlines = [SongInline]


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


# Register Models
admin.site.register(SongLibrary, SongLibraryAdmin)
admin.site.register(Song, SongAdmin)
admin.site.register(SongGenerationRequest, SongGenerationRequestAdmin)
admin.site.register(ShareLink)