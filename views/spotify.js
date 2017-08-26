var allSongs = []; //where all songs from an artist will be stored as spotify track objects
var artistID =""; //artistID from searchArtist
var current = 0; //current song index

//Gets field from artist-search input. Sets global artistID to search result
//Changes image to that of artist
function searchArtist(){
  var artistName = document.getElementById("artist-search").value;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      param = JSON.parse(this.responseText);
      $.ajax({
        url: "https://api.spotify.com/v1/search?q=" + artistName + "&type=artist&market=US&limit=1",
        headers: {
          'Authorization': 'Bearer ' + param.Token
        },
        success: function(response) {
          console.log(response);
          artistID = (response.artists.items)[0].id;
          document.getElementById("albumArt").src = ((response.artists.items)[0].images)[2].url;
        }
      });
    }
  };
  xhttp.open("GET", "/token", true);
  xhttp.send();
}

//Gets artistID from a previously run searchArtist(). Stores all songs from that artist in allSongs.
function getTracksFromArtistSearch() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      param = JSON.parse(this.responseText);
      getTracksFromArtist(artistID);
    }
  };
  xhttp.open("GET", "/token", true);
  xhttp.send();
}
//Given artistID, gets all tracks by first finding all albums from artist. Songs stored in allSongs
//Parameter: artistID
function getTracksFromArtist(artistID){
  $.ajax({
    url: "https://api.spotify.com/v1/artists/" + artistID + "/albums?market=US&album_type=album,single",
    headers: {
      'Authorization': 'Bearer ' + param.Token
    },
    success: function(response) {
      albums = response.items;
      for (var i =0; i<albums.length;i++){
        currentAlbum = albums[i];
        getTracksFromAlbum(currentAlbum);
      }
    }
  });
}

//Given albumID, gets all tracks from album and stores them in allSongs
//Parameter: albumID
function getTracksFromAlbum(currentAlbum){
    $.ajax({
      url: "https://api.spotify.com/v1/albums/"+ currentAlbum.id+"/tracks?market=US",
      headers: {
        'Authorization': 'Bearer ' + param.Token
      },
      success: function(response) {
        console.log(response);
        songs = response.items;
        for (var i =0; i<songs.length;i++){
          url = songs[i].preview_url;
          if (url != null){
            allSongs.push(songs[i]);
          }
        }
      }
    });
}

//Plays next song in allSongs
function next(){
  if (current<allSongs.length){
    document.getElementById("trackPreview").src = allSongs[current].preview_url;
    current=current+1;
  }
}
//Plays previous song in allSongs
function previous(){
  if (current>0){
    document.getElementById("trackPreview").src = allSongs[current].preview_url;
    current=current-1;
  }
}



//@deprecated
//Method originally used to search for artist and load songs at same time
//Parameter: searhInput
function getTracksFromSearch(artistName){
  artist = encodeURIComponent(artistName);
  $.ajax({
    url: "https://api.spotify.com/v1/search?q=" + artist + "&type=artist&market=US&limit=1",
    headers: {
      'Authorization': 'Bearer ' + param.Token
    },
    success: function(response) {
      artistID = (response.artists.items)[0].id;
      getTracksFromArtist(artistID)
    }
  });
}