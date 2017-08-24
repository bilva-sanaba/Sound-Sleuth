function onLoad() {
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    console.log(this.responseText);
    param = JSON.parse(this.responseText);
    console.log(param)
    userID = param.Id;

    console.log(userID);
    //userPhoto = param.Photo;
    //console.log(userPhoto);

    //Use param which has token, for retrieving and playing a track
  }
};
xhttp.open("GET", "/token", true);
xhttp.send();
}
