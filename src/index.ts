import * as express from 'express';
import { Config } from './environment/config';
import { Environment } from './environment/environment';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';

const app = express();

const config: Config = Environment.getConfig();

// Connect mongoose to our database
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to db!")
});

// Middleware for CORS
app.use(cors());

// Middleware for bodyparsing using both json and urlencoding
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen({ port: config.port }, () => {
  console.log(`Server ready at port: ${config.port}`)
});
