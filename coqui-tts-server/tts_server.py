from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from TTS.api import TTS
from pydantic import BaseModel
import uvicorn
import os

app = FastAPI()

tts = TTS(model_name="tts_models/multilingual/multi-dataset/your_tts", progress_bar=False, gpu=False)

class TTSRequest(BaseModel):
    text: str

@app.post("/tts")
async def generate_tts(request: TTSRequest):
    text = request.text
    output_path = "output.wav"

    try:
        # Generate TTS output
        tts.tts_to_file(
            text=text,
            speaker=tts.speakers[0],
            language="en",
            file_path=output_path
        )

        # Check if the file was created and is not empty
        if not os.path.exists(output_path) or os.path.getsize(output_path) == 0:
            raise HTTPException(status_code=500, detail="TTS failed or file is empty.")

        return StreamingResponse(open(output_path, "rb"), media_type="audio/wav")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=5005)
