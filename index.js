var express  = require('express');
var d3Format = require('d3-format');
var request  = require('request');
var cheerio  = require('cheerio');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res, next) {
  // http://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
  var min = 1, max = 10;
  var page = Math.floor(Math.random() * (max - min + 1)) + min;

  var format = d3Format.format('02');

  var url = "http://textgifs.de/montag/montag" + format(page) + '.htm'

  request({url: url}, function(err, response, body) {
    if (err) {
      next(new Error(err));
    } else {
      var $ = cheerio.load(body);
      var images = $('img').filter(function() {
        return $(this).attr('src').startsWith('montag');
      });

      var src = images.eq(Math.floor(Math.random() * images.length)).attr('src');
      res.json({
        attachments: [{
          fallback: 'montag',
          image_url: ("http://textgifs.de/montag/" + images.first().attr('src')),
        }],
      });
    }
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


