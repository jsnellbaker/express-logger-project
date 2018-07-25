const express = require('express')
const app = express();

const bodyParser = require('body-parser');
const csvWriter = require('csv-write-stream');
const fs = require('file-system');
const csvFileName = 'output/out.csv';
const rawFileName = 'output/out.log';
const headers = ['timestamp', 'userId', 'bookId'];
const port = 3000;

function startup() {
  const writer = csvWriter({sendHeaders: false});
  writer.pipe(fs.createWriteStream(csvFileName, {flags: 'a'}));
  let headerLine = {};
  headers.forEach(item => headerLine[item] = item);
  writer.write(headerLine);
  writer.end();
}

function timeIs(){
  return Math.floor(Date.now() / 1000);
}

function writeDataToFile(type, rawData) {
  if (Object.keys(rawData).length > 0) { 
    const logData = Object.assign({timestamp: timeIs()}, rawData);

    if (type === 'csv') {
      const writer = csvWriter({sendHeaders: false});
      writer.pipe(fs.createWriteStream(csvFileName, {flags: 'a'}));
      writer.write(logData);
      writer.end();
    } else if (type === 'raw') {
      let logDataStr = JSON.stringify(logData) + "\n";
      fs.appendFile(rawFileName, logDataStr, (err) => {
        if (err) throw err;
      });
    }
  } else {
    console.log('detected empty body...did not write to file');
  }
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/csv', function (req, res) {
  writeDataToFile('csv', req.body);

  res.json(req.body);
});

app.get('/csv', function (req, res) {
  writeDataToFile('csv', req.query);

  res.send('Finished writing data to csv');
});

app.post('/raw', function (req, res) {
  writeDataToFile('raw', req.body);

  res.json(req.body);
});

app.listen(port, () => console.log('Listening on port '+ port));
startup();