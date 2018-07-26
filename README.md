# express-logger-project
Small project to setup a logging endpoint based on incoming GET/POST requests.

# install/setup
Run `npm install` to setup dependencies.

# test locally
Run `npm start` to start local server.

Send `POST` requests to `http://localhost:3001/csv` in the following manner:

POST
```
url
http://localhost:3001/csv

header
Content-Type: text/plain

body
{"userId":"poster123","bookId":"postItNotes2004"}
```

Look for `output/out.csv` file that should store incoming data.