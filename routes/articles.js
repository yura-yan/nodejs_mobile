const { Router } = require('express')
const ArticleModel = require('../models/Article')
const log = require('../libs/log');
const passport = require('passport');
require('../libs/db');

const router = Router()

//method get
router.get('/', passport.authenticate('bearer', { session: false }), (req, res) => {
     ArticleModel.find(function (err, articles) {
        if (!err) {
            return res.json(articles);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.json({
                error: 'Server error'
            });
        }
    });
})

router.get('/:id', passport.authenticate('bearer', { session: false }), (req, res) => {
     ArticleModel.findById(req.params.id, function (err, article) {
        if(!article) {
            res.statusCode = 404;
            return res.json({ 
                error: 'Not found' 
            });
        }
        if (!err) {
            return res.json({ 
                status: 'OK', 
                article:article 
            });
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.json({ 
                error: 'Server error' 
            });
        }
    });
})

//method post
router.post('/', passport.authenticate('bearer', { session: false }), (req, res) => {
    const article = new ArticleModel({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        images: req.body.images
    });

    article.save(function (err) {
        if (!err) {
            log.info("article created");
            return res.json({ 
                status: 'OK', 
                article:article 
            });
        } else {
            if(err.name == 'ValidationError') {
                res.statusCode = 400;
                res.json({ 
                    error: 'Validation error' 
                });
            } else {
                res.statusCode = 500;
                res.json({ 
                    error: 'Server error' 
                });
            }
            log.error('Internal error(%d): %s',res.statusCode,err.message);
        }
    });
})

//method put
router.put('/:id', passport.authenticate('bearer', { session: false }), (req, res) => {
     ArticleModel.findById(req.params.id, function (err, article) {
        if(!article) {
            res.statusCode = 404;
            return res.json({ 
                error: 'Not found' 
            });
        }

        article.title = req.body.title;
        article.description = req.body.description;
        article.author = req.body.author;
        article.images = req.body.images;

        article.save(function (err) {
            if (!err) {
                log.info("article updated");
                return res.json({ 
                    status: 'OK', 
                    article:article 
                });
            } else {
                if(err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.json({ 
                        error: 'Validation error' 
                    });
                } else {
                    res.statusCode = 500;
                    res.json({ 
                        error: 'Server error' 
                    });
                }
                log.error('Internal error(%d): %s',res.statusCode,err.message);
            }
        });
    });
})

//method delete
router.delete('/:id', passport.authenticate('bearer', { session: false }), (req, res) => {
     ArticleModel.findById(req.params.id, function (err, article) {
        if(!article) {
            res.statusCode = 404;
            return res.json({ 
                error: 'Not found' 
            });
        }
        article.remove(function (err) {
            if (!err) {
                log.info("article removed");
                return res.json({ 
                    status: 'OK' 
                });
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s',res.statusCode,err.message);
                return res.json({ 
                    error: 'Server error' 
                });
            }
        });
    });
})

module.exports = router