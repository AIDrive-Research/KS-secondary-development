class Api:
    def __init__(self):
        """
        Attributes:
            self.ignore_result: 为True时，不发送检测结果，为False则发送检测结果
            self.ignore_alert: 为True时，不发送告警信息，为False则发送告警信息
            self.draw_image: 为True时，告警图片会画上告警信息，为False则不画
            self.ignore_alert_video: 为True时，不发送告警视频，为False则发送
        """
        self.ignore_result = True
        self.ignore_alert = True
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
        pass

    def send_alert_video_callback(self, alert_video):
        """
        发送告警视频回调函数
        Args:
            alert_video: 告警视频数据
        Returns:
        """
        pass
