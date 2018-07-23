const express = require('express')
const app = express();

const bodyParser = require('body-parser');
const csvWriter = require('csv-write-stream');
const fs = require('file-system');
const fileName = 'out.csv';
const port = 3000;

function startup() {
  const writer = csvWriter({sendHeaders: false});
  writer.pipe(fs.createWriteStream(fileName, {flags: 'a'}));
  writer.write({'timestamp':'timestamp','userId': 'userId', 'bookId': 'bookId'});
  writer.end();
}

function timeIs(){
  return Math.floor(Date.now() / 1000);
}

function writeDataToCsv(rawData) {
  if (Object.keys(rawData).length > 0) { 
    const logData = Object.assign({timestamp: timeIs()}, rawData);

    const writer = csvWriter({sendHeaders: false});
    writer.pipe(fs.createWriteStream(fileName, {flags: 'a'}));
    writer.write(logData);
    writer.end();
  } else {
    console.log('detected empty body...did not write to file');
  }
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/endpoint', function (req, res) {
  writeDataToCsv(req.body);

  res.json(req.body);
});

app.get('/endpoint', function (req, res) {
  writeDataToCsv(req.query);

  res.send('Finished writing data to csv');
});

app.listen(port, () => console.log('Listening on port '+ port));
startup();