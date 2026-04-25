import uuid
from .base import SongGeneratorStrategy, GenerationRequest, GenerationResult

class MockSongGeneratorStrategy(SongGeneratorStrategy):
    def generate(self, request: GenerationRequest) -> GenerationResult:
        fake_task_id = f"mock-{uuid.uuid4()}"
        print(f"[MOCK] Generating song: '{request.title}' | mood={request.mood}")
        return GenerationResult(
            task_id=fake_task_id,
            status="SUCCESS",
            audio_url="http://127.0.0.1:8000/media/songs/songformock/mock_song.mp3",
        )

    def get_status(self, task_id: str) -> GenerationResult:
        print(f"[MOCK] Checking status for task: {task_id}")
        return GenerationResult(
            task_id=task_id,
            status="SUCCESS",
            audio_url="http://127.0.0.1:8000/media/songs/songformock/mock_song.mp3",
        )