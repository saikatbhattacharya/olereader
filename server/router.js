var requestHandler = require('../middleware/requestHandler');
var bodyParser = require('body-parser');
module.exports = function (app) {
    // parse application/x-www-form-urlencoded 
    app.use(bodyParser.urlencoded({ extended: false }))

    // parse application/json 
    app.use(bodyParser.json())
    
    app.get('/', function (req, res) {
        res.send('hello world')
    })

    app.post('/myname', function (req, res) {
        console.log(" Sending request..... ", req.body);
        requestHandler.postMyname(req.body.name, res);
    })
}