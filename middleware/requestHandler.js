var dbLayer = require('../DAL');
module.exports = {
    postMyname: function (name, res) {
        dbLayer.CREATE("test", {
            name: name,
            id: 001
        }, res)
    },

    postFile: function (req, res) {
        dbLayer.CREATE_FILE(req,res);
    },

    getFile: function (req,res) {
        dbLayer.GET_FILE(req,res);
    }
}