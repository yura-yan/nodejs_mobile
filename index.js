const express = require('express')
const articlesRoute = require('./routes/articles')
const usersRoute = require('./routes/users')
const apisRoute = require('./routes/api')
const path = require('path') 
const logger = require('./libs/log');
const config = require('./libs/config');
const passport = require('passport');
const oauth2 = require('./libs/oauth2');
require('./libs/auth');
require('./libs/db');

const app = express()

app.use(passport.initialize());
app.use(express.static(path.join(__dirname, "public"))); 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', apisRoute);
app.use('/api', apisRoute);
app.use('/api/users', usersRoute); 
app.use('/api/articles', articlesRoute);
app.use('/api/oauth/token', oauth2.token);
 
// Introduce error by using undefined variable 'y'
app.get('/calc',(req,res) => {
    const x = y + 10;
    res.send(x.toString());
})

// Capture 500 errors
app.use((err,req,res,next) => {
    res.status(err.status || 500)
    logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`)
    res.json({
        error: err.message
    })
    return
    })

// Capture 404 erors
app.use((req,res,next) => {
    res.status(404)
    logger.error(`400 || ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`)
    res.json({
        error: 'Not found'
    })
    return
})

app.listen(config.get('port'), function() {
    logger.info('Express server listening on port ' + config.get('port'))
})
