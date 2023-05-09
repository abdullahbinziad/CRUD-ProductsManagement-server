const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 5000;

// Connection URL
const url = 'mongodb://localhost:27017/myproject';

// Database Name
const dbName = 'myproject';
MongoClient.connect(url, function(err, client) {
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  app.get('/', (req, res) => {
    db.collection('documents').find({}).toArray(function(err, docs) {
      res.send(docs);
    });
  });

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});
