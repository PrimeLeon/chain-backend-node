const express = require('express');
const router = require('./router');
const fs = require('fs');
const https = require('https');
const cors = require('cors');

const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use('/', router);

const server = app.listen(5000, () => {
  const { address, port } = server.address();
  console.log(`Http server activated ${address}:${port}`);
})