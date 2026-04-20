from django.core.management.base import BaseCommand
from songs.generation import get_generator, GenerationRequest

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