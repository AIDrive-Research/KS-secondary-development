# HTTP告警推送

> **http-server-demo** 分为三个文件夹。
>
> 1. **headers** ：http请求头的demo代码
> 2. **http-server** ：http服务端，接收告警推送(无token版本)
> 3. **http-server-token** ：http服务端，接收告警推送(有token版本)

## headers

如果需要将盒子产生的告警推送到您自建平台，并且你的平台需要验证**token**，则需要用到该文件夹下的`headers_demo.py`文件。
你可自行修改`headers_demo.py`文件，并将此文件上传到盒子平台的【数据推送】-【告警】-【HTTP】-【配置token】。
`headers_demo.py`文件说明：

- 类名必须为`Headers`，继承`BaseHeaders`类。`BaseHeaders`类通过`api.http`导入

  ```python
  from api.http import Headers as BaseHeaders
  ```

- 定义三个实例变量：`get_headers_url`、`timeout`、`interval`。
 
  ​	`get_headers_url`：指定获取`token`的**URL**地址。

  ​	`timeout`：指定获取`token`的超时时间（单位：秒）。

  ​	`interval`：定时刷新`headers`的时间间隔（单位：秒）。
  
  ```python
  class Headers(BaseHeaders):
      def __init__(self):
          self.get_headers_url = None
          self.timeout = 5  
          interval = 60 * 10
          super().__init__(interval)
  ```
  
- 必须实现`_generate_headers`方法。返回请求头字典`headers`。返回示例：

  
  ```python
  {'authorization': 'Bearer abcdefghijklmnopqrstuvwxyz'}
  ```


- 完整实例如下：

  ```python
  import requests
  from api.http import Headers as BaseHeaders
  from logger import LOGGER
  
  class Headers(BaseHeaders):
      def __init__(self):
          self.get_headers_url = None
          self.timeout = 5
          interval = 60 * 10
          super().__init__(interval)
  
      def _generate_headers(self):
          try:
              headers = {
                  'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkXXX'
              }
              return headers
          except:
              LOGGER.exception('_generate_headers')
          return None
  ```

## http-server

该文件夹为**http**服务端代码，提供**python**和**java**代码。它主要用于接收盒子的**http**告警推送。如果您需要验证盒子的**http**推送功能是否正常，可使用此文件夹进行测试。
运行该文件夹下的代码，即可开启一个**http**服务端。在盒子平台的【数据推送】-【告警】-【HTTP】中启用推送管理，并填写**http**服务端地址，即可开启推送功能。


## http-server-token

此文件夹同**http-server**文件夹，只是增加了**token**验证功能。

你首先需把其下的`headers_demo1.py`或`headers_demo2.py`文件上传到盒子平台的【数据推送】-【告警】-【HTTP】-【配置TOKEN】。
`headers_demo1.py`：通过调用url接口获取token。(盒子必须可以ping通该url，文件中的`get_headers_url`变量为**http**服务端URL)
`headers_demo2.py`：固定token。