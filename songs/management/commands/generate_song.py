from django.core.management.base import BaseCommand
from songs.generation import get_generator, GenerationRequest

class Command(BaseCommand):
    help = 'Demo song generation'

    def handle(self, *args, **kwargs):
        generator = get_generator()
        self.stdout.write(f"Using strategy: {generator.__class__.__name__}")

        req = GenerationRequest(
            title="My Test Song",
            prompt="A happy birthday song for a friend",
            mood="happy",
            occasion="birthday",
            singer_gender="female",
        )

        result = generator.generate(req)
        self.stdout.write(f"Task ID : {result.task_id}")
        self.stdout.write(f"Status  : {result.status}")
        self.stdout.write(f"Audio   : {result.audio_url}")

        if result.task_id:
            status = generator.get_status(result.task_id)
            self.stdout.write(f"Polled status: {status.status}")