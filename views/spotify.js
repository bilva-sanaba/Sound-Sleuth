allSongs = []

function onLoad() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      param = JSON.parse(this.responseText);
      //Uses a hard coded request URL to find a song and play it
      demoSearch()
      //TODO: Method currently logs all Artists' albums
      //For some reason all songs have no preview_url with this method
      //searchArtistSongs("eminem");

    }
  };
  xhttp.open("GET", "/token", true);
  xhttp.send();
}
function demoSearch(){
  $.ajax({
    url: "https://api.spotify.com/v1/tracks/0pSBuHjILhNEo55xK1zrRt",
    headers: {
      'Authorization': 'Bearer ' + param.Token,
    },
    success: function(response) {
      document.getElementById("trackPreview").src = response.preview_url;
    }
  });
}

function searchArtistSongs(artistName){
  $.ajax({
    url: "https://api.spotify.com/v1/search?q=" + artistName + "&type=artist&limit=1&market=US",
    headers: {
      'Authorization': 'Bearer ' + param.Token
    },
    success: function(response) {
      artistID = (response.artists.items)[0].id;
      searchArtistAlbums(artistID)
      //document.getElementById("trackPreview").src = response.preview_url;
    }
  });
}
function searchArtistAlbums(artistID){
  $.ajax({
    url: "https://api.spotify.com/v1/artists/" + artistID + "/albums?market=US&album_type=album",
    headers: {
      'Authorization': 'Bearer ' + param.Token
    },
    success: function(response) {
      albums = response.items;
      for (var i =0; i<albums.length;i++){
        currentAlbum = albums[i];
        searchAlbumTracks(currentAlbum);
      }
    }
  });
}
function searchAlbumTracks(currentAlbum){
    $.ajax({
      url: "https://api.spotify.com/v1/albums/"+ currentAlbum.id+"/tracks?market=US",
      headers: {
        'Authorization': 'Bearer ' + param.Token
      },
      success: function(response) {
        console.log(response)
      }
    });
}
