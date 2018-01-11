'use strict';

const db = require('./db-setup');

const first = values => values[0];
const rest = values => values.slice(1);

function insertRecords(recordset, callback) {
    const record = first(recordset);
    const remaining = rest(recordset);

    db.Article.create(record, function (error) {
        if (error) {
            callback(error);
        } else if (remaining.length === 0) {
            callback(null);
        } else {
            insertRecords(remaining, callback);
        }
    });
}

module.exports = {
    insertRecords: insertRecords
}