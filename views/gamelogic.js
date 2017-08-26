var allSongs = []; //where all songs from an artist will be stored as spotify track objects
var artistID =""; //artistID from searchArtist
var current = 0; //current song index

//From spotify all songs are stored in window local storage.
function loadSongs(){
  allSongs = JSON.parse(window.localStorage.getItem('songs'));
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
