const express = require('express');
var cors = require('cors');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');
const xml2js = require('xml2js');
const app = express();
var fs = require('fs');

var url = "https://myanimelist.net/malappinfo.php"
var userQuery = "?u=";
var animeQuery = "&status=all&type=anime";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('index', {animeList: null, error: null});
});

app.post('/', function (req, res) {
    res.render('index', {animeList: null, error: null});
});

app.post('/getList', function (req, res) {
    getList(req, res);
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})

function getList(req, res) {
    var query = userQuery + req.body.username;
    axios.get(url + query + animeQuery, {
        crossDomain: true,
    })
    .then(response => {
        xml2js.parseString(response.data, function(err, result) {
            var animes = result.myanimelist.anime;
            var animeList = [];
            for (var anime of animes) {
                animeList.push(anime.series_title + '\n');
            }
            res.render('index', {animeList: animeList, error: null});
        });
    })
    .catch(error => {
        res.render('index', {animeList: null, error: 'Error' + error});
    });
};