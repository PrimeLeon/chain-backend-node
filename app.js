const express = require('express');
const router = require('./router');
const cors = require('cors');

const { port_prod,port_dev } = require('./utils/constant').PORT

const bodyParser = require('body-parser');

const app = express();


app.use(express.static(__dirname + '/public'));

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use('/', router);

const server = app.listen(port_dev, () => {
  const { address, port } = server.address();
  console.log(`Http server activated ${address}:${port}`);
})