var allSongs = []; //where all songs from an artist will be stored as spotify track objects
var artistID =""; //artistID from searchArtist
var current = 0; //current song index
var score = -1;
var allScores = [];

//Generates song list and starts first song
function load(){
  loadSongs();
  correct();
}

//Retrieves songs stored in localStorage. Filters unwanted songs and orders them.
function loadSongs(){
  allSongs = JSON.parse(window.localStorage.getItem('songs'));
  filterSongs();
  orderSongs();
}

//Removes unwanted songs, currently removes duplicates ie songs that have same name
function filterSongs(){
  var oneOccurenceSongs=[]
  for (var i=0;i<allSongs.length;i++){
    var song = allSongs[i];
    var occurred = false;
    for (var j=0;j<oneOccurenceSongs.length;j++){
      if (song.name===oneOccurenceSongs[j].name){
        occurred=true;
      }
    }
    if (!occurred){
      oneOccurenceSongs.push(song);
    }
  }
  allSongs=oneOccurenceSongs;
}
//Randomly shuffles song order
function orderSongs(){
  for (let i = allSongs.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [allSongs[i - 1], allSongs[j]] = [allSongs[j], allSongs[i - 1]];
    }
}
//For correct answer, goes to next song and changes buttons
function correct(){
  nextSong();
  updateChoices();
}
//For incorrect answer, lose game
function incorrect(){
  lose();
}

//Plays next song in allSongs. Increases score by one. If no more songs, wins game.
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

//Changes song names of buttons and appropriately sets onclick methods
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
//Parameters: range - numbers that could be included
// resultCount - number of unique random numbers
// exclude - number to exclude
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

//What to do when win
function win(){
  window.localStorage.setItem('correct', current);
  window.localStorage.setItem('total', allSongs.length);
  window.location.href = '/endGame';
}
//What to do when lose
function lose(){
  window.localStorage.setItem('correct', current-1);
  window.localStorage.setItem('total', allSongs.length);
  window.location.href = '/endGame';
}
function showScores(){
  updateHighScore(window.localStorage.getItem('user'),
                  window.localStorage.getItem('artist')
                  ,window.localStorage.getItem('correct'));
  getScores(window.localStorage.getItem('artist'),"Artists/");
}
// @deprecated
function previous(){
  if (current>0){
    document.getElementById("trackPreview").src = allSongs[current].preview_url;
    current=current-1;
  }
}

//Should be hid in config file
function initializeFirebase(){
  //Sound-Sleuth settings
  var config = {
    apiKey: "AIzaSyBy26gElIgeGYW2pb5GUCRRlk6VrZA92P4",
    authDomain: "sound-sleuth.firebaseapp.com",
    databaseURL: "https://sound-sleuth.firebaseio.com",
    projectId: "sound-sleuth",
    storageBucket: "sound-sleuth.appspot.com",
    messagingSenderId: "1080981823828"
  };
  firebase.initializeApp(config);
}
//Checks if score is a new high score, if so updates database
function updateHighScore(user,artist,score){
  var db=firebase.database();
   db.ref('Users/'+user+'/'+artist).once('value').then(function(snapshot) {
      oldScore = snapshot.val();
        if (parseInt(score)>oldScore){
          writeAllData(artist,user,parseInt(score));
      }
  });
}
//Adds data for a new high score to database
function writeAllData(artist,user,score){
  writeData(artist,user,score,'Artists/');
  writeData(user,artist,score,'Users/');
}
//Adds data to one child of database
function writeData(top,key,value,directory){
  var db = firebase.database();
  var updatedObj = {};
  updatedObj[key] = value;
  db.ref(directory+top).update(updatedObj);
}
//Gets highscores for a user or artist looping through them
function getScores(key,directory){
  var query=firebase.database().ref(directory+key).orderByKey();
   query.once('value').then(function(snapshot) {
     snapshot.forEach(function(child){
       useScores(child);
     });
   });
}

function useScores(snapshot){
  //Method to be filled as needed
  //Parameter is a snapshot with key as either an artist or user and value score
}

function getScores(key,directory){
  var query=firebase.database().ref(directory+key).orderByValue();
   query.once('value').then(function(snapshot) {
     snapshot.forEach(function(child){
       allScores.push([child.key,child.val()]);
     });
     allScores.reverse();
     fillHighScoreTable(allScores);
   });
}

//This should populate the table as it is given a snapshot with key name and value score
function useScores(snapshot){
  //Method to be filled as needed
  //Parameter is a snapshot with key as either an artist or user and value score
}




function fillHighScoreTable(allScores){
  var rank = 1;
  prevScore=0;
  for (var i=0;i<allScores.length;i++){
    if (prevScore>allScores[i][1]){
      rank=rank+1;
    }
    prevScore = allScores[i][1];
    var row = $("<tr>");
    row.append(makeDataRow(allScores[i],rank));
    $("#myTable tbody").append(row);
  }
  //put into table rank, key val, 
}

  function makeDataRow(score,rank){
    var ret = "<td>" + rank +"" + "</td>";
    ret = ret +  "<td>" + score[0] + "</td>";
    ret = ret +  "<td>" + score[1] + "</td></tr>";
    return ret;
  }


function showUserScores(){
  user = window.localStorage.getItem('user');
  var query=firebase.database().ref("Users/"+user).orderByValue();
   query.once('value').then(function(snapshot) {
     snapshot.forEach(function(child){
       allScores.push([child.key,child.val()]);
     });
     allScores.reverse();
     fillHighScoreTable(allScores);
   });
}























//TESTING METHODS (to be removed)
// Helper method for testing. Retrieves data from fields (fields must be unccomented from index.html)
function storeScores(){
  var artist = document.getElementById('artist').value;
  var user = document.getElementById('name').value;
  var score = document.getElementById('score').value;
  //Add method here to test database with appropriate parameters
  updateHighScore(user,artist,score);
}
