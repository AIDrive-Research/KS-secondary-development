class deviceInfo {
  constructor() {
    this.info = {};

    this.init();
  }
  init() {
    deviceApis.getDeviceInfo().then(res => {
      console.log(res)
      this.info = res.data;
      this.initForm()
    })
  }
  initForm() {
    layui.use(() => {
      var form = layui.form;
      form.val('deviceForm', this.info);
      form.on('submit(saveData)', (formData) => {
        deviceApis.editDeviceInfo(Object.assign(this.info, formData.field)).then(res => {
          console.log(res)
        })
        return false;
      });
    })
  }
}

// 等待Layui加载完成后初始化
layui.use(['layer', 'form'], () => {
  deviceApis.getToken().then(res => {
    if (res.error_code == 0) {
      ZQLGLOBAL.token = res.data;
      // 初始化表格管理器
      window.deviceInfo = new deviceInfo();
    }
  })

});

const deviceApis = {
  getDeviceInfo: () => {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        dataType: "json",
        url: `http://${ZQLGLOBAL.serverIp}${ZQLGLOBAL.device}`,
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", `Bearer ${ZQLGLOBAL.token}`);
        },
        success: function (res) {
          resolve(res)
        },
        error: function (err) {
          reject(err)
        }
      });
    })
  },
  editDeviceInfo: (data) => {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "PUT",
        contentType: "application/json",
        url: `http://${ZQLGLOBAL.serverIp}${ZQLGLOBAL.device}`,
        data: JSON.stringify(data),
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", `Bearer ${ZQLGLOBAL.token}`);
        },
        success: function (res) {
          resolve(res)
        },
        error: function (err) {
          reject(err)
        }
      });
    })
  },

  getToken: async () => {
    var ak = ZQLGLOBAL.accessKey;
    var sk = ZQLGLOBAL.accessSecret;
    var timestampRes = await deviceApis.getTimestamp();
    let timestamp = timestampRes.data;
    var nonce = deviceApis.generateRandomString(10);
    let signature = deviceApis.generateSignature(ak, sk, timestamp, nonce)
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        dataType: "json",
        url: `http://${ZQLGLOBAL.serverIp}${ZQLGLOBAL.getToken}?signature=${signature}&ak=${ak}&timestamp=${timestamp}&nonce=${nonce}`,
        success: function (res) {
          resolve(res)
        },
        error: function (err) {
          reject(err)
        }
      });
    })
  },
  getTimestamp: () => {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        dataType: "json",
        url: `http://${ZQLGLOBAL.serverIp}${ZQLGLOBAL.getTime}`,
        success: function (res) {
          resolve(res)
        },
        error: function (err) {
          reject(err)
        }
      });
    })
  },
  generateSignature: (ak, sk, timestamp, nonce) => {
    var message = `${ak}:${timestamp}:${nonce}`;
    var hash = CryptoJS.HmacSHA256(message, sk);
    var signature = CryptoJS.enc.Hex.stringify(hash);
    return signature
  },
  generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
  }
}