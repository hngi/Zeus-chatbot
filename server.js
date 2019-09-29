    // server.js

    require('dotenv').config({ path: 'variables.env' });

    const express = require('express');
    const bodyParser = require('body-parser');
    const cors = require('cors');
    const path = require('path');


    const processMessage = require('./process-message');

    const app = express();


    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));


    app.post('/chat', (req, res) => {
      const { message } = req.body;
      processMessage(message);
    });

  if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

    app.set('port', process.env.PORT || 5000);
    const server = app.listen(app.get('port'), () => {
      console.log(`Express running → PORT ${server.address().port}`);
    });