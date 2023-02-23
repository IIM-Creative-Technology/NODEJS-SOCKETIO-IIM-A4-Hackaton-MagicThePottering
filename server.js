const express = require('express')
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/pages/index.html');
});

io.on('connection', (socket) => {
  let boosterKeys = 3;
  let clientDeck = [];

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  console.log('Un utilisateur s\'est connecté');
  socket.on('disconnect', () => {
    console.log(`Un utilisateur vient de partir !`)
  })

  // send a boosters
  socket.emit('serverGetBooster');

  // get a request from the client for a booster opening
  socket.on('clientRequestBoosterOpening', (id) => {
    if (boosterKeys !== 0) {
      boosterKeys--;
      // send the authorization for the booster opening
      socket.emit('serverGetAuthorizationBoosterOpening', ({id, boosterKeys}));
    } else {
      // alert on no key
      socket.emit('serverBoosterNoKey');
    }
  })

  socket.on('clientAddCardToDeck', (data) => {
    const cardId = data.cardId;
    const cardNumber = data.cardNumber;

    clientDeck.push(cardNumber);
    socket.emit('serverUpdateDeck', {cardId, clientDeck});
  })

  socket.on('clientRemoveCardFromDeck', (cardNumber) => {
    const cardIndex = clientDeck.indexOf(cardNumber);
    clientDeck.splice(cardIndex, 1);
    socket.emit('serverUpdateDeckAfterCardDelete', {cardNumber, clientDeck});
  })

  // change the key value
  /*socket.on('clientChangeKeyValue', () => {
    socket.emit('serverKeyNewValue', (boosterKeys));
  })*/

});

http.listen(3000, () => {
  console.log('listening on : 3000');
});