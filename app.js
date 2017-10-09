//Ensures all required modules are in directory
var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    passport = require('passport'),
    swig = require('swig'),
    consolidate = require('consolidate'),
    SpotifyStrategy = require('passport-spotify').Strategy;

//Global variable to be used for storing accessTokens
var token = "";

// These should be hidden from GitHub eventually in config file
var client_id = 'f46a5b9d4e114fa8ac0aedbc4fd9f2b8'; // Your client id
var client_secret = '80ae9abb0f7443e5a5360a18562cd0c9'; // Your secret
var redirect_uri = 'https://soundsleuth.herokuapp.com/callback'; // Your redirect uri


//Should store just ID
passport.serializeUser(function(user, done) {
  done(null, user);
});
//Should retrieve full user profile from just the id as object
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Sets up the SpotifyStrategy within Passport.
passport.use(new SpotifyStrategy({
  clientID: client_id,
  clientSecret: client_secret,
  callbackURL: redirect_uri
  },
  function(accessToken, refreshToken, profile, done) {
    token = accessToken;
    process.nextTick(function () {
      // Returns users spotify profile
      return done(null, profile);
    });
  }));


const app = express();
  // configure Express
  app.set('views', __dirname);
  app.set('view engine', 'ejs');
  app.use(express.static('views'));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(session({ secret: 'keyboard cat',
                    resave: true,
                    saveUninitialized: true}));
  app.engine('html', consolidate.swig);
  // Initialize Passport!  Also uses passport.session() middleware to support persistent login sessions
  app.use(passport.initialize());
  app.use(passport.session());

  //Renders main page
  app.get('/', function(req, res){
    res.render('./views/index.html', { user: req.user });
  });
  //Renders game page
  app.get('/play', ensureAuthenticated, function(req, res){
    res.render('./views/play.html', { user: req.user });
  });
  //Renders game page
  app.get('/game', ensureAuthenticated, function(req, res){
    res.render('./views/game.html', { user: req.user });
  });
  //Renders instruction page
  app.get('/instructions', function(req, res){
    res.render('./views/instructions.html', { user: req.user });
  });
  //Uses passport to authenticate the user via a redirection to spotify.com
  app.get('/login',
    passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private'], showDialog: true}),
    function(req, res){
  // The request will be redirected to spotify for authentication, so this function will not be called.
  });
  app.get('/endGame', function(req, res){
    res.render('./views/endGame.html', { user: req.user });
  });
  app.get('/highscores', function(req, res){
    res.render('./views/highscores.html', { user: req.user });
  });
  //Returns a JSON object with all important user info
  app.get('/token',function(req, res){
          return res.json({ Token: token, Id: req.user.id, Photo: req.user.photos[0]});
      });
  //After spotify authentication this is called
  app.get('/callback',
    passport.authenticate('spotify', { failureRedirect: '/' }),
    function(req, res) {
      res.redirect('/play');
    });
  //Logs user out and sends them to main page
  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
//Checks if the user is authenticated and redirects to login page if not
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}


//console.log('Listening on 8888');
var port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
