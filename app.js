var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    request = require('request'),
    querystring = require('querystring'),
    session = require('express-session'),
    passport = require('passport'),
    swig = require('swig'),
    consolidate = require('consolidate'),
    localStorage = require('node-localstorage')
    SpotifyStrategy = require('./node_modules/passport-spotify/lib/passport-spotify').Strategy;


// These should be hidden from GitHub (stored in firebase)
var client_id = 'f46a5b9d4e114fa8ac0aedbc4fd9f2b8'; // Your client id
var client_secret = '80ae9abb0f7443e5a5360a18562cd0c9'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the SpotifyStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and spotify
//   profile), and invoke a callback with a user object.
passport.use(new SpotifyStrategy({
  clientID: client_id,
  clientSecret: client_secret,
  callbackURL: redirect_uri
  },
  function(accessToken, refreshToken, profile, done) {
    token = accessToken;
    // asynchronous verification, for effect...
    process.nextTick(function () {
      // To keep the example simple, the user's spotify profile is returned to
      // represent the logged-in user. In a typical application, you would want
      // to associate the spotify account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }));

const app = express();
var token = "";
  // configure Express
  app.set('views', __dirname);
  app.set('view engine', 'ejs');

  app.use(express.static('views'));
  app.use(cookieParser());
  app.use(bodyParser());
  app.use(methodOverride());
  app.use(session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());

  app.engine('html', consolidate.swig);

  app.get('/', function(req, res){
    res.render('./views/index.html', { user: req.user });
  });

  app.get('/play', ensureAuthenticated, function(req, res){
    res.render('./views/play.html', { user: req.user });
  });

  app.get('/instructions', function(req, res){
    res.render('./views/instructions.html', { user: req.user });
  });

  app.get('/login',
    passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private'], showDialog: true}),
    function(req, res){
  // The request will be redirected to spotify for authentication, so this
  // function will not be called.
  });
  // GET /auth/spotify/callback
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request. If authentication fails, the user will be redirected back to the
  //   login page. Otherwise, the primary route function function will be called,
  //   which, in this example, will redirect the user to the home page.
  app.get('/token',function(req, res){
          return res.json({ Token: token, Id: req.user.id, Photo: req.user.photos[0]});
      });

  app.get('/callback',
    passport.authenticate('spotify', { failureRedirect: '/' }),
    function(req, res) {
      if (typeof localStorage === "undefined" || localStorage === null) {
        var LocalStorage = require('node-localstorage').LocalStorage;
        localStorage = new LocalStorage('./scratch');
      }
      //save it in a firebase
      // localStorage.setItem('token', token);
      // console.log(localStorage.getItem('token'));
      // localStorage.setItem('id', req.user.id);
      // console.log(localStorage.getItem('id'));
      // localStorage.setItem('photo', req.user.photos[0]);
      // console.log(localStorage.getItem('photo'));
      res.redirect('/play');
    });

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

console.log('Listening on 8888');
app.listen(8888);
