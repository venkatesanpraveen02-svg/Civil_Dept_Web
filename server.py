import json
import os
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = 8000
DATA_FILE = 'data/data.json'

# Initialize data file if it doesn't exist
if not os.path.exists(DATA_FILE):
    initial_data = {
        "events": [],
        "notices": []
    }
    with open(DATA_FILE, 'w') as f:
        json.dump(initial_data, f, indent=4)

class RequestHandler(SimpleHTTPRequestHandler):
    extensions_map = SimpleHTTPRequestHandler.extensions_map.copy()
    extensions_map.update({
        '.css': 'text/css',
        '.js': 'application/javascript',
        '': 'application/octet-stream', # Default
    })

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path == '/api/data':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            with open(DATA_FILE, 'r') as f:
                self.wfile.write(f.read().encode())
            return
        
        # Serve exact file or fallback to index.html for root
        if self.path == '/':
            self.path = '/index.html'
            
        return super().do_GET()

    def do_POST(self):
        if self.path == '/api/auth':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            data = json.loads(post_data)
            
            # Simple hardcoded admin credentials
            if data.get('username') == 'admin' and data.get('password') == 'admin123':
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True, 'token': 'admin_secret_token'}).encode())
            else:
                self.send_response(401)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'message': 'Invalid credentials'}).encode())
            return

        if self.path == '/api/update':
            # Check token for simple auth
            auth_header = self.headers.get('Authorization', '')
            if auth_header != 'Bearer admin_secret_token':
                self.send_response(403)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'message': 'Unauthorized'}).encode())
                return
                
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            
            try:
                new_data = json.loads(post_data)
                with open(DATA_FILE, 'w') as f:
                    json.dump(new_data, f, indent=4)
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True}).encode())
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'message': str(e)}).encode())
            return

def run(server_class=HTTPServer, handler_class=RequestHandler, port=PORT):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Starting simple local server on port {port}...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print("Server stopped.")

if __name__ == '__main__':
    run()
