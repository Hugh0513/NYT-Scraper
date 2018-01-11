'use strict';

const db = require('./models');

const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/scraper", {});
//mongoose.connect("mongodb://heroku_dqs126r3:gtghhunrqqg00evv1f79jlq80l@ds245277.mlab.com:45277/heroku_dqs126r3", {}); // succeed!

db.mongoose = mongoose;

module.exports = db;