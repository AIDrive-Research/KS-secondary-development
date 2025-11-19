import json
import socket
import traceback


class UdpServer:
    def __init__(self):
        self.host = '0.0.0.0'
        self.port = 10002
        self.socket_server = self.__init()

    def __init(self):
        socket_server = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        try:
            socket_server.bind((self.host, self.port))
        except:
            print(traceback.format_exc())
        finally:
            return socket_server

    def recv(self, buff_size=102400):
        while True:
            try:
                data, addr = self.socket_server.recvfrom(buff_size)
                data = json.loads(data.decode('utf-8'))
                print('Received message: {}, from: {}'.format(data, addr))
            except:
                print(traceback.format_exc())


def main():
    udp_server = UdpServer()
    udp_server.recv()
    return True


if '__main__' == __name__:
    main()
