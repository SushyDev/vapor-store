const waitFor = (ms) => new Promise((r) => setTimeout(r, ms));
const fs = require('fs');
const path = require('path');
const request = require('request');
const rp = require('request-promise');
const $ = require('cheerio');
const remote = require('electron').remote;
const { dialog } = require('electron').remote;
const app = remote.app;
const igdb = require('igdb-api-node').default;
const puppeteer = require('puppeteer');
const rimraf = require('rimraf');
const { Octokit } = require('@octokit/rest');
const octokit = new Octokit();
const opn = require('opn');
const openExplorer = require('open-file-explorer');
const extract = require('progress-extract');

function getChromiumExecPath() {
	return path.join(puppeteer.executablePath(), '../../../').replace('app.asar', 'app.asar.unpacked');
}

const browserFetcher = puppeteer.createBrowserFetcher({ platform: 'win64', path: getChromiumExecPath() });
const revision = require('puppeteer/package').puppeteer.chromium_revision;

browserFetcher.download(revision).then(() => {}).catch((error) => console.log('Error', error));

//If no background url is set then set default one
if (localStorage.getItem('backgroundUrl') == undefined) {
	localStorage.setItem(
		'backgroundUrl',
		'https://cdn.glitch.com/fb5beaf3-f18e-457d-9358-b09e28bf5522%2FVapor%20Store%20Wallpaper.png?v=1590248243315'
	);
}

//If no download dir is set then set default one
if (localStorage.getItem('downloadDirectory') == undefined) {
	var dir = app.getPath('userData') + path.sep + 'Games' + path.sep;
	var dir = dir.replace(/[\\]/g, '/');
	localStorage.setItem('downloadDirectory', dir);
}

var dir = app.getPath('userData') + '/Json';

if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir);
}

//Load background image
var url = localStorage.getItem('backgroundUrl');
document.getElementById('background').style.backgroundImage = 'url(' + url + ')';

sessionStorage.setItem('Downloading', 'false');
