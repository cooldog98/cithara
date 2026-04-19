from django.conf import settings
from .base import SongGeneratorStrategy
from .mock_strategy import MockSongGeneratorStrategy
from .suno_strategy import SunoSongGeneratorStrategy

def get_generator() -> SongGeneratorStrategy:
    strategy = getattr(settings, "GENERATOR_STRATEGY", "mock").lower()
    if strategy == "suno":
        return SunoSongGeneratorStrategy()
    return MockSongGeneratorStrategy()