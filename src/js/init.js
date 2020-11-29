//Initialize script
//Sets some constants and clears the session storage when the app first starts

const childProcess = require('child_process');
const fs = require('fs');
const SGDB = require('steamgriddb');
const client = new SGDB('c78041c68de4f4beb2d98fff5e02f173');
const $ = require('jquery');
sessionStorage.clear();
