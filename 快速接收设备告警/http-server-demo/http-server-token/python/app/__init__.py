import os
import sys

from flask import Flask

CURRENT_PATH = os.path.dirname(os.path.realpath(__file__))
sys.path.append(CURRENT_PATH)

url_prefix = '/'

from app import alert


def create_app():
    # 初始化Flask对象
    app_ = Flask(__name__)

    # 注册蓝图
    app_.register_blueprint(alert.bp)
    return app_


app = create_app()
