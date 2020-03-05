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

app.get('/reverse_geocode', function(req, res) {
    var addressPayloadMock = {
        'status': 'success',
        'output-response': 'coords, etc.'
    }
    if(!req.query.longitude) {
        return res.send({'status': 'error', 'message': 'missing longitude'})
    } else if(!req.query.latitude) {
        return res.send({'status': 'error', 'message': 'missing latitude'})
    } else {
        var longitude = req.query.longitude
        var latitude = req.query.latitude
        var coords = longitude+','+latitude
        var cachebuster = Math.round(new Date().getTime() / 1000)
        var url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' +  coords +'.json?access_token=' + config.mapBoxAPIKey + '&cachebuster=' + cachebuster + '&autocomplete=true&types=address'
        console.log('url:', url)
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
                var addressPayload = {
                    'status': 'success',
                    'input_longitude': longitude,
                    'input_latitude': latitude,
                    'output_response': JSON.parse(body)
                }
                return res.send(addressPayload)
            } else {
                return res.send(addressPayloadMock)
            }
        })
    }
})
//