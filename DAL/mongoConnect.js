var mongoose = require('mongoose');
var config = require('../config');
var schema = require('./schema.json');

mongoose.connect(config.mongodb);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected!!")
});

module.exports = {
  POST : function(collection,query,cb){
    var mongooseSchema = new mongoose.Schema(schema[collection]);
    var Model = mongoose.model(collection,mongooseSchema);
    var newModel = new model(query);

    newModel.save(function(err,data){
      if(err){
        cb(err);
      }
      else{
        cb(null,data);
      }
    })
  },
  GET: function(collection,cb){
    var mongooseSchema = new mongoose.Schema(schema.collection);
    var model = mongoose.model(collection,mongooseSchema);

    model.find(function(err,data){
      if(err){
        cb(err)
      }
      else{
        cb(null,data);
      }
    })
  }
}

