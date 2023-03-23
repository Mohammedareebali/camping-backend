const mongooses = require('mongoose')
const campSchema = new mongooses.Schema({
  name: String,
  location: String,
  description: String,
  imageUrl: String,
  userId: String,
  coordinates: [Number, Number],
  bed: Number,
  price: Number,
  wifi: Boolean,
  reviews: Number
});

campSchema.statics.search = function (query: string) {
  const regex = new RegExp(query, 'i');
  return this.find({
    $or: [{ name: regex }, { location: regex }, { description: regex }],
  });
};

module.exports = mongooses.model('Camp', campSchema);
