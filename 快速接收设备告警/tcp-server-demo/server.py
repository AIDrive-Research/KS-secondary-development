import json
import socket
import struct
import threading
import time
import traceback


class SocketServer:
    def __init__(self):
        self.server_host = '0.0.0.0'
        self.server_port = 10001
        self.socket_server = self.__listen()
        self.conns = {}
        self.__accept()

    @staticmethod
    def __set_reuse_addr(socket_obj):
        """
        断开连接之后立马释放本地端口
        Args:
            socket_obj: socket对象
        Returns: True or False
        """
        socket_obj.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        return True

    def __listen(self):
        socket_server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        try:
            self.__set_reuse_addr(socket_server)
            # 绑定IP/端口
            socket_server.bind((self.server_host, self.server_port))
            # 最多同时处理5个连接请求
            socket_server.listen(5)
        except:
            print(traceback.format_exc())
        finally:
            return socket_server

    def __disconnect(self, addr):
        print('Disconnected, client={}'.format(addr))
        self.__close(self.conns[addr])
        self.conns.pop(addr)
        return True

    def __accept(self):
        def accept():
            while True:
                try:
                    conn, addr = self.socket_server.accept()
                    print('Connection established, client={}'.format(addr))
                    self.__set_reuse_addr(conn)
                    self.conns[addr] = conn
                    threading.Thread(target=self.__recv, args=(addr, conn), daemon=True).start()
                except:
                    print(traceback.format_exc())

        threading.Thread(target=accept, daemon=True).start()
        return True

    def __recv(self, addr, client_socket, buff_size=1024):
        while True:
            try:
                data_length = client_socket.recv(4)
                # 读取data_length
                if data_length:
                    data_length = struct.unpack('i', data_length)[0]
                    print('Recv from: {}, data_length: {}'.format(addr, data_length))
                    # 读取data
                    if data_length <= buff_size:
                        data = client_socket.recv(data_length)
                    else:
                        buff_size_ = buff_size
                        # 已接收到的size
                        total_recv_size = 0
                        data = b''
                        while total_recv_size < data_length:
                            recv_data = client_socket.recv(buff_size_)
                            data += recv_data
                            total_recv_size += len(recv_data)
                            left_size = data_length - total_recv_size
                            if left_size < buff_size:
                                buff_size_ = left_size
                    data = json.loads(data.decode('utf-8'))
                    print('Recv from: {}, data: {}'.format(addr, data))
                else:
                    break
            except:
                print(traceback.format_exc())
                break
        self.__disconnect(addr)
        return False

    @staticmethod
    def __close(socket_obj):
        try:
            socket_obj.close()
        except:
            print(traceback.format_exc())
        return True


if '__main__' == __name__:
    tcp_server = SocketServer()
    while True:
        time.sleep(3)
