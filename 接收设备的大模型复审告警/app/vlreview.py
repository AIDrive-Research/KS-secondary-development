import base64
import json

from flask import Blueprint, request

from app import url_prefix

bp = Blueprint('vlreview', __name__, url_prefix=url_prefix)


@bp.route('vlreview', methods=['POST'])
def post_alert():
    data = json.loads(request.get_data().decode('utf-8'))
    print(data)
    return data
