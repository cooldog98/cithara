from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional

@dataclass
class GenerationRequest:
    title: str
    prompt: str
    mood: str
    occasion: str
    singer_gender: str

@dataclass
class GenerationResult:
    task_id: str
    status: str
    audio_url: Optional[str] = None
    cover_image: Optional[str] = None
    error: Optional[str] = None

class SongGeneratorStrategy(ABC):
    @abstractmethod
    def generate(self, request: GenerationRequest) -> GenerationResult:
        pass

    @abstractmethod
    def get_status(self, task_id: str) -> GenerationResult:
        pass