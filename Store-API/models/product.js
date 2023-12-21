const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, "Product's name is required"],
  },
  price: {
    type: Number,
    require: [true, "Product's price is required"],
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  company: {
    type: String,
    enum: {
      values: ['ikea', 'liddy', 'marcos', 'caressa'],
      message: '{VALUE} is not supperted!',
    },
    // enum: ['ikea', 'liddy', 'marcos', 'caressa'],
  },
  featured: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Products', productSchema);
