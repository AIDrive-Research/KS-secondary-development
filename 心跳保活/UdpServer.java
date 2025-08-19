package com.github.paicoding.forum.web.front.test;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.net.DatagramSocket;
import java.net.DatagramPacket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;


/**
 * UDP 服务器
 * 本类使用单线程的线程池实现一个简单的UDP服务器，用于接收客户端发送的心跳信息。
 * 实现方法多种多样，需要根据具体的业务场景进行选择。
 */

@Slf4j
@Component
public class UdpServer {


    private static final int PORT = 10002;
    private volatile boolean isRunning = true; // 标志变量
    private final ExecutorService executor = Executors.newSingleThreadExecutor();

    @PostConstruct
    public void startServer() {
        executor.submit(this::listenUdpPackets);
    }

    @PreDestroy
    public void stopServer() {
        isRunning = false;
        executor.shutdown();
        log.info("UDP服务器已停止");
    }


    private void listenUdpPackets() {
        try (DatagramSocket socket = new DatagramSocket(PORT)) {
            log.info("UDP Server started on port {}", PORT);
            byte[] buffer = new byte[102400];
            DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
            while (isRunning) {
                socket.receive(packet);
                String message = new String(packet.getData(), 0, packet.getLength()).trim();
                log.info("❤️ Heartbeat from: {} ", packet.getAddress());
                log.info("📦 Data received: {}", message);
            }
        } catch (Exception e) {
            log.error("UDP Server error: {}", e.getMessage(), e);
        }
    }


}