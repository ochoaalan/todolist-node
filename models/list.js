const mongoose = require('mongoose');

const {itemsSchema} = require('./item');

const listSchema = new mongoose.Schema ({
  name: {type:String, default:''},
  items: [itemsSchema]
});

const List = mongoose.model('List', listSchema);

module.exports = List;