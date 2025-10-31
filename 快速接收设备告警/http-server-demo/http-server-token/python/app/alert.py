import base64
import hashlib
import json
import secrets
import time

from flask import Blueprint, request

from app import url_prefix

bp = Blueprint('alert', __name__, url_prefix=url_prefix)


@bp.route('alert', methods=['POST'])
def post_alert():
    # 获取token
    auth_header = request.headers.get('authorization')
    print(f"Authorization Header: {auth_header}")
    data = json.loads(request.get_data().decode('utf-8'))
    image = data.pop('image')
    print(data)
    with open('image.jpg', 'wb') as f:
        f.write(base64.b64decode(image.encode('utf-8')))
    return data


@bp.route('/token', methods=['GET'])
def gen_token():
    print(request.args)
    token = secrets.token_hex(32)
    return token
