import express from 'express';
import mongoose, { Error } from 'mongoose';
import dotenv from "dotenv";
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import User from './User';
import { IMongoDBUser } from './types'
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GitHubStrategy = require('passport-github').Strategy;


dotenv.config();

const app = express();

mongoose.connect(`${process.env.START_MONGODB}${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}${process.env.END_MONGODB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, () => {
  console.log("Connected to mongoose successfully")
});

// Middleware
app.use(express.json());
app.use(cors({ origin: "https://gallant-hodgkin-fb9c52.netlify.app", credentials: true }))

app.set("trust proxy", 1);

app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
    cookie: {
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 // One Week
    }
  }))


app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser((user: IMongoDBUser, done: any) => {
  return done(null, user._id);
});

passport.deserializeUser((id: string, done: any) => {

  User.findById(id, (err: Error, doc: IMongoDBUser) => {
    // Whatever we return goes to the client and binds to the req.user property
    return done(null, doc);
  })
})


passport.use(new GoogleStrategy({
  clientID: `${process.env.GOOGLE_CLIENT_ID}`,
  clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
  callbackURL: "/auth/google/callback"
},
  function (_: any, __: any, profile: any, cb: any) {

    User.findOne({ googleId: profile.id }, async (err: Error, doc: IMongoDBUser) => {

      if (err) {
        return cb(err, null);
      }

      if (!doc) {
        const newUser = new User({
          googleId: profile.id,
          username: profile.name.givenName
        });

        await newUser.save();
        cb(null, newUser);
      }
      cb(null, doc);
    })

  }));



passport.use(new TwitterStrategy({
  consumerKey: `${process.env.TWITTER_CLIENT_ID}`,
  consumerSecret: `${process.env.TWITTER_CLIENT_SECRET}`,
  callbackURL: "/auth/twitter/callback"
},
  function (_: any, __: any, profile: any, cb: any) {

    User.findOne({ twitterId: profile.id }, async (err: Error, doc: IMongoDBUser) => {

      if (err) {
        return cb(err, null);
      }

      if (!doc) {
        const newUser = new User({
          twitterId: profile.id,
          username: profile.username
        });

        await newUser.save();
        cb(null, newUser);
      }
      cb(null, doc);
    })

  }
));





passport.use(new GitHubStrategy({
  clientID: `${process.env.GITHUB_CLIENT_ID}`,
  clientSecret: `${process.env.GITHUB_CLIENT_SECRET}`,
  callbackURL: "/auth/github/callback"
},
  function (_: any, __: any, profile: any, cb: any) {

    User.findOne({ githubId: profile.id }, async (err: Error, doc: IMongoDBUser) => {

      if (err) {
        return cb(err, null);
      }

      if (!doc) {
        const newUser = new User({
          githubId: profile.id,
          username: profile.username
        });

        await newUser.save();
        cb(null, newUser);
      }
      cb(null, doc);
    })

  }
));




app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: 'https://gallant-hodgkin-fb9c52.netlify.app', session: true }),
  function (req, res) {
    res.redirect('https://gallant-hodgkin-fb9c52.netlify.app');
  });


app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: 'https://gallant-hodgkin-fb9c52.netlify.app', session: true }),
  function (req, res) {
    res.redirect('https://gallant-hodgkin-fb9c52.netlify.app');
  });


app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: 'https://gallant-hodgkin-fb9c52.netlify.app', session: true }),
  function (req, res) {
    res.redirect('https://gallant-hodgkin-fb9c52.netlify.app');
  });



app.get("/", (req, res) => {
  res.send("Helllo WOlrd");
})

app.get("/getuser", (req, res) => {
  res.send(req.user);
})

app.get("/auth/logout", (req, res) => {
  if (req.user) {
    req.logout();
    res.send("done");
  }
})

app.listen(process.env.PORT || 4000, () => {
  console.log("Server Starrted");
})