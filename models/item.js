const mongoose = require('mongoose');

const itemsSchema = new mongoose.Schema ({
  name: {type:String, default:''}
}, { timestamps: true });

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({
  name: 'Welcome to your todolist!'
});

const item2 = new Item({
  name: '<-- Hit this to erase note'
});

const defaultItems = [item1, item2];


module.exports = {
  defaultItems,
  Item,
  itemsSchema
};