from flask import Flask, request, jsonify
from flask_cors import CORS
import threading
from capture import list_interfaces, start_capture, get_stats, is_capturing

app = Flask(__name__)
CORS(app)

# List network interfaces
@app.route('/api/interfaces', methods=['GET'])
def interfaces():
    return jsonify(list_interfaces())

# Start DNS capture
@app.route('/api/capture', methods=['POST'])
def capture():
    data = request.json
    interface = data.get('interface')
    if not interface:
        return jsonify({'error': 'interface is required'}), 400
    if is_capturing():
        return jsonify({'status': 'already capturing'})
    # Start capture in a background thread to keep API responsive
    t = threading.Thread(target=start_capture, args=(interface,))
    t.daemon = True
    t.start()
    return jsonify({'status': 'capture_started', 'interface': interface})

# Get DNS stats
@app.route('/api/stats', methods=['GET'])
def stats():
    return jsonify(get_stats())

# Healthcheck
@app.route('/', methods=['GET'])
def home():
    return jsonify({'status': 'ok', 'message': 'DNS Query Analyzer Backend'})

if __name__ == '__main__':
    app.run(port=5000)