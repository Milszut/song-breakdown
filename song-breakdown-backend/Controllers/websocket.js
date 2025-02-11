const WebSocket = require('ws');

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Nowe połączenie WebSocket');

    ws.on('message', (message) => {
      console.log(`Otrzymano wiadomość: ${message}`);

      let parsedMessage;
      try {
        parsedMessage = JSON.parse(message);
      } catch (error) {
        console.error('Nie udało się sparsować wiadomości na JSON:', error);
        return;
      }

      switch (parsedMessage.type) {
        case 'songSelected':
          console.log(`Wybrano piosenkę: ${parsedMessage.songId}`);
          broadcastMessage(wss, ws, {
            type: 'songSelected',
            songId: parsedMessage.songId,
            teamId: parsedMessage.teamId,
            eventId: parsedMessage.eventId,
          });
          break;

        case 'play':
          console.log(`Odtwarzanie piosenki (songId: ${parsedMessage.songId}) rozpoczęte.`);
          broadcastMessage(wss, ws, {
            type: 'play',
            songId: parsedMessage.songId,
          });
          break;

        case 'pause':
          console.log(`Wstrzymanie piosenki (songId: ${parsedMessage.songId}).`);
          broadcastMessage(wss, ws, {
            type: 'pause',
            songId: parsedMessage.songId,
          });
          break;

        default:
          console.warn('Nieznany typ wiadomości:', parsedMessage.type);
      }
    });

    ws.on('close', () => {
      console.log('Połączenie WebSocket zamknięte');
    });
  });

  return wss;
}

function broadcastMessage(wss, ws, message) {
  wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

module.exports = setupWebSocket;