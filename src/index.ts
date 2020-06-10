import express from 'express';
import { Config } from './environment/config';
import { Environment } from './environment/environment';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

const config: Config = Environment.getConfig();

// Middleware for CORS
app.use(cors());

// Middleware for bodyparsing using both json and urlencoding
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen({ port: config.port }, () => {
  console.log(`Server ready at port: ${config.port}`)
});
