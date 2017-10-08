const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => res.send('Hello'));

const _onConnection = function(socket) {
  const _onJoinRoom = function(payload) {
    console.log(`User with id: ${payload.userID} has joined to room: ${payload.room}`);
    socket.join(payload.room);
  };

  const _onSetValue = function(payload) {
    io.sockets.in(payload.room).emit('setValue', payload);
  };

  const _onSyncRequest = function(payload) {
    console.log(`User: ${payload.userID} has requested sync`);
    socket.broadcast.emit('syncrequest', payload);
  };

  const _onSync = function(payload) {
    socket.broadcast.emit('sync', payload);
  };

  const _onNewChunk = function(payload) {
    console.log(`User ${payload.userID} has created a new chunk`);
    socket.broadcast.emit('newchunk', payload);
  };

  console.log('A user has connected');
  socket.on('joinroom', _onJoinRoom);
  socket.on('setvalue', _onSetValue);
  socket.on('requestsync', _onSyncRequest);
  socket.on('sync', _onSync);
  socket.on('newchunk', _onNewChunk);
};

io.on('connection', _onConnection);

http.listen(3000, () => console.log('listening on *:3000'));
