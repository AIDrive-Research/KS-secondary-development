# HTTP Alert Push

> **http-server-demo** is divided into three folders:
>
> 1. **http-server**: HTTP server to receive alert push (no token version) – most commonly used 
> 2. **headers**: Original demo code for HTTP request headers  
> 3. **http-server-token**: HTTP server to receive alert push (with token version)  


## http-server (Most Common)
This folder contains the **HTTP** server code in **Python** and **Java**. It is mainly used to receive alert pushes from the device via HTTP.
If you want to test whether the device’s **HTTP** push works correctly, you can run the code in this folder.
Running the code will start an **HTTP** server. On the device platform, go to **DataPush → Alarm → HTTP**, enable push management, and enter the HTTP server address to start receiving alerts.

## headers

If you want the device alerts to be pushed to your own platform and your platform requires **token** verification, you need to use `headers_demo.py` in this folder.
You can modify `headers_demo.py` and upload it to the device platform under **DataPush → Alarm → HTTP → Configure Token**. 

`headers_demo.py` instructions:

- Class name must be `Headers` and inherit from `BaseHeaders`, which is imported via `api.http`:
- 
  ```python
  from api.http import Headers as BaseHeaders
  ```

- Define three instance variables: get_headers_url, timeout, and interval.

  ​	`get_headers_url`：URL to fetch the token

  ​	`timeout`：token request timeout (seconds)

  ​	`interval`：interval for refreshing headers (seconds)
  
  ```python
  class Headers(BaseHeaders):
      def __init__(self):
          self.get_headers_url = None
          self.timeout = 5  
          interval = 60 * 10
          super().__init__(interval)
  ```
  
- Must implement`_generate_headers`method。return `headers`。Example:

  
  ```python
  {'authorization': 'Bearer abcdefghijklmnopqrstuvwxyz'}
  ```


- Full example:

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




## http-server-token

his folder is similar to http-server, but adds token verification.。
First, upload headers_demo1.py or headers_demo2.py from this folder to the device platform under Data Push → Alarm → HTTP → Configure Token.
- `headers_demo1.py`: Fetches the token by calling a URL (the device must be able to ping this URL; the `get_headers_url` variable in the file is the HTTP server URL).  
- `headers_demo2.py`: Uses a fixed token.