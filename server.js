'use strict';

/******************************************************
 * Edit ./app.js file instead of this one.
 ******************************************************/

const childProcess = require('child_process');

const process = childProcess.fork('./bin/www', {
    stdio: 'inherit'
});

