from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from songs.generation import get_generator, GenerationRequest
from songs.models import SongGenerationRequest, GenerationJob, Song, SongLibrary

class Command(BaseCommand):
    help = 'Generate a song'

    def handle(self, *args, **kwargs):
        generator = get_generator()
        self.stdout.write(f"Using strategy: {generator.__class__.__name__}\n")

        #get input from user
        title = input("Song title: ")
        prompt = input("Prompt (lyrics idea): ")

        print("Occasion: birthday, wedding, anniversary, graduation christmas, party, farewell")
        occasion = input("occasion: ")

        print("Mood: happy, sad, romantic, excited, calm, nostalgic, inspiraional")
        mood = input("mood: ")

        print("Singer Gender: male, female, both")
        singer_gender = input("Singer Gender: ")

        # use superUser that alrady have
        user = User.objects.first()
        if not user :
            self.stdout.write("No user found. Please create a superuser first.")
            return
        
        # save SongGenerationRequset o database
        song_request = SongGenerationRequest.objects.create(
            user=user,
            title=title,
            prompt=prompt,
            mood=mood,
            occasion=occasion,
            singer_gender=singer_gender,
        )
        self.stdout.write(f"SongGenerationRequest save (id= {song_request.id})")

        # call straturgy
        req = GenerationRequest(
            title=title,
            prompt=prompt,
            mood=mood,
            occasion=occasion,
            singer_gender=singer_gender,
        )

        result = generator.generate(req)
        self.stdout.write(f"Task ID : {result.task_id}")
        self.stdout.write(f"Status : {result.status}")
        self.stdout.write(f"Auto : {result.audio_url}")

        # save GenerationJob to database
        job = GenerationJob.objects.create(
            request=song_request,
            task_id=result.task_id,
            status=result.status,
            audio_url=result.audio_url,
        )
        self.stdout.write(f"GenerationJob saved (id= {job.id})")

        # if succes save song to database
        if result.status == 'SUCCESS':
            song = Song.objects.create(
                user=user,
                request=song_request,
                title=title,
            )
            # add to SongLibrary
            library,_ = SongLibrary.objects.get_or_create(user=user)
            library.songs.add(song)
            self.stdout.write(f"Song saved to library (id= {song.id})")
