import base64
import uuid
from pathlib import Path
from fastapi import Request
from fastapi import FastAPI, Form, File, UploadFile

app = FastAPI()


@app.post("/alert")
async def post_alert(request: Request):
    try:
        data = await request.json()
        image_b64 = data.pop('image')
        image_bytes = base64.b64decode(image_b64)
        file_path = Path(f"{uuid.uuid4().hex}.jpg")
        with file_path.open("wb") as f:
            f.write(image_bytes)
    except:
        return {'error': 'Invalid  data '}
    return data


@app.post('/alert/video')
async def post_alert_video(data: str = Form(...), video: UploadFile = File(...)):
    try:
        file_name = f"{uuid.uuid4().hex}.mp4"  # 文件名
        file_path = Path.cwd() / file_name  # 当前目录
        file_bytes = await video.read()  # 视频文件字节
        file_path.write_bytes(file_bytes)  # 写入文件
        print('data', data)
    except:
        return {"error": "Invalid  data"}
    return data


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=10010, reload=True)
