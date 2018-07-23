# express-logger-project
Small project to setup a logging endpoint based on incoming GET/POST requests.

# install/setup
Run `npm install` to setup dependencies.

# test locally
Run `node app.js` to start local server.

Send `GET` or `POST` requests to `http://localhost:3000/endpoint` in the following manner:

GET
```
http://localhost:3000/endpoint?bookId=getTest1&userId=getUser1
```

POST
```
url
http://localhost:3000/endpoint

header
Content-Type: application/json

body
{"userId":"poster123","bookId":"postItNotes2004"}
```

Look for `out.csv` file that should store incoming data.