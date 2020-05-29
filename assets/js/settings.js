const {
	steamunlockedList
} = require('../js/sites')

//Set Background Feature

function setBackground() {
	var url = document.getElementById('background-url').value;
	localStorage.setItem('backgroundUrl', url);

	var url = localStorage.getItem('background-url');
	document.getElementById('background').style.backgroundImage = 'url(' + url + ')';
	document.getElementById('background-url').value = localStorage.getItem('backgroundUrl');
}

function clearBackground() {
	localStorage.setItem(
		'backgroundUrl',
		'https://cdn.glitch.com/fb5beaf3-f18e-457d-9358-b09e28bf5522%2FVapor%20Store%20Wallpaper.png?v=1590248243315'
	);
	document.getElementById('background').style.backgroundImage = 'url(' + url + ')';
}

function getDirectory() {
	socket.emit('selectDir');
}

socket.on('getDirectory', (dir) => {
	var dir = dir.replace(/[\\]/g, '/');
	localStorage.setItem('downloadDirectory', dir);
	document.getElementById('current-download-directory').value = localStorage.getItem('downloadDirectory');
});

function igdbLogin() {
	var token = document.getElementById('igdb-token');
	localStorage.setItem('IGDBToken', token.value);
	document.getElementById('igdb-details').style.display = 'block';
	document.getElementById('igdb-details').value = 'Using this token';
}

function makeList() {
	var url = document.getElementById('games-site').value;
	localStorage.setItem('gamesSite', url);

	alert(
		'Dont close Vapor Store until finished! You may continue using the app whilst generating, pressing  generate again will restart this process!'
	);

	document.getElementById('generate-details').value = '0/0';

	const scrapeGames = async () => {
		function getChromiumExecPath() {
			return puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked');
		}

		const browser = await puppeteer.launch({
			headless: true,
			executablePath: getChromiumExecPath()
		});

		const page = await browser.newPage();

		await page.goto(url);

		if(url.includes('steamunlocked')) await steamunlockedList(document, page)
		else if (url.includes('fitgirl')) console.log('fitgirl!')

		await browser.close();

		var list = {
			list: []
		};

		fs.writeFile(app.getPath('userData') + '/Json/store.json', JSON.stringify(list), 'utf-8', function(err) {
			if (err) throw err;
		});
	};
	scrapeGames();
}
//Set settings

//Set current wallpaper url lable
document.getElementById('background-url').value = localStorage.getItem('backgroundUrl');

//Set download location lable
document.getElementById('current-download-directory').value = localStorage.getItem('downloadDirectory');

//Set IGDB token lable
document.getElementById('igdb-token').value = localStorage.getItem('IGDBToken');

//Set games site lable
document.getElementById('games-site').value = localStorage.getItem('gamesSite');

//Set version lable
document.getElementById('current-version').value = app.getVersion();
