# Visual MAL

Visual MAL is a website that focuses mainly on data visualization of 
myanimelist.com profile.

This website is inspired by [GRAPH.ANIME.PLUS](https://graph.anime.plus/).

## Instructions

Install node modules with `node install` then execute `node main.js` to run server. 
Website is available at `localhost:3000`.

## Todo

- History of all anime broken down by {episode, season} by {day, week, month, year} as a timeline or a gantt chart
- distribution of score vs {time/date, genre, rating, tags, etc}
- Comparison of you vs friends for any of the above metric
- Recent history graph
- Eps per day/week/month as a bar chart for >21 days ago

## MyAnimeList API

**Note: Postman is recommended**

[Official MAL API document](https://myanimelist.net/modules.php?go=api) 

Get user's anime list:
```
curl "https://myanimelist.net/malappinfo.php?status=all&type=anime&u=USERNAME"
```

**Note: The following are requests for html results and the results need to parse before using**

Get user's friend list:
```
curl "https://myanimelist.net/profile/USERNAME/friends"
```

Get watching history per anime (may need to handle cookies/credentials to bypass login):
```
curl "https://myanimelist.net/ajaxtb.php?keepThis=true&detailedaid=36038&TB_iframe=true"
```

## License

MIT License
