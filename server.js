const express = require('express');
const mongoose = require('mongoose');
const socket = require('socket.io');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

const users = require('./routes/api/users');
const products = require('./routes/api/products');
const messages = require('./routes/api/messages');

const app = express();

app.use(express.static(path.join(__dirname, 'client/build')));

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

const db = require('./config/keys').mongoURI;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


app.use(passport.initialize());
require('./config/passport')(passport);
app.use('/uploads', express.static('uploads'));

app.use('/api/users', users);
app.use('/api/products', products);
app.use('/api/messages', messages);

const port = process.env.PORT || 3001

server = app.listen(port, () => console.log(`Server running on ${port}`));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

io = socket(server);

io.on('connection', socket => {
  socket.on('sendMessage', data => {
		io.sockets.in(data.room).emit('receiveMessage', data.message);
	})

	socket.on('create', room => {
		socket.nickname = room;
    socket.join(room);
	});
	
	socket.on('createNewRoom', data => {
		socket.to(data.room).emit('updateRooms', data.chatData);
	})
});