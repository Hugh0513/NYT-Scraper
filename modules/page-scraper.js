'use strict';

const cheerio = require('cheerio');
const request = require('request');

const urlToScrape = 'https://news.ycombinator.com/';

function getArticleData(htmlToScrape) {
    const $ = cheerio.load(htmlToScrape);
    let articles = [];

    $('tr.athing').each(function (index, element) {
        const articleElt = $(element).children()[2];

        const title = $(articleElt).text();
        const link = $(articleElt).children().first().attr('href');

        articles.push({
            title: title,
            link: link
        });
    });

    return articles;
}

function scrapeData(callback) {
    request(urlToScrape, function (error, request, body) {
        if (error) {
            callback(error);
        } else {
            const articles = getArticleData(body);
            callback(null, articles);
        }
    });
}

module.exports = {
    scrapeData: scrapeData
}

