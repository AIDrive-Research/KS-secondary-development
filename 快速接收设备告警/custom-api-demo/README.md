## 一、功能概述

`Api` 类是一个用于处理检测结果、告警信息和告警视频的工具类。

[api_demo.py](api_demo.py) 为原始默认实现。

[api_demo_tcp.py](api_demo_tcp.py)实现最简单的tcp通讯，如果需要自动重连，队列等业务代码请自行实现。


此类名、方法名等框架是固定的，不可修改。你可以通过实现回调方法的具体逻辑（如 `send_result_callback`、`send_alert_callback` 和 `send_alert_video_callback`）以及配置类的属性（如 `ignore_result`、`ignore_alert` 等）来实现具体功能。

## 二、类的属性

`Api` 类**必须**包含以下主要属性，用于控制其行为：

| 属性名称             | 默认值 | 描述                                                         |
| :------------------- | :----- | :----------------------------------------------------------- |
| `ignore_result`      | `True` | 是否发送检测结果。`True` 表示不发送，`False` 表示发送。      |
| `ignore_alert`       | `True` | 是否发送告警信息。`True` 表示不发送，`False` 表示发送。      |
| `draw_image`         | `True` | 是否在告警图片上绘制告警信息。`True` 表示绘制，`False` 表示不绘制。 |
| `ignore_alert_video` | `True` | 是否发送告警视频。`True` 表示不发送，`False` 表示发送。      |

## 三、类的方法

`Api` 类**必须**包含以下三个方法，用于发送检测结果、告警信息和告警视频。可根据需求实现具体的回调方法。

### 1. 检测结果

- **方法**：send_result_callback(self, result):

- **功能**：发送检测结果。

- **参数**：

  - `result`：检测结果的内容。具体格式和内容如下：

- **示例**：

  ```json
  {
      "hit": false, //是否命中
      "time": 1742458167.288579, //告警时间戳
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
          "ch_name": "算法名称中文",
          "type": "general"
      },
      "reserved_data": {
          "bbox": {
              "rectangles": [
                  {
                      "xyxy": [668,562,790,656], //左上角、右下角坐标
                      "color": [0,0,255], //BGR颜色
                      "label": "未佩戴安全帽", //标签
                      "conf": 0.91, //置信度
                      "ext": {} //扩展字段
                  }
              ],
              "polygons": {}, //多边形对象
              "lines": {}  //线段对象
          },
          "custom": {}
      },
      "hazard_level": "", //危险等级
  }
  ```

### 2. 告警信息

- **方法**：send_alert_callback(self, alert)

- **功能**：发送告警信息。

- **参数**：

  - `alert`：告警信息的内容。具体格式和内容如下：

- **示例**：

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
          "ch_name": "算法名称中文",
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

### 3. 告警视频

- **方法**：send_alert_video_callback(self, alert_video):

- **功能**：发送告警视频。

- **参数**：

  - `alert_video`：告警视频的内容。具体格式和内容如下：

- **示例**：

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
          "ch_name": "算法名称中文",
          "type": "general"
      },
      "hazard_level": "", //危险等级
      "video": "video_base64" //base64编码的视频数据
  }
  ```

## 四、注意事项

1. **属性配置**：在调用发送方法之前，确保已经正确配置了类的属性，以启用或禁用所需的功能。
2. **方法实现**：默认情况下，`send_result_callback`、`send_alert_callback` 和 `send_alert_video_callback` 方法是空方法。在实际使用中，需要根据具体需求实现这些方法的逻辑，例如将数据发送到服务器。


