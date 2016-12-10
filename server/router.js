module.exports = function (app) {
    app.get('/', function (req, res) {
        res.send('hello world')
    })

    app.get('/myname', function (req, res) {
        res.send('hello Manisha')
    })
}