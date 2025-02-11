class WebSocketService {
    constructor() {
        this.socket = null;
        this.onMessageCallbacks = [];
    }

    connect(url) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.log('WebSocket is already connected');
            return;
        }

        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            console.log('WebSocket connected');
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.onMessageCallbacks.forEach((callback) => callback(data));
        };

        this.socket.onclose = () => {
            console.log('WebSocket disconnected');
            this.socket = null;
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            console.log('WebSocket connection closed');
            this.socket = null;
        }
    }

    sendMessage(message) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.error('Cannot send message, WebSocket is not open');
        }
    }

    addOnMessageCallback(callback) {
        if (typeof callback === 'function') {
            this.onMessageCallbacks.push(callback);
        } else {
            console.error('Callback must be a function!');
        }
    }
    
    removeOnMessageCallback(callback) {
        this.onMessageCallbacks = this.onMessageCallbacks.filter(
            (cb) => cb !== callback
        );
    }    
}

export const webSocketService = new WebSocketService();