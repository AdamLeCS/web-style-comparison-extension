import { WebSocketServer } from 'ws';

let wss;

export function createWebSocketServer(server) {
    wss = new WebSocketServer({ server });

    wss.on('connection', (socket) => {
        console.log("Web socket has connected!");
        socket.on('close', () => {
            console.log('client disconnected');
        });
    });

    return wss;
}

export function broadcastReload() {
    // this function sends out a message to every single client that is connected to the websocket
    // and calls the window reload function
    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send('reload');
        }
    });
}