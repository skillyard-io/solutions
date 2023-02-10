import os
import logging
from http.server import HTTPServer, BaseHTTPRequestHandler

PORT = os.getenv('PORT', 8080)

class Handler(BaseHTTPRequestHandler):
    def __set_response(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def __html_content(self, name):
        file = open(f"templates/{name}.html")
        return file.read()

    def do_GET(self):
        self.__set_response()

        content = f"{self.path} Not found"

        if self.path == '/success':
            content = self.__html_content('success')

        if self.path == '/failure':
            content = self.__html_content('failure')

        self.wfile.write(content.encode())

    def do_POST(self):
        self.__set_response()
        

def create_server():
    return HTTPServer((
        '',
        PORT
    ), Handler)

def configure_logging():
    logging.basicConfig(level=logging.INFO)

def main():
    configure_logging()
    server = create_server()
    logging.info(f"Server running on port {PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass

    logging.info("Server closed from terminal.")
    server.server_close()

if __name__ == '__main__':
    main()
