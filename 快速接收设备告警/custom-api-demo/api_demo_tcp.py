import json
import socket
# 导入日志
from logger import LOGGER


class Api:
    """
    API类，实现最简单的tcp通讯，如果需要自动重连，队列等业务代码请自行实现
    """
    def __init__(self):
        """
        Attributes:
            self.ignore_result: 为True时，不发送检测结果，为False则发送检测结果
            self.ignore_alert: 为True时，不发送告警信息，为False则发送告警信息
            self.draw_image: 为True时，告警图片会画上告警信息，为False则不画
            self.ignore_alert_video: 为True时，不发送告警视频，为False则发送
        """
        self.ignore_result = True
        self.ignore_alert = False
        self.draw_image = True
        self.ignore_alert_video = True

    def send_result_callback(self, result):
        """
        发送检测结果回调函数
        Args:
            result: 检测结果数据
        Returns:
        """
        pass

    def send_alert_callback(self, alert):
        """
        发送告警信息回调函数
        Args:
            alert: 告警数据
        Returns:
        """

        try:
            LOGGER.info('发送TCP告警')
            # 创建TCP socket
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                # 连接到目标服务器（这里用示例地址和端口）
                s.connect(('192.168.0.4', 10001))

                # 为了方便查看日志，去掉base64编码图片
                alert.pop('image')

                json_data = json.dumps(alert, ensure_ascii=False)
                data = json_data.encode('utf-8')

                # 发送完整数据
                s.sendall(data)

                LOGGER.info(f'告警已发送至TCP服务器: {data}')
        except Exception as e:
            LOGGER.error(f'发送TCP告警失败: {str(e)}')

    def send_alert_video_callback(self, alert_video):
        """
        发送告警视频回调函数
        Args:
            alert_video: 告警视频数据
        Returns:
        """
        pass
