import * as express from 'express';
import { Config } from './environment/config';
import { Environment } from './environment/environment';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import { router as usersRouter } from './controllers/users';
import { router as itemsRouter } from './controllers/items';
import { router as categoriesRouter } from './controllers/categories';

const app = express();

const config: Config = Environment.getConfig();

// Connect mongoose to our database
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
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

app.listen({ port: config.port }, () => {
  console.log(`Server ready at port: ${config.port}`)
});
