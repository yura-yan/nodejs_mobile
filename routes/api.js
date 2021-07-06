const { Router } = require('express')
const passport = require('passport')
require('../libs/db');

const router = Router()

router.get('/', passport.authenticate('bearer', { session: false }), function (req, res) {
    res.json({
        msg: 'API is running'
    });
});
 
module.exports = router