var allSongs = []; //where all songs from an artist will be stored as spotify track objects
var artistID =""; //artistID from searchArtist
var current = 0; //current song index
var score = -1;
//load
function load(){
  loadSongs();
  correct();
}
//From spotify all songs are stored in window local storage.
function loadSongs(){
  allSongs = JSON.parse(window.localStorage.getItem('songs'));
  filterSongs();
  orderSongs();
}

function correct(){
  nextSong();
  updateChoices();
}
function incorrect(){
  lose();
}
function filterSongs(){
  var oneOccurenceSongs=[]
  for (var i=0;i<allSongs.length;i++){
    var song = allSongs[i];
    var occurred = false;
    for (var j=0;j<oneOccurenceSongs.length;j++){
      if (song.name===oneOccurenceSongs.name){
        occurred=true;
      }
    }
    if (!occurred){
      oneOccurenceSongs.push(song);
    }
  }
  allSongs=oneOccurenceSongs;
}
function orderSongs(){
  allSongs=allSongs;
}
function updateChoices(){
  var num = Math.floor(Math.random() * 4)+1;
  var songName = allSongs[current].name;
  var id= "song"+num;
  document.getElementById(id).innerText = songName;
  document.getElementById(id).onclick = correct;
  var randomSongs = generateRandomNumbers(allSongs.length,3,current);
  var x =0;
  for (var i=1;i<5;i++){
    if (num!=i){
        id= "song"+i;
        document.getElementById(id).innerText = allSongs[randomSongs[x]].name;
        document.getElementById(id).onclick = lose;
        x=x+1;
    }
  }
}
function generateRandomNumbers(range,resultCount,exclude){
  var myArray = [];
  while(myArray.length!=resultCount) {
      var numberIsInArray = false;
      var rand = Math.floor(Math.random() * range);
      for(var j = 0; j < myArray.length; j++){
          if(rand === myArray[j]) {
              numberIsInArray = true;
        }
        if (rand === exclude){
          numberIsInArray = true;
        }
      }
      if(!numberIsInArray){
        myArray.push(rand);
      }
  }
  return myArray;
}
//Plays next song in allSongs
function nextSong(){
  current=current+1;
  if (current<allSongs.length){
    document.getElementById("trackPreview").src = allSongs[current].preview_url;
    score=score+1;
  }else{
    if (current==allSongs.length){
      win();
    }
  }
}
function win(){
  console.log('win');
}
function lose(){
  console.log('lose');
}
//Plays previous song in allSongs
function previous(){
  if (current>0){
    document.getElementById("trackPreview").src = allSongs[current].preview_url;
    current=current-1;
  }
}
