const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const Message = new Schema({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'author',
    required: true,
  },
  author_name: {
    type: String,
    required: true,
  },
});

Message.virtual('formal_date').get(function () {
  var formal_date = DateTime.fromJSDate(this.date).toLocaleString(
    DateTime.DATETIME_MED
  );
  return formal_date;
});

module.exports = mongoose.model('Message', Message);
