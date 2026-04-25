import requests
from django.conf import settings
from .base import SongGeneratorStrategy, GenerationRequest, GenerationResult

SUNO_BASE_URL = "https://api.sunoapi.org/api/v1"

class SunoSongGeneratorStrategy(SongGeneratorStrategy):
    def __init__(self):
        self.api_key = settings.SUNO_API_KEY

    def _headers(self):
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    def generate(self, request: GenerationRequest) -> GenerationResult:
        payload = {
            "prompt": request.prompt,
            "title": request.title,
            "tags": f"{request.mood} {request.occasion} {request.singer_gender}",
            "customMode": True,
            "instrumental": False,
            "callBackUrl": "https://example.com/callback",
            "model": "V4",
        }
        try:
            response = requests.post(
                f"{SUNO_BASE_URL}/generate",
                json=payload,
                headers=self._headers(),
            )
            response.raise_for_status()
            data = response.json()
            print(f"[SUNO] Full response: {data}")
            inner = data.get("data") or {}
            task_id = inner.get("taskId") or data.get("taskId") or data.get("task_id", "")
            print(f"[SUNO] Task created: {task_id}")
            return GenerationResult(task_id=task_id, status="PENDING")
        except requests.RequestException as e:
            return GenerationResult(task_id="", status="ERROR", error=str(e))

    def get_status(self, task_id: str) -> GenerationResult:
        try:
            response = requests.get(
                f"{SUNO_BASE_URL}/generate/record-info",
                params={"taskId": task_id},
                headers=self._headers(),
            )
            response.raise_for_status()
            data = response.json()
            print(f"[SUNO] Full response: {data}")
            inner = data.get("data") or {}
            status = inner.get("status", "PENDING")
            audio_url = None
            response_data = inner.get("response") or {}
            suno_data = response_data.get("sunoData", [])
            if suno_data:
                audio_url = (
                    suno_data[0].get("audioUrl") or
                    suno_data[0].get("streamAudioUrl")
                )
                cover_image = suno_data[0].get("imageUrl")
            return GenerationResult(task_id=task_id, 
                                    status=status, 
                                    audio_url=audio_url, 
                                    cover_image=cover_image,)
        except requests.RequestException as e:
            return GenerationResult(task_id=task_id, status="ERROR", error=str(e))
