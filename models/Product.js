const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductsSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description:  {
    type: String,
    required: false
  },
  price:  {
    type: String,
    required: false
  },
  photos:  {
    type: Array,
    required: false
  },
  userId: {
    type: String,
    required: true
  }
});

module.exports = Product = mongoose.model('products', ProductsSchema);
