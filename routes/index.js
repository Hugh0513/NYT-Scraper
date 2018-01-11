'use strict';

var express = require('express');
var router = express.Router();

const scrapedDataBuilder = require('../modules/scraped-data-builder');
const db = require('../modules/db-setup');

router.get('/', function (request, response) {
    db.Article.find(function (error, articles) {
        if (error) {
            response.status(500).end();
        } else {
            response.render('allarticles', {
                articles: articles
            });
        }
    });
});

router.get('/article/:id', function (request, response) {
    const articleId = request.params.id;

    db.Article.findById(articleId)
    .populate('comments')
    .exec(function (error, articleData) {
        if (error) {
            response.status(500).end();
        } else {
            response.render('article', {
                article: articleData
            });
        }
    });

});

router.post('/addComment/:id', function (request, response) {
    const articleId = request.params.id;

    db.Article.findById(articleId,
        function (error, document) {
            const comment = new db.Comment({
                name: request.body.name,
                email: request.body.email,
                comment: request.body.comment
            });

            document.comments.push(comment);
            document.save(function () {
                response.redirect(`/article/${articleId}`);
            });
        });
});

router.get('/scrape', function (request, response) {
    scrapedDataBuilder.scrapeAndSaveArticleData(function (error) {
        if (error) {
            response.status(500).end();
        } else {
            //response.status(201).send('Record(s) created').end();
            response.status(201).send('Added 20 new articles!').end();
            //response.redirect("/"); //doesn't work.
        }
    });
    console.log('Record(s) created console'); // terminal

});

router.get('/saved', function (request, response) {
    db.savedArticle.find(function (error, articles) {
        if (error) {
            response.status(500).end();
        } else {
            response.render('allarticles', {
                articles: articles
            });
        }
    });
});

module.exports = router;
