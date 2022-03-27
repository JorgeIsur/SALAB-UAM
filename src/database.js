const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/salab', {
})
  .then(db => console.log('DB is connected.'))
  .catch(err => console.log(err));