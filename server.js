// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bluebird = require('bluebird');
var mongoose = require('mongoose');
mongoose.Promise = bluebird;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cors = require('cors');
var socketIO = require('socket.io');

// Get our API routes
const api = require('./server/routes/api');
const dockerApi = require('./server/routes/dockerApi');
const app = express();
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
// Get Models references
var Account = require('./server/models/account');

// Parsers for POST data
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
app.use('/api', api);
app.use('/api/docker', dockerApi);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// passport config
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

// mongoose
// mongoose.connect('mongodb://localhost/PersianDevsDb');
var mongoConnectPromise = mongoose.connect('mongodb://localhost/PersianDevsDb', {
    useMongoClient: true,
});



mongoConnectPromise.then(function (db) {
    const server = http.createServer(app);
    const io = socketIO(server);
    io.on('connection', (socket) => {
        console.log('New User connected!');
        socket.on('disconnect', () => {
            console.log('User disconnected!');
        });
    });
    server.listen(port, () => console.log(`API running on localhost:${port}`));
});



