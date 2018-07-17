const express = require('express');
var cors = require('cors');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');
const xml2js = require('xml2js');
const app = express();
const cheerio = require('cheerio');
const rp = require('request-promise');
var fs = require('fs');

var url = "https://myanimelist.net/mlappinfo.php";
var userQuery = "https://kitsu.io/api/edge/users?filter[name]=";
var libraryQuery = "https://kitsu.io/api/edge/library-entries?filter[userId]=";
var animeQuery = "&status=all&type=anime";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('index', {
        userId: null,
        animeList: null,
        friendList: null,
        error: null
    });
});

app.post('/', function (req, res) {
    res.render('index', {
        userId: null,
        animeList: null,
        friendList: null,
        error: null
    });
});

app.post('/getUserId', function (req, res) {
    getUserId(req, res);
});

app.post('/getList', function (req, res) {
    getList(req, res).then(anime => getAnimeNames(anime, res));
})

app.post('/getFriends', (req, res) => {
    getFriends(req, res);
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})

function getUserId(req, res) {
    var query = userQuery + req.body.username;
    axios.get(query, {
        crossDomain: true,
    })
    .then(response => {
        var data = response.data.data;
        var id = data[0].id;
        res.render('index', {
            userId: id,
            animeList: null,
            friendList: null,
            error: null
        });
    })
    .catch(error => {
        res.render('index', {
            userId: null,
            animeList: null,
            friendList: null,
            error: 'Error: ' + error
        });
    })
}

async function getList(req, res) {
    var query = libraryQuery + req.body.userId;
    var totalAnime = 0;
    var anime = [];
    async function libraryRequest() {
        await axios.get(query, {
            crossDomain: true,
        })
        .then(async response => {
            var data = response.data.data;
            totalAnime = response.data.meta.count;
            var animeData = Array.from(data, x => x.relationships.anime.links.related);
            anime = anime.concat(animeData);
            query = response.data.links.next;
            if (query != undefined) {
                await libraryRequest();
            }
        })
        .catch(error => {
            res.render('index', {
                userId: null,
                animeList: null,
                friendList: null,
                error: 'Error: ' + error
            });
        });
    };

    await libraryRequest();

    return anime;
};

async function getAnimeNames(anime, res) {
    var titleList = [];

    await (async () => {
        for (const query of anime) {
            await axios.get(query, {
                crossDomain: true,
            })
            .then(response => {
                var data = response.data.data;
                if (data != null) {
                    var attr = data.attributes;
                    var titles = attr.titles;
                    if (titles.en_jp != undefined) {
                        titleList.push(titles.en_jp);
                    } else if (titles.en_cn != undefined) {
                        titleList.push(titles.en_cn);
                    } else if (titles.en_us != undefined) {
                        titleList.push(titles.en_us);
                    } else if (titles.en != undefined) {
                        titleList.push(titles.en);
                    }
                }
            })
            .catch(error => {
                res.render('index', {
                    userId: null,
                    animeList: null,
                    friendList: null,
                    error: 'Error: ' + error
                });
            });
        };
    })();

    res.render('index', {
        userId: null,
        animeList: titleList,
        friendList: null,
        error: null
    });
}

function getFriends(req, res) {
    var username = req.body.username;
    const options = {
        uri: "https://myanimelist.net/profile/" + username + "/friends",
        transform: (body) => {
            return cheerio.load(body);
        }
    }

    rp(options)
        .then((data) => {
            var friendList = []
            data('.friendBlock').each((i, elem) => {
                var friend = data(elem).find('div > a > strong').html()
                friendList.push(friend)
            })
            res.render('index', {
                userId: null,
                animeList: null,
                friendList: friendList,
                error: null
            });
        })
        .catch((err) => {
            res.render('index', {
                userId: null,
                animeList: null,
                friendList: null,
                error: 'Error' + error
            });
        });
};