var requestHandler = require('../middleware/requestHandler');
var bodyParser = require('body-parser');
var multer = require("multer");
var upload = multer({ dest: "./uploads" });
var path = require('path');

module.exports = function (app) {
    // parse application/x-www-form-urlencoded 
    app.use(bodyParser.urlencoded({ extended: false }))

    // parse application/json 
    app.use(bodyParser.json())

    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname + '/index.html'));
    })

    app.post('/myname', function (req, res) {
        console.log(" Sending request..... ", req.body);
        requestHandler.postMyname(req.body.name, res);
    })

    app.post("/fileupload", upload.single("filename"), function (req, res) {
        console.log("***** ", req.files);
        requestHandler.postFile(req, res);
    });
}