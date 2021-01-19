"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var dotenv_1 = __importDefault(require("dotenv"));
var cors_1 = __importDefault(require("cors"));
var express_session_1 = __importDefault(require("express-session"));
var passport_1 = __importDefault(require("passport"));
var User_1 = __importDefault(require("./User"));
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
dotenv_1.default.config();
var app = express_1.default();
mongoose_1.default.connect("" + process.env.START_MONGODB + process.env.MONGODB_USERNAME + ":" + process.env.MONGODB_PASSWORD + process.env.END_MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function () {
    console.log("Connected to mongoose successfully");
});
// Middleware
app.use(express_1.default.json());
app.use(cors_1.default({ origin: "https://gallant-hodgkin-fb9c52.netlify.app", credentials: true }));
app.set("trust proxy", 1);
app.use(express_session_1.default({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
    cookie: {
        sameSite: "none",
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // One Week
    }
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
passport_1.default.serializeUser(function (user, done) {
    return done(null, user._id);
});
passport_1.default.deserializeUser(function (id, done) {
    User_1.default.findById(id, function (err, doc) {
        // Whatever we return goes to the client and binds to the req.user property
        return done(null, doc);
    });
});
passport_1.default.use(new GoogleStrategy({
    clientID: "" + process.env.GOOGLE_CLIENT_ID,
    clientSecret: "" + process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, function (_, __, profile, cb) {
    var _this = this;
    User_1.default.findOne({ googleId: profile.id }, function (err, doc) { return __awaiter(_this, void 0, void 0, function () {
        var newUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (err) {
                        return [2 /*return*/, cb(err, null)];
                    }
                    if (!!doc) return [3 /*break*/, 2];
                    newUser = new User_1.default({
                        googleId: profile.id,
                        username: profile.name.givenName
                    });
                    return [4 /*yield*/, newUser.save()];
                case 1:
                    _a.sent();
                    cb(null, newUser);
                    _a.label = 2;
                case 2:
                    cb(null, doc);
                    return [2 /*return*/];
            }
        });
    }); });
}));
passport_1.default.use(new TwitterStrategy({
    consumerKey: "" + process.env.TWITTER_CLIENT_ID,
    consumerSecret: "" + process.env.TWITTER_CLIENT_SECRET,
    callbackURL: "/auth/twitter/callback"
}, function (_, __, profile, cb) {
    var _this = this;
    User_1.default.findOne({ twitterId: profile.id }, function (err, doc) { return __awaiter(_this, void 0, void 0, function () {
        var newUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (err) {
                        return [2 /*return*/, cb(err, null)];
                    }
                    if (!!doc) return [3 /*break*/, 2];
                    newUser = new User_1.default({
                        twitterId: profile.id,
                        username: profile.username
                    });
                    return [4 /*yield*/, newUser.save()];
                case 1:
                    _a.sent();
                    cb(null, newUser);
                    _a.label = 2;
                case 2:
                    cb(null, doc);
                    return [2 /*return*/];
            }
        });
    }); });
}));
passport_1.default.use(new GitHubStrategy({
    clientID: "" + process.env.GITHUB_CLIENT_ID,
    clientSecret: "" + process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
}, function (_, __, profile, cb) {
    var _this = this;
    User_1.default.findOne({ githubId: profile.id }, function (err, doc) { return __awaiter(_this, void 0, void 0, function () {
        var newUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (err) {
                        return [2 /*return*/, cb(err, null)];
                    }
                    if (!!doc) return [3 /*break*/, 2];
                    newUser = new User_1.default({
                        githubId: profile.id,
                        username: profile.username
                    });
                    return [4 /*yield*/, newUser.save()];
                case 1:
                    _a.sent();
                    cb(null, newUser);
                    _a.label = 2;
                case 2:
                    cb(null, doc);
                    return [2 /*return*/];
            }
        });
    }); });
}));
app.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile'] }));
app.get('/auth/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/login', session: true }), function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('https://gallant-hodgkin-fb9c52.netlify.app');
});
app.get('/auth/twitter', passport_1.default.authenticate('twitter'));
app.get('/auth/twitter/callback', passport_1.default.authenticate('twitter', { failureRedirect: '/login', session: true }), function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('https://gallant-hodgkin-fb9c52.netlify.app');
});
app.get('/auth/github', passport_1.default.authenticate('github'));
app.get('/auth/github/callback', passport_1.default.authenticate('github', { failureRedirect: '/login', session: true }), function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('https://gallant-hodgkin-fb9c52.netlify.app');
});
app.get("/", function (req, res) {
    res.send("Helllo WOlrd");
});
app.get("/getuser", function (req, res) {
    res.send(req.user);
});
app.get("/auth/logout", function (req, res) {
    if (req.user) {
        req.logout();
        res.send("done");
    }
});
app.listen(process.env.PORT || 4000, function () {
    console.log("Server Starrted");
});
//# sourceMappingURL=index.js.map