const express = require('express');
var cors = require('cors');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');
const xml2js = require('xml2js');
const app = express();

var url = "https://myanimelist.net/malappinfo.php"
var userQuery = "?u=";
var animeQuery = "&status=all&type=anime";

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
})

app.post('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})

app.post('/getList', function (req, res) {
    getList(req);
});

function getList(req) {
    userQuery += req.body.username;
    axios.get(url + userQuery + animeQuery, {
        crossDomain: true,
    })
    .then(response => {
        xml2js.parseString(response.data, function(err, result) {
            console.log(result.myanimelist.anime.length);
        });
    })
    .catch(error => {
        console.log(error);
    });
};