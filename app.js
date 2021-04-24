require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const listRoutes = require('./routes/listRoutes');

const favicon = require('serve-favicon');
const path = require('path');

//express app
const app = express();

//view engine
app.set('view engine', 'ejs');

//middleware & static files
app.use(express.urlencoded({extended: true})); //Parse URL-encoded bodies
app.use(express.static(path.join(__dirname, 'public')));

//connect to mongoDB
const url = process.env.MONGODB_URI;

mongoose.connect(url, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false })
  .then(result => app.listen(process.env.PORT || 3000))
  .catch(err => console.log(err))

//routes
app.use(listRoutes);