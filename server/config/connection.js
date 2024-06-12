const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://motta:baFi5HJmumvX4NtL@cluster0.gdbtbna.mongodb.net/cleanDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

module.exports = mongoose.connection;
