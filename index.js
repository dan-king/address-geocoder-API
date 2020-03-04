var express = require('express')
var request = require('request')
var config = require('./config.json')
var app = express()
app.set('port', config.port || 3000)

var server = app.listen(app.get('port'), function () {
    console.log('Listening on port %s.', server.address().port)
    console.log('Website live at http://localhost:' +
    app.get('port') + '/?address=100+Main+St')
    console.log('press Ctrl-C to terminate.')
})

app.get('/', function(req, res) {
    var addressPayloadMock = {
        'status': 'success',
        'input-address': req.query.address,
        'output-response': 'coords, etc.'
    }
    if(!req.query.address) {
        return res.send({'status': 'error', 'message': 'missing address'})
    } else {
        var address = encodeURIComponent(req.query.address)
        var cachebuster = Math.round(new Date().getTime() / 1000)
        var url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' +  address +'.json?access_token=' + config.mapBoxAPIKey + '&cachebuster=' + cachebuster + '&autocomplete=true&types=address'
        console.log('url:', url)
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
                var addressPayload = {
                    'status': 'success',
                    'input-address': req.query.address,
                    'output-response': JSON.parse(body)
                }
                return res.send(addressPayload)
            } else {
                return res.send(addressPayloadMock)
            }
        })
    }
})
