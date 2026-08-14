import socket
import threading

HOST = '127.0.0.1'   # Server IP
PORT = 12345         # Same port as server

client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.connect((HOST, PORT))

def receive():
    while True:
        try:
            message = client.recv(1024).decode()
            print(message)
        except:
            print("Connection closed")
            client.close()
            break

def send():
    while True:
        message = input()
        client.send(message.encode())

receive_thread = threading.Thread(target=receive)a
receive_thread.start()

send_thread = threading.Thread(target=send)
send_thread.start()
