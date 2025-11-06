const ZQL_multivideo = {
  setVideoEl: () => {
    let videoContainer = document.querySelector("#video-container");
    if (ZQL_playingSource.videoNum == 1) {
      videoContainer.className = "one-video";
      videoContainer.innerHTML = `
          <div class="video-box">
            <div class="tips" id="tip0">
              <div class="icon-dot"></div>
              <div class="deviceoffline">
                <i class="z-icon-jiankonglixian" style="font-size: 40rem"></i>
                <span>离线</span>
              </div>
            </div>
            <div class="title-container" id="video-title0"></div>
            <video ref="video" muted id="video0" class="video-js" autoplay="autoplay" preload="auto"></video>
            <canvas class="canvas-shuju" id="canvas0"></canvas>
          </div>
        `
    } else {
      videoContainer.className = "four-video";
      videoContainer.innerHTML = `
          <div  class="video-box">
            <div class="tips" id="tip0">
              
            </div>
            <div class="title-container" id="video-title0"></div>
            <video ref="video" muted id="video0" class="video-js" autoplay="autoplay" preload="auto"></video>
            <canvas class="canvas-shuju" id="canvas0"></canvas>
          </div>
          <div  class="video-box">
            <div class="tips" id="tip1">
              
            </div>
            <div class="title-container" id="video-title1"></div>
            <video ref="video" muted id="video1" class="video-js" autoplay="autoplay" preload="auto"></video>
            <canvas class="canvas-shuju" id="canvas1"></canvas>
          </div>
          <div  class="video-box">
            <div class="tips" id="tip2">
              
            </div>
            <div class="title-container" id="video-title2"></div>
            <video ref="video" muted id="video2" class="video-js" autoplay="autoplay" preload="auto"></video>
            <canvas class="canvas-shuju" id="canvas2"></canvas>
          </div>
          <div class="video-box">
            <div class="tips" id="tip3">
              
            </div>
            <div class="title-container" id="video-title3"></div>
            <video ref="video" muted id="video3" class="video-js" autoplay="autoplay" preload="auto"></video>
            <canvas class="canvas-shuju" id="canvas3"></canvas>
          </div>
        `
    }
  },
  liveLoading: (index) => {
    let tipel = document.querySelector("#tip" + index);
    tipel.innerHTML = `<div class="icon-dot"></div>`
  },
  liveOffline: (index) => {
    let tipel = document.querySelector("#tip" + index);
    tipel.innerHTML = `
      <div class="deviceoffline">
        <i class="z-icon-jiankonglixian" style="font-size: 40rem"></i>
        <span>离线</span>
      </div>
    `
  },
  liveStopLoading: (index) => {
    let tipel = document.querySelector("#tip" + index);
    if (tipel) {
      tipel.innerHTML = ``
    }
  },
  setAlgList(index) {
    let el = document.querySelector(`#video-title${index}`);
    let algList = ZQL_sources[ZQL_playingSource[index]].alg;
    let algEl = '<ul>';
    for (let alg in algList) {
      let name = algList[alg].reserved_args.display_name;
      algEl = algEl + `<li alg="${alg}" index="${index}">${name}</li>`
    }
    algEl = algEl + '</ul>'
    el.innerHTML = `
      <div class="camera">${ZQL_sources[ZQL_playingSource[index]].desc}</div>
      <div class="alg">      
        <div class="algname">算法: ${ZQL_playingSource[index].alg ? ZQL_sources[ZQL_playingSource[index]].alg[alg].reserved_args.display_name : ''}</div>
        ${algEl}
      </div>
      <div id="close${index}">关闭</div>
    `;
    el.querySelectorAll('li').forEach(item => {
      item.addEventListener('click', (e) => {
        let index = e.currentTarget.getAttribute("index");
        let alg = e.currentTarget.getAttribute("alg")
        ZQL_videosInfos[index].alg = alg;
        let videlel = document.querySelector(`#video-title${index}`);
        videlel.querySelector(".algname").innerHTML = '算法：' + ZQL_sources[ZQL_playingSource[index]].alg[alg].reserved_args.display_name
      })
    })
    document.querySelector(`#close${index}`).addEventListener('click', () => {
      ZQL_multivideo.clearAlgList(index);
      ZQL_multivideo.liveStopLoading(index);
      ZQL_multivideo.destroyVideoByIndex(index);
      ZQL_playingSource[index] = null;
      ZQL_videosInfos[index] = null;
    })
  },
  clearAlgList(index) {
    let el = document.querySelector(`#video-title${index}`);
    if (el) {
      el.innerHTML = ""
    }
  },
  handleRefresh(index) {
    if (!ZQL_videosInfos[index]) {
      return;
    }
    if (ZQL_videosInfos[index].status == "离线") {
      ZQL_multivideo.destroyVideoByIndex(index);
      ZQL_multivideo.subscribeLive(ZQL_playingSource[index], index);
    } else {
      if (!ZQL_videosInfos[index].stream) {
        return;
      }
      let video = document.getElementById("video" + index);
      video && (video.srcObject = null);
      if (ZQL_videosInfos[index] && ZQL_videosInfos[index].replayTimer) {
        clearTimeout(ZQL_videosInfos[index].replayTimer);
        ZQL_videosInfos[index].replayTimer = null;
      }
      ZQL_videosInfos[index] &&
        ZQL_videosInfos[index].srsrtc &&
        ZQL_videosInfos[index].srsrtc.close();
      ZQL_videosInfos[index].srsrtc = null;
      ZQL_videosInfos[index].status = "";
      ZQL_multivideo.playVideo(ZQL_playingSource[index], index);
    }
  },
  subscribeLive(devId_camId, index) {
    ZQL_multivideo.getCameraSize(devId_camId, index);
    ZQL_multivideo.liveLoading(index);
    ZQL_apis
      .subscribeLive(
        ZQL_sources[devId_camId].deviceId,
        ZQL_sources[devId_camId].sourceId
      )
      .then((data) => {
        let stream = data.data;
        if (data && stream) {
          ZQL_videosInfos[index].stream = stream;
          ZQL_multivideo.playVideo(devId_camId, index);
        } else {
          if (ZQL_playingSource[index] == devId_camId) {
            ZQL_multivideo.liveOffline(index);
            // ZQL_videosInfos[index].status = "离线";
            // ZQL_videosInfos[index].loading = false;
            // this.reSubcribe(devId_camId, index);
          }
        }
      })
      .catch((err) => {
        if (
          ZQL_playingSource[index] == devId_camId &&
          ZQL_videosInfos[index]
        ) {
          ZQL_multivideo.liveOffline(index);
          // ZQL_videosInfos[index].status = "离线";
          // ZQL_videosInfos[index].loading = false;
          // this.reSubcribe(devId_camId, index);
        }
      });
  },
  playVideo(devId_camId, index) {
    if (ZQL_videosInfos[index].srsrtc) {
      return;
    }
    ZQL_videosInfos[index].loading = true;

    let video = document.getElementById("video" + index);
    let data_stream = ZQL_videosInfos[index].stream.replace('127.0.0.1:1985', `${ZQLGLOBAL.serverIp}:${ZQL_sources[devId_camId].port_info.media_http_api}`);
    var srsrtc;
    var srsrtc = new ZLMRTCClient.Endpoint({
      element: video, // video 标签
      debug: false, // 是否打印日志
      zlmsdpUrl: data_stream, //流地址
      simulcast: false,
      useCamera: true,
      audioEnable: true,
      videoEnable: true,
      recvOnly: true,
      resolution: { w: 1280, h: 720 },
      usedatachannel: false,
      videoId: "", // 不填选择默认的:空字符串
      audioId: "", // 不填选择默认的：空字符串
    });
    srsrtc.on(
      ZLMRTCClient.Events.WEBRTC_OFFER_ANWSER_EXCHANGE_FAILED,
      (e) => {
        // offer anwser 交换失败
        console.log("offer anwser 交换失败: index=", index, e);
        if (e.code == -400 && e.msg == "stream not found") {
          console.log(
            `---------------- 重新订阅${index} -------------------------`
          );
          if (ZQL_sources[cameraId].type == "video") {
            ZQL_multivideo.handleReplayVideo(index);
          } else {
            ZQL_multivideo.destroyVideoByIndex(index);
            ZQL_multivideo.getCameraSize(ZQL_playingSource[index], index);
            ZQL_multivideo.videoSubscribe(ZQL_playingSource[index], index);
          }
        }
      }
    );
    srsrtc.on(ZLMRTCClient.Events.WEBRTC_ON_REMOTE_STREAMS, (e) => {
      //获取到了远端流，可以播放
      // console.log("播放成功", e.streams);
      // console.log(`index=${index}`,player);
      ZQL_multivideo.liveStopLoading(index);
      ZQL_videosInfos[index].playerState = "success";
      ZQL_videosInfos[index].loading = false;
      ZQL_videosInfos[index].startTime = new Date().getTime();

      if (ZQL_videosInfos[index].refreshTimeInterval) {
        clearInterval(ZQL_videosInfos[index].refreshTimeInterval);
      }
      ZQL_videosInfos[index].refreshTime = parseInt(
        (Math.random() * 5 + 5) * 1000 * 6
      );

      // this.videosInfos[index].refreshTimeInterval = setInterval(() => {
      //   console.log(`index=${index}, player=`,this.videosInfos[index].srsrtc);
      //   this.handleRefresh(index);
      // }, this.videosInfos[index].refreshTime);
    });
    srsrtc.on(ZLMRTCClient.Events.WEBRTC_ON_CONNECTION_STATE_CHANGE, (e) => {
      console.log("WEBRTC_ON_CONNECTION_STATE_CHANGE: index=", index, e);
      if (e == "failed") {
        console.log(
          `${index}已运行${(new Date().getTime() - ZQL_videosInfos[index].startTime) / 1000
          }秒`
        );

        if (ZQL_sources[cameraId].type == "video") {
          console.log(
            `---------------- 重新推流${index} -------------------------`
          );
          ZQL_multivideo.handleReplayVideo(index);
        } else {
          console.log(
            `---------------- 重新播放${index} -------------------------`
          );
          ZQL_multivideo.handleRefresh(index);
        }
      }
      if (e == "disconnected") {
        console.log(
          `---------------- 重新播放${index} -------------------------`
        );
        ZQL_multivideo.handleRefresh(index);
      }
    });

    ZQL_videosInfos[index].srsrtc = srsrtc;

  },
  replayflv(srsrtc, devId_camId, index) {
    if (!ZQL_videosInfos[index]) {
      return;
    }
    if (ZQL_videosInfos[index].playerState == "success") {
      return;
    } else {
      srsrtc.unload();
      srsrtc.load();
      srsrtc
        .play()
        .then((res) => {
          ZQL_multivideo.liveStopLoading(index);
          ZQL_videosInfos[index].playerState = "success";
          ZQL_videosInfos[index].loading = false;
          if (ZQL_videosInfos[index].refreshTimeInterval) {
            clearInterval(ZQL_videosInfos[index].refreshTimeInterval);
          }
          ZQL_videosInfos[index].refreshTime =
            parseInt((Math.random() * 5 + 5) * 1000) * 60;
          ZQL_videosInfos[index].refreshTimeInterval = setInterval(() => {
            ZQL_multivideo.handleRefresh(index);
          }, ZQL_videosInfos[index].refreshTime);
        })
        .catch((err) => {
          // this.destoryVideoByIndex(index);
          // this.subscribeLive(devId_camId, index);
        });
      if (ZQL_videosInfos[index].replayTimer) {
        clearTimeout(ZQL_videosInfos[index].replayTimer);
      }
      ZQL_videosInfos[index].replayTimer = setTimeout(() => {
        ZQL_multivideo.replayflv(srsrtc, devId_camId, index);
      }, 20000);
    }
  },
  reSubcribe(devId_camId, index) {
    if (ZQL_videosInfos[index].subscribeTimeout) {
      clearTimeout(ZQL_videosInfos[index].subscribeTimeout);
      ZQL_videosInfos[index].subscribeTimeout = null;
    }
    ZQL_multivideo.videosInfos[index].subscribeTimeout = setTimeout(() => {
      ZQL_multivideo.subscribeLive(devId_camId, index);
    }, 1000);
  },
  getCameraSize(devId_camId, index) {
    console.log(devId_camId)
    ZQL_multivideo.setOrisize(
      ZQL_sources[devId_camId].stream.image_size.draw[0],
      ZQL_sources[devId_camId].stream.image_size.draw[1],
      index, devId_camId
    );
  },
  setOrisize(width, height, index, devId_camId) {
    let container = document.querySelector(".video-box");
    if (!container) {
      return;
    }
    if (!ZQL_videosInfos[index]) {
      let alg = null;
      if (sessionStorage.getItem("curalgs")) {
        let devId_camId = ZQL_playingSource[index];
        let curalgs = JSON.parse(sessionStorage.getItem("curalgs"));
        alg = curalgs[devId_camId]
          ? JSON.parse(JSON.stringify(curalgs[devId_camId]))
          : null;
      }
      ZQL_videosInfos[index] = {
        id: devId_camId,
        loading: true,
        openWs: true,
        alg: alg,
        algListShow: false,
        subscribeTimeout: null,
        refreshTimeInterval: null, // 定时刷新定时器
        refreshTime: null, // 定时刷新时间
        replayTimer: null,
        playerState: "pending",
        quanping: false,
        srsrtc: null,
        stream: "",
        status: "",
        stream_code: "",
      };
    }
    if (ZQL_videosInfos[index]) {
      let oriWidth = width;
      let oriHeight = height;
      ZQL_videosInfos[index].oriWidth = oriWidth;
      ZQL_videosInfos[index].oriHeight = oriHeight;

      if (
        oriWidth / container.offsetWidth >
        oriHeight / container.offsetHeight
      ) {
        ZQL_videosInfos[index].actualHeight = container.offsetWidth / (oriWidth / oriHeight)
        ZQL_videosInfos[index].actualWidth = container.offsetWidth;
      } else {
        ZQL_videosInfos[index].actualHeight = container.offsetHeight
        ZQL_videosInfos[index].actualWidth = container.offsetHeight * (oriWidth / oriHeight)
      }
      // videoWidth = ZQL_videosInfos[index].actualWidth;
      ZQL_multivideo.setPosition(index);
    }
  },
  setPosition(index) {
    let container = document.querySelector(".video-box");
    let video = document.querySelector("#video" + index);
    let canvas = document.getElementById("canvas" + index);
    let width = ZQL_videosInfos[index].actualWidth, height = ZQL_videosInfos[index].actualHeight;
    video.style.position = "absolute";
    video.style.width = width + "px";
    video.style.height = height + "px";
    canvas.width = width;
    canvas.height = height;
    if (width / container.offsetWidth < height / container.offsetHeight) {
      let left = (container.offsetWidth - width) / 2;
      video.style.left = Math.floor(left) + "px";
      video.style.top = 0 + "px";
      canvas.style.left = Math.floor(left) + "px";
      canvas.style.top = "0px";
    } else {
      let top = (container.offsetHeight - height) / 2;
      video.style.top = Math.floor(top) + "px";
      video.style.left = 0 + "px";
      canvas.style.top = Math.floor(top) + "px";
      canvas.style.left = "0px";
    }
  },
  setAlarms: (data, index) => {
    ZQL_multivideo.clearCanvas(index);
    if (ZQL_videosInfos[index] && !ZQL_videosInfos[index].canvas) {
      ZQL_videosInfos[index].canvas = document.getElementById("canvas" + index)
    }
    if (
      !ZQL_videosInfos[index] ||
      !ZQL_videosInfos[index].actualWidth ||
      !ZQL_videosInfos[index].actualHeight ||
      !ZQL_videosInfos[index].oriWidth ||
      !ZQL_videosInfos[index].oriHeight
    ) {
      return;
    }
    // let bbox = data.result.data.bbox;
    let bbox = data.bbox;
    if (Object.values(bbox.polygons).length > 0) {
      Object.values(bbox.polygons).forEach((item) => {
        let color = JSON.parse(JSON.stringify(item.color)).reverse();
        // let color = item.color;
        let points = item.polygon.map((point) => {
          return [
            Math.round(
              (point[0] * ZQL_videosInfos[index].actualWidth) /
              ZQL_videosInfos[index].oriWidth
            ),
            Math.round(
              (point[1] * ZQL_videosInfos[index].actualHeight) /
              ZQL_videosInfos[index].oriHeight
            ),
          ];
        });
        let context = ZQL_videosInfos[index].canvas.getContext("2d");
        context.font = "20px Arial bolder";
        context.fillStyle = "transparent";
        context.strokeStyle = "rgb(" + color.join(",") + ")";
        context.lineWidth = 2;
        ZQL_multivideo.drawPolygons(points, context);
        ZQL_multivideo.drawPolygonInfo(context, Object.values(bbox.polygons), index);
      });
    }

    if (bbox.rectangles.length > 0) {
      bbox.rectangles.forEach((item, i) => {
        let color = JSON.parse(JSON.stringify(item.color)).reverse();
        let coordinates = {
          x: Math.round(
            (item.xyxy[0] * ZQL_videosInfos[index].actualWidth) /
            ZQL_videosInfos[index].oriWidth
          ),
          y: Math.round(
            (item.xyxy[1] * ZQL_videosInfos[index].actualHeight) /
            ZQL_videosInfos[index].oriHeight
          ),
          x1: Math.round(
            (item.xyxy[2] * ZQL_videosInfos[index].actualWidth) /
            ZQL_videosInfos[index].oriWidth
          ),
          y1: Math.round(
            (item.xyxy[3] * ZQL_videosInfos[index].actualHeight) /
            ZQL_videosInfos[index].oriHeight
          ),
        };
        let context = ZQL_videosInfos[index].canvas.getContext("2d");
        context.font = "20px Arial bolder";
        context.fillStyle = "rgb(" + color.join(",") + ")";
        context.fillText(item.label || "", coordinates.x, coordinates.y - 10);
        context.strokeStyle = "rgb(" + color.join(",") + ")";
        context.lineWidth = 2;
        // context.strokeRect(
        //   coordinates.x,
        //   coordinates.y,
        //   coordinates.x1 - coordinates.x,
        //   coordinates.y1 - coordinates.y
        // );
        let lines = [];
        let lineWidth = (coordinates.x1 - coordinates.x) / 4;
        let lineHeight = (coordinates.y1 - coordinates.y) / 4;
        lines[0] = {
          x: coordinates.x,
          y: coordinates.y,
          x1: coordinates.x + lineWidth,
          y1: coordinates.y,
        };
        lines[1] = {
          x: coordinates.x,
          y: coordinates.y,
          x1: coordinates.x,
          y1: coordinates.y + lineHeight,
        };
        lines[2] = {
          x: coordinates.x1,
          y: coordinates.y,
          x1: coordinates.x1 - lineWidth,
          y1: coordinates.y,
        };
        lines[3] = {
          x: coordinates.x1,
          y: coordinates.y,
          x1: coordinates.x1,
          y1: coordinates.y + lineHeight,
        };
        lines[4] = {
          x: coordinates.x,
          y: coordinates.y1,
          x1: coordinates.x + lineWidth,
          y1: coordinates.y1,
        };
        lines[5] = {
          x: coordinates.x,
          y: coordinates.y1,
          x1: coordinates.x,
          y1: coordinates.y1 - lineHeight,
        };
        lines[6] = {
          x: coordinates.x1,
          y: coordinates.y1,
          x1: coordinates.x1 - lineWidth,
          y1: coordinates.y1,
        };
        lines[7] = {
          x: coordinates.x1,
          y: coordinates.y1,
          x1: coordinates.x1,
          y1: coordinates.y1 - lineHeight,
        };
        lines.forEach((item) => {
          ZQL_multivideo.drawLine(context, item);
        });
      });
    }

    if (Object.values(bbox.lines).length > 0) {
      Object.values(bbox.lines).forEach((item, i) => {
        let color = JSON.parse(JSON.stringify(item.color)).reverse();
        let coordinates = {
          x: Math.round(
            (item.line[0][0] * ZQL_videosInfos[index].actualWidth) /
            ZQL_videosInfos[index].oriWidth
          ),
          y: Math.round(
            (item.line[0][1] * ZQL_videosInfos[index].actualHeight) /
            ZQL_videosInfos[index].oriHeight
          ),
          x1: Math.round(
            (item.line[1][0] * ZQL_videosInfos[index].actualWidth) /
            ZQL_videosInfos[index].oriWidth
          ),
          y1: Math.round(
            (item.line[1][1] * ZQL_videosInfos[index].actualHeight) /
            ZQL_videosInfos[index].oriHeight
          ),
        };
        let context = ZQL_videosInfos[index].canvas.getContext("2d");
        context.font = "20px Arial bolder";
        context.fillStyle = "rgb(" + color.join(",") + ")";
        if (item.ext.direction) {
          context.fillText(item.name, (coordinates.x + coordinates.x1) / 2, (coordinates.y + coordinates.y1) / 2 + 20);
        }

        context.strokeStyle = "rgb(" + color.join(",") + ")";
        context.lineWidth = 2;
        ZQL_multivideo.drawLine(context, coordinates);
        ZQL_multivideo.drawCountingInfo(context, Object.values(bbox.lines));
      });
    }
  },
  drawPolygons(points, context) {
    context.beginPath();
    context.moveTo(points[0][0], points[0][1]);

    for (var i = 1; i < points.length; i++) {
      context.lineTo(points[i][0], points[i][1]);
    }
    context.closePath();
    context.fill();
    context.stroke();
  },
  drawLine(ctx, line) {
    ctx.beginPath();
    ctx.moveTo(line.x, line.y);
    ctx.lineTo(line.x1, line.y1);
    ctx.stroke();
  },
  drawCountingInfo(context, lines) {
    lines.forEach((item, index) => {
      context.fillStyle = "rgb(255,0,0)";
      if (item.ext.direction.length == 2) {
        context.fillText(`[${item.name}] ${item.ext.action.count}: ${item.ext.result.count}`, 0, 20 * index + 20);
      } else {
        context.fillText(`[${item.name}] ${item.ext.action.increase}: ${item.ext.result.increase},${item.ext.action.decrease}: ${item.ext.result.decrease},${item.ext.action.delta}: ${item.ext.result.delta}`, 0, 20 * index + 20);
      }
    });
  },
  drawPolygonInfo(context, polygons, videoindex) {
    polygons.forEach((item, index) => {
      context.fillStyle =
        "rgb(" +
        JSON.parse(JSON.stringify(item.color)).reverse().join(",") +
        ")";
      let leftPoint = item.polygon[0];
      for (let i = 1; i < item.polygon.length; i++) {
        if (item.polygon[i][0] < leftPoint[0]) {
          leftPoint = item.polygon[i];
        }
      }
      context.fillText(
        `${item.name}`,
        (leftPoint[0] * ZQL_videosInfos[videoindex].actualWidth) /
        ZQL_videosInfos[videoindex].oriWidth,
        (leftPoint[1] * ZQL_videosInfos[videoindex].actualHeight) /
        ZQL_videosInfos[videoindex].oriHeight + 20
      );
      if (item.ext.result) {
        context.fillStyle = "rgb(255,0,0)";
        context.fillText(`${item.name}: ${item.ext.result}`, 0, 20 * index + 20);
      }
    });
  },
  destroyVideo(videonum) {
    for (let i = 0; i < videonum; i++) {
      ZQL_multivideo.destroyVideoByIndex(i);
    }
  },
  destroyVideoByIndex(index) {
    ZQL_multivideo.clearCanvas(index);
    if (ZQL_videosInfos[index]) {
      if (
        ZQL_videosInfos[index] &&
        ZQL_videosInfos[index].subscribeTimeout
      ) {
        clearTimeout(ZQL_videosInfos[index].subscribeTimeout);
        ZQL_videosInfos[index].subscribeTimeout = null;
      }
      if (ZQL_videosInfos[index] && ZQL_videosInfos[index].replayTimer) {
        clearTimeout(ZQL_videosInfos[index].replayTimer);
        ZQL_videosInfos[index].replayTimer = null;
      }
      if (ZQL_videosInfos[index].refreshTimeInterval) {
        clearInterval(ZQL_videosInfos[index].refreshTimeInterval);
        ZQL_videosInfos[index].refreshTimeInterval = null;
      }
      let video = document.getElementById("video" + index);
      video && (video.srcObject = null);
      ZQL_videosInfos[index].srsrtc &&
        ZQL_videosInfos[index].srsrtc.close();
      ZQL_multivideo.clearCanvas(index);
      ZQL_videosInfos[index] = null;
    }
  },
  clearCanvas(index) {
    let canvas = document.getElementById("canvas" + index);
    if (canvas && canvas.getContext("2d")) {
      canvas
        .getContext("2d")
        .clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    }
  },
  connectMqtt(devWebsocket) {
    let mqttclient = mqtt.connect(`ws://${ZQLGLOBAL.serverIp}:${devWebsocket}/mqtt`, {
      username: ZQLGLOBAL.mqttAuth[0],
      password: ZQLGLOBAL.mqttAuth[1]
    });
    mqttclient.subscribe(
      ZQLGLOBAL.resultTopic,
      { qos: 0 },
      (error) => {
        if (error) {
          console.log("subscribe error:", error);
          return;
        }
      }
    );
    mqttclient.subscribe(
      ZQLGLOBAL.streamInfoTopic,
      { qos: 0 },
      (error) => {
        if (error) {
          console.log("subscribe error:", error);
          return;
        }
      }
    );

    mqttclient.on("message", (topic, payload) => {
      let msg = JSON.parse(payload.toString());
      if (msg.msg_type == 'video_detection') {
        let id = msg.data.source.id;
        for (let i = 0; i < 4; i++) {
          if (ZQL_videosInfos[i]) {
            let alg = ZQL_videosInfos[i].alg;
            if (
              ZQL_playingSource[i].indexOf(id) >= 0 &&
              msg.data.alg.name == alg
            ) {
              ZQL_multivideo.setAlarms(msg.data.reserved_data, i);
              if (
                ZQL_videosInfos[i] &&
                ZQL_videosInfos[i].canvasTimeout
              ) {
                clearTimeout(ZQL_videosInfos[i].canvasTimeout);
              }
              ZQL_videosInfos[i].canvasTimeout = setTimeout(() => {
                ZQL_multivideo.clearCanvas(i);
              }, 1000);
              break;
            }
          }
        }
      }

      // 流状态信息
      if (topic == "ks/stream_local") {
        console.log(msg.data.stream)
      }
    });
  }
}

const ZQL_apis = {
  getDevices: () => {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        dataType: "json",
        url: `http://${ZQLGLOBAL.serverIp}${ZQLGLOBAL.getDevices}`,
        // header: { Authorization: `Bearer ${ZQLGLOBAL.token}`},
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
  getSources: () => {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        dataType: "json",
        url: `http://${ZQLGLOBAL.serverIp}${ZQLGLOBAL.getSources}`,
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
  subscribeLive: (device_id, source_id) => {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        dataType: "json",
        url: `http://${ZQLGLOBAL.serverIp}${ZQLGLOBAL.subscribe}?device_id=${device_id}&source_id=${source_id}`,
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
  gettoken: async () => {
    var ak = ZQLGLOBAL.accessKey;
    var sk = ZQLGLOBAL.accessSecret;
    // var timestamp = parseInt(new Date().getTime() / 1000);
    var timestampRes = await ZQL_apis.getTimestamp();
    let timestamp = timestampRes.data;
    var nonce = ZQL_apis.generateRandomString(10);
    let signature = ZQL_apis.generateSignature(ak, sk, timestamp, nonce)
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
