import * as express from 'express';
import { Config } from './environment/config';
import { Environment } from './environment/environment';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as socketIo from 'socket.io';
import { router as usersRouter } from './controllers/users';
import { router as itemsRouter } from './controllers/items';
import { router as categoriesRouter } from './controllers/categories';
import { router as messagesRouter } from './controllers/messages';

const app = express();
const server = require('http').Server(app);
const io = socketIo(server);

const config: Config = Environment.getConfig();

// Connect mongoose to our database
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to db!');
});

// Middleware for CORS
app.use(cors());

// Middleware for bodyparsing using both json and urlencoding
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middlewares for the application api
app.use('/api/users', usersRouter);
app.use('/api/items', itemsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/messages', messagesRouter);

let clients = [];
(global as any).clients = clients;
(global as any).io = io;

io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('sendUser', (id) => {

    if (clients.findIndex((client) => client.id === id) === -1) {
      clients.push({
        id: id,
        socket: socket.id
      });

      console.log(clients);
    }
  });

  socket.on('disconnect', (id) => {
    let index = clients.find((client, i) => {
      if (client.socket == socket.id) {
        return i;
      }
    });

    clients.splice(index, 1);
    console.log(clients);

    console.log('user disconnected');
  });
});

server.listen(config.port, () => {
  console.log(`Server ready at port: ${config.port}`)
});
