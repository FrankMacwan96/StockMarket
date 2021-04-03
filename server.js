const express = require('express');
const bodyParser = require('body-parser');
// create express app
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

var sessions = require('client-sessions');

app.use(sessions({
    cookieName: 'session',
    secret: '0GBlJZ9EKBt2Zbi2flRPvztczCewBxXK',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
  }));

  
// parse application/json
app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
	useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

require('./app/routes/note.routes.js')(app);   

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});