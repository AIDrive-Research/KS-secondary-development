## Overview

The `Api` class is a utility class for handling detection alert information and alert videos.


[api_demo.py](api_demo.py) provides the default implementation.

[api_demo_tcp.py](api_demo_tcp.py)implements a simple TCP communication. If you need automatic reconnection, queues, or other business logic, you need to implement them yourself.

The class name, method names, and framework are fixed and **cannot be modified**. You can implement the specific logic in the callback methods (e.g., `send_alert_callback` and `send_alert_video_callback`) and configure class properties (e.g., `ignore_alert`) to achieve your desired functionality.


## Class Properties

The `Api` class **must** include the following main properties to control its behavior:

| Property Name        | Default | Description                                                     |
| :------------------ | :------ | :-------------------------------------------------------------- |
| `ignore_alert`       | `True`  | Whether to send alert information. `True` = do not send, `False` = send. |
| `draw_image`         | `True`  | Whether to draw alert information on the alert image. `True` = draw, `False` = do not draw. |
| `ignore_alert_video` | `True`  | Whether to send alert videos. `True` = do not send, `False` = send. |


## Class Methods

The `Api` class **must** include the following two methods to send alert information and alert videos. You can implement the callback logic as needed.


### 1. Alert Information

- **Method**：send_alert_callback(self, alert)

- **Function**：Sends alert information

- **Parameter**：

  - `alert`:content of the alert. Format example:

- **Example:**：

  ```json
  {
      "id": "67dbcd3c5dc58a7aaa019e41",  //告警id
      "alert_time": 1742458171.808598, //告警时间戳
      "device": {
          "id": "设备id",
          "name": "设备名称",
          "desc": "设备描述"
      },
      "source": {
          "id": "数据源id",
          "ipv4": "ip地址", 
          "desc": "数据源描述"
      },
      "alg": {
          "name": "算法名称英文",
          "display_name": "算法名称中文",
          "type": "general"
      },
      "hazard_level": "", //危险等级
      "image": "img_base64", //base64编码的图片数据
      "reserved_data": {
          "bbox": {
              "rectangles": [
                  {
                      "xyxy": [668,560,790,656], //左上角、右下角坐标
                      "color": [0,0,255], //BGR颜色
                      "label": "未佩戴安全帽", //标签
                      "conf": 0.91, //置信度
                      "ext": {} //扩展字段
                  }
              ],
              "polygons": {},//多边形对象
              "lines": {}  //线段对象
          },
          "custom": {}
      }
  }
  ```

### 2. 告警视频

- **Method**：send_alert_video_callback(self, alert_video):

- **Function**：发送告警视频。

- **Parameter**：

  - `alert_video`:content of the alert video. Format example:

- **Example**：

  ```json
  {
      "id": "67dbcd3c5dc58a7aaa019e41", //告警id
      "alert_time": 1742458171.808598, //告警时间戳
      "device": {
          "id": "设备id",
          "name": "设备名称",
          "desc": "设备描述"
      },
      "source": {
          "id": "数据源id",
          "ipv4": "ip地址",
          "desc": "数据源描述"
      },
      "alg": {
          "name": "算法名称英文",
          "display_name": "算法名称中文",
          "type": "general"
      },
      "hazard_level": "", // 危险等级
      "video": "video_base64" //base64编码的视频数据
  }
  ```

## Notes

1. **Property Configuration**: Before calling the send methods, make sure the class properties are correctly set to enable or disable the desired features.  
2. **Method Implementation**: By default, `send_alert_callback` and `send_alert_video_callback` are empty methods. In actual use, you need to implement their logic according to your requirements, for example, sending the data to a server.
