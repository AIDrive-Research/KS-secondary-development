import base64
import json

from flask import Blueprint, request

from app import url_prefix

bp = Blueprint('alert', __name__, url_prefix=url_prefix)


@bp.route('alert', methods=['POST'])
def post_alert():
    data = json.loads(request.get_data().decode('utf-8'))
    image = data.pop('image')
    print(data)
    with open('image.jpg', 'wb') as f:
        f.write(base64.b64decode(image.encode('utf-8')))
    return data


@bp.route('alert/video', methods=['POST'])
def post_alert_video():
    data = json.loads(request.get_data().decode('utf-8'))
    video = data.pop('video')
    print(data)
    with open('video.mp4', 'wb') as f:
        f.write(base64.b64decode(video.encode('utf-8')))
    return data
