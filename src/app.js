const express = require('express')
const app = express();

const bodyParser = require('body-parser');
const csvWriter = require('csv-write-stream');
const fs = require('file-system');
const csvFileName = 'output/out.csv';
const rawFileName = 'output/out.log';
const headers = [
  'timestamp', 
  'auctionId', 
  'auctionDuration',
  'auctionStart',
  'auctionFinished',
  'auctionTimeout',
  'auctionTimedOut',
  'timedOutBidders',
  'bidder',
  'requestStart',
  'requestFinished',
  'requestTook'
];

const port = 3001;

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

function parseBody(payload) {
  try {
    payload = JSON.parse(payload);
  } catch(e) {
    console.log('error parsing raw data');
  }
  
  let result = [];
  let data = {
    auctionId: payload.auctionId,
    auctionDuration: payload.auctionDuration,
    auctionStart: payload.auctionStart,
    auctionFinished: payload.auctionFinished,
    auctionTimeout: payload.auctionTimeout,
    auctionTimedOut: payload.auctionTimedOut,
    timedOutBidders: payload.timedOutBidders,
  }

  if (payload.bidder) {
    Object.keys(payload.bidder).forEach((bidderCode) => {
      payload['bidder'][bidderCode].forEach((obj) => {
        let temp = Object.assign({}, data, {
          bidder: bidderCode,
          requestStart: obj.requestStart,
          requestFinished: obj.requestFinished,
          requestTook: obj.requestTook,
        });
        result.push(temp);
      });
    });
  } else {
    let temp = Object.assign({}, data, {
      bidder: '',
      requestStart: '',
      requestFinished: '',
      requestTook: '',
    });
    result.push(temp);
  }
  
  return result;
}

app.use(bodyParser.text({type:'text/plain'}));

app.post('/csv', function (req, res) {
  let data = parseBody(req.body);
  data.forEach((log) => {
    writeDataToFile('csv', log);
  })
  res.set({
    'Access-Control-Allow-Credentials' : 'true',
    'Access-Control-Allow-Origin' : req.headers.origin
  });
  res.type('json');
  res.write(req.body);
  res.send();
});

app.get('/csv', function (req, res) {
  writeDataToFile('csv', req.query);

  res.send('Finished writing data to csv');
});

app.post('/raw', function (req, res) {
  let data;
  try {
    data = JSON.parse(req.body);
  } catch(e) {
    console.log('error parsing raw data');
  }
  writeDataToFile('raw', data);

  res.set({
    'Access-Control-Allow-Credentials' : 'true',
    'Access-Control-Allow-Origin' : req.headers.origin
  });
  res.type('json');
  res.write(req.body);
  res.send();
});

app.listen(port, () => console.log('Listening on port '+ port));
startup();