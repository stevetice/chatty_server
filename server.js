const express = require('express');
const SocketServer = require('ws').Server;

// Create random number to use as message ID
const uuidv4 = require('uuid/v4');

// Set the port to 3001
const PORT = 3001;

// Create a new express servergit add
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

const newNotification = (user) => {
  console.log(user);
  const newID = uuidv4()
  const msg = {
    id: newID,
    type: "incomingNotification",
    content: user.content
  }
  console.log(msg);
  return msg;
}

const newMessage = (message) => {
  const newID = uuidv4();
  const msg = {
      id: newID,
      type: "incomingMessage",
      username: message.namename,
      content: message.content
    }
    return msg;
};

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');


  ws.on('message', function incoming(message) {
    console.log(message);
    const msg = JSON.parse(message);
    let sendMessage;
    if (msg.type === 'postMessage') {
      console.log('Got a new message');
      console.log(msg);
      console.log('User', msg.username, 'said', msg.content);
      sendMessage = JSON.stringify(newMessage(msg));
    } else if (msg.type === 'postNotification') {
      sendMessage = JSON.stringify(newNotification(msg));
    }

  // Broadcast message
    wss.clients.forEach(function each(client) {
      if (client.readyState === ws.OPEN) {
        client.send(sendMessage);
      console.log('Sent a message: ', sendMessage);
      }
    });
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => console.log('Client disconnected'));
});