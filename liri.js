require("dotenv").config();
var request = require('request'); // "Request" library
var spotify = require('spotify');

var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

var sourceFile = require("./keys");

var args = process.argv;
var command = args[2]; 
var query = "";
for(var i=3; i<args.length;i++){
    query += args[i] + " ";
}

function printAlbums(body){
    console.log("");
    for(var i=0; i<body.albums.items.length; i++){
        var item = body.albums.items[i];
        //console.log(item);
        for(var j = 0; j < item.artists.length; j++){
            console.log(item.artists[j].name);
        }
      console.log(item.href);
      console.log(item.name);
      console.log("");
    }
}

function getSongDefault(){
    getSong("i saw the sign");
}

function getSong(song){
    var query = "?limit=20&type=album&q=";
    //q=%22doom%20metal%22&type=playlist"
    query += encodeURI(song);
    console.log(query);
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          'Authorization': 'Basic ' + (new Buffer.from(sourceFile.spotify.id + ':' + sourceFile.spotify.secret).toString('base64'))
        },
        form: {
          grant_type: 'client_credentials'
        },
        json: true
      };
      
      request.post(authOptions, function(error, response, body) {
          if (!error && response.statusCode === 200) {
              // use the access token to access the Spotify Web API
              var token = body.access_token;
              var options = {
              url: 'https://api.spotify.com/v1/search'+query,
              headers: {
                  'Authorization': 'Bearer ' + token
              },
              json: true
              };
              request.get(options, function(error, response, body){
                  if(body.albums.items.length > 0){
                        printAlbums(body);
                  }
                  else{
                      getSongDefault();
                  }
              });
          }
      });
}

if(command == "spotify-this-song"){
    getSong(query);
}
