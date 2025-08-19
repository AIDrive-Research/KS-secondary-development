import requests

from api.http import Headers as BaseHeaders
from logger import LOGGER


class Headers(BaseHeaders):
    def __init__(self):
        """
        初始化Headers类
        - `self.get_headers_url`: 获取token的URL地址，根据实际环境修改。
        - `self.timeout`: 请求超时时间，设置为5秒。
        - `interval`: 定时刷新headers的时间间隔，设置为10分钟（60秒 * 10）。
        """
        self.get_headers_url = None
        self.timeout = 5
        interval = 60 * 10
        super().__init__(interval)

    def _generate_headers(self):
        """
        生成请求头的方法，_generate_headers方法名不允许修改
        固定http请求头，authorization以及值可自定义
        :return: 请求头字典
        """
        try:

            headers = {
                'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkXXX'
            }
            return headers

        except:
            LOGGER.exception('_generate_headers')
        return None
