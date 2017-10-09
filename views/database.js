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
        if (score>oldScore){
          writeAllData(artist,user,score);
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
  console.log(snapshot.val());
  //Method to be filled as needed
  //Parameter is a snapshot with key as either an artist or user and value score
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
