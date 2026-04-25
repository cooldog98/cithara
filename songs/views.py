from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
import json

from .models import Song, SongGenerationRequest, GenerationJob, SongLibrary
from .generation import get_generator, GenerationRequest
from django.contrib.auth import authenticate, login, logout
from .models import Song, SongGenerationRequest, GenerationJob, SongLibrary, Playlist


def song_list(request):
    songs = Song.objects.all()
    return render(request, 'songs/song_list.html', {'songs': songs})


@csrf_exempt
def api_generate(request):
    if request.method == 'POST':
        data = request.POST
        cover_image = request.FILES.get('cover_image')

        # ดึง user จาก username ที่ส่งมา
        username = data.get('username')
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

        title = data.get('title')
        if Song.objects.filter(user=user, title=title).exists():
            return JsonResponse({'error': 'Song title already exists'}, status=400)

        song_request = SongGenerationRequest.objects.create(
            user=user,
            title=data.get('title'),
            prompt=data.get('prompt'),
            mood=data.get('mood'),
            occasion=data.get('occasion'),
            singer_gender=data.get('singer_gender'),
        )

        generator = get_generator()
        req = GenerationRequest(
            title=data.get('title'),
            prompt=data.get('prompt'),
            mood=data.get('mood'),
            occasion=data.get('occasion'),
            singer_gender=data.get('singer_gender'),
        )

        result = generator.generate(req)

        GenerationJob.objects.create(
            request=song_request,
            task_id=result.task_id,
            status=result.status,
            audio_url=result.audio_url,
        )

        # Create the song record immediately so it appears in Library
        # while Suno is still processing (audio_url can be attached later).
        song, _ = Song.objects.get_or_create(
            request=song_request,
            defaults={
                'user': user,
                'title': data.get('title'),
                'cover_image': cover_image,
            },
        )
        library, _ = SongLibrary.objects.get_or_create(user=user)
        library.songs.add(song)

        return JsonResponse({
            'task_id': result.task_id,
            'status': result.status,
            'audio_url': result.audio_url,
        })


@csrf_exempt
def api_status(request, task_id):
    generator = get_generator()
    result = generator.get_status(task_id)
    job = GenerationJob.objects.filter(task_id=task_id).first()

    if job:
        job.status = result.status
        job.audio_url = result.audio_url
        if result.error:
            job.error = result.error
        job.save()

    if result.status == 'SUCCESS' and result.audio_url:
        if job:
            user = job.request.user
            song, _ = Song.objects.get_or_create(
                request=job.request,
                defaults={
                    'user': user,
                    'title': job.request.title,
                },
            )
            library, _ = SongLibrary.objects.get_or_create(user=user)
            library.songs.add(song)

    return JsonResponse({
        'task_id': result.task_id,
        'status': result.status,
        'audio_url': result.audio_url,
    })

@csrf_exempt
def api_songs(request):
    username = request.GET.get('username')
    if username:
        try:
            user = User.objects.get(username=username)
            songs = Song.objects.filter(user=user).order_by('-created_at')
        except User.DoesNotExist:
            return JsonResponse({'songs': []})
    else:
        songs = Song.objects.all().order_by('-created_at')
    
    data = [
        {
            'id': s.id,
            'title': s.title,
            'created_at': s.created_at.strftime('%d/%m/%Y %H:%M'),
            'cover_image': request.build_absolute_uri(s.cover_image.url) if s.cover_image else None,
            'audio_url': GenerationJob.objects.filter(
                request=s.request, status='SUCCESS'
            ).values_list('audio_url', flat=True).first(),
        }
        for s in songs
    ]
    return JsonResponse({'songs': data})

@csrf_exempt
def api_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return JsonResponse({'success': True, 'username': user.username})
        return JsonResponse({'success': False, 'error': 'Invalid username or password'}, status=401)

@csrf_exempt
def api_logout(request):
    logout(request)
    return JsonResponse({'success': True})

@csrf_exempt
def api_register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        if User.objects.filter(username=username).exists():
            return JsonResponse({'success': False, 'error': 'Username already exists'}, status=400)
        user = User.objects.create_user(username=username, password=password)
        login(request, user)
        return JsonResponse({'success': True, 'username': user.username})
    
@csrf_exempt
def api_delete_song(request, song_id):
    if request.method == 'DELETE':
        try:
            song = Song.objects.get(id=song_id)
            song.delete()
            return JsonResponse({'success': True})
        except Song.DoesNotExist:
            return JsonResponse({'success': False}, status=404)
        
@csrf_exempt
def api_playlists(request):
    username = request.GET.get('username') or request.POST.get('username')
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    
    if request.method == 'GET':
        playlists = Playlist.objects.filter(user=user)
        data = [
            {
                'id': p.id,
                'name': p.name,
                'song_count': p.songs.count(),
                'cover_image': request.build_absolute_uri(p.cover_image.url) if p.cover_image else None,
            }
            for p in playlists
        ]
        return JsonResponse({'playlists': data})
    
    if request.method == 'POST':
        data = request.POST
        cover_image = request.FILES.get('cover_image')
        name = data.get('name')
        if Playlist.objects.filter(user=user, name=name).exists():
            return JsonResponse({'error': 'Playlist name already exists'}, status=400)
        playlist = Playlist.objects.create(
            user=user,
            name=name,
            cover_image=cover_image,
        )
        return JsonResponse({'id': playlist.id, 'name': playlist.name})
    
@csrf_exempt
def api_playlist_songs(request, playlist_id):
    playlist = Playlist.objects.get(id=playlist_id)
    
    if request.method == 'POST':
        data = json.loads(request.body)
        song = Song.objects.get(id=data.get('song_id'))
        playlist.songs.add(song)
        return JsonResponse({'success': True})
    
    if request.method == 'DELETE':
        data = json.loads(request.body)
        song = Song.objects.get(id=data.get('song_id'))
        playlist.songs.remove(song)
        return JsonResponse({'success': True})
    
@csrf_exempt
def api_playlist_detail(request, playlist_id):
    try:
        playlist = Playlist.objects.get(id=playlist_id)
    except Playlist.DoesNotExist:
        return JsonResponse({'error': 'Playlist not found'}, status=404)

    if request.method == 'GET':
        songs = playlist.songs.all()
        data = {
            'id': playlist.id,
            'name': playlist.name,
            'cover_image': request.build_absolute_uri(playlist.cover_image.url) if playlist.cover_image else None,
            'songs': [
                {
                    'id': s.id,
                    'title': s.title,
                    'cover_image': request.build_absolute_uri(s.cover_image.url) if s.cover_image else None,
                    'audio_url': GenerationJob.objects.filter(
                        request=s.request, status='SUCCESS'
                    ).values_list('audio_url', flat=True).first(),
                }
                for s in songs
            ]
        }
        return JsonResponse(data)

    if request.method == 'DELETE':
        playlist.delete()
        return JsonResponse({'success': True})

@csrf_exempt
def api_song_detail(request, song_id):
    try:
        song = Song.objects.get(id=song_id)
        audio_url = GenerationJob.objects.filter(
            request=song.request, status='SUCCESS'
        ).values_list('audio_url', flat=True).first()
        return JsonResponse({
            'id': song.id,
            'title': song.title,
            'cover_image': request.build_absolute_uri(song.cover_image.url) if song.cover_image else None,
            'audio_url': audio_url,
        })
    except Song.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)

@csrf_exempt
def api_me(request):
    if request.user.is_authenticated:
        return JsonResponse({'username': request.user.username, 'authenticated': True})
    return JsonResponse({'authenticated': False}, status=401)
