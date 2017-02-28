var mongoose = require('mongoose');
var config = require('../config');
var schema = require('./schema.json');
var responseHandler = require('../middleware/responseHandler');
var fs = require("fs");
var gfs;
var Grid = require("gridfs-stream");
Grid.mongo = mongoose.mongo;

var crypto = require('crypto'),
  algorithm = 'aes-256-cbc',
  password = 'test';

mongoose.connect(config.mongodb);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  gfs = Grid(db.db);
  console.log("Connected!!")
});

function encrypt(text) {
  var cipher = crypto.createCipher(algorithm, password)
  var crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex');
  return crypted;
}

module.exports = {
  CREATE: function (collection, query, res) {
    var mongooseSchema = new mongoose.Schema(schema[collection]);
    var Model = mongoose.model(collection, mongooseSchema);
    var newModel = new Model(query);

    newModel.save(function (err, data) {
      if (err) {
        responseHandler.errorRes(err, res);
      }
      else {
        responseHandler.response(data, res);
      }
    })
  },
  FINDALL: function (collection, cb) {
    var mongooseSchema = new mongoose.Schema(schema.collection);
    var model = mongoose.model(collection, mongooseSchema);

    model.find(function (err, data) {
      if (err) {
        cb(err)
      }
      else {
        cb(null, data);
      }
    })
  },
  CREATE_FILE: function (req, res) {
    //https://dinosaurscode.xyz/nodejs/2016/04/12/how-to-upload-images-to-mongodb-using-express/
    //create a gridfs-stream into which we pipe multer's temporary file saved in uploads. After which we delete multer's temp file.
    var writestream = gfs.createWriteStream({
      filename: req.file.originalname
    });
    //
    // //pipe multer's temp file /uploads/filename into the stream we created above. On end deletes the temporary file.
    fs.createReadStream("./uploads/" + req.file.filename)
      .on("end", function () {
        fs.unlink("./uploads/" + req.file.filename, function (err) {
          responseHandler.response({ msg: 'Success' }, res);
        })
      })
      .on("err", function () { responseHandler.errorRes({ err: "Error in upload" }, res); })
      .pipe(writestream);
  },
  GET_FILE: function (req, res) {
    res.set('Content-Disposition', 'attachment; filename="' + req.params.filename.substring(0,req.params.filename.lastIndexOf('.')) + '.xys"');
    var readstream = gfs.createReadStream({ filename: req.params.filename });
    var cipher = crypto.createCipher(algorithm, password);
    readstream.on("error", function(err){
        res.send("No image found with that title");
      });
      readstream.pipe(cipher).pipe(res);
  }
}

/********Decryption code *************/

/*
var fs = require('fs');
var crypto = require('crypto');

var key = 'test';
var decipher = crypto.createDecipher('aes-256-cbc', key);
var input = fs.createReadStream('./asamapta.xys');
var output = fs.createWriteStream('output.pdf');

input.pipe(decipher).pipe(output);

output.on('finish', function() {
  console.log('Encrypted file written to disk!');
});
*/

