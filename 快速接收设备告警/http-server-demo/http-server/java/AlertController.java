

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping(path = "")
public class AlertController {


    /**
     * 目标平台接收告警及告警图片
     *
     * @param alertMsg
     */

    @PostMapping(path = "/alert")
    public void getAlertMsg(@RequestBody AlertMsg alertMsg) {
        log.info("示例接收告警及告警图片：{}", alertMsg);
    }

    /**
     * 目标平台接收告警及告警视频
     *
     * @param alertVideo
     */

    @PostMapping(path = "/video")
    public void getAlertVideo(@RequestBody AlertVideo alertVideo) {
        log.info("示例接收告警及告警视频：{}", alertVideo);
    }

}
