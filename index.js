const WebSocket = require('ws');
 
const wss = new WebSocket.Server({
  port: 8080,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed.
  }
});

let sockets = [];

wss.on('connection', function(ws) {
    ws.on('message', (msg) => {
        const message = JSON.parse(msg);
        if(message.head) {
            if(message.head.id) {
                // Já Logado
                // 1) Validar o Id
                if (message.head.route === '/process/current') {
                    let responseMessage = {
                        head: {
                            route: message.head.route
                        },
                        payload: {
                            processId: "ada2156asdasd66asdas"
                        }
                    }
                    ws.send(JSON.stringify(responseMessage));
                }
            } else if (message.head.route) {
                // Será um Loop sobre uma lista
                if (message.head.route === 'login') {
                    console.log(message);
                    // Validar usuário e token
                    login(message.head.user, message.head.applicationId)
                    let id = 123456;
                    let session = {id, ws};
                    sockets.push(session);
                    let responseMessage = {
                        head: {
                            id,
                            route: message.head.route
                        },
                        payload: {}
                    }
                    ws.send(JSON.stringify(responseMessage));
                }
            }
        }
    });    
});

function login(user, applicationId) {
    console.log('received user: ' + (JSON.stringify(user)));
    console.log('received applicationId: ' + (JSON.stringify(applicationId)));
}
