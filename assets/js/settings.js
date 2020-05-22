//Set Background Feature

function setBackground() {
	var url = document.getElementById('background-url').value;
	localStorage.setItem('backgroundUrl', url);

	var url = localStorage.getItem('background-url');
	document.getElementById('background').style.backgroundImage = 'url(' + url + ')';
	document.getElementById('background-url').value = localStorage.getItem('backgroundUrl');
}

function getDirectory() {
	socket.emit('selectDir');
}

socket.on('getDirectory', (dir) => {
	var dir = dir.replace(/[\\]/g, '/');
	localStorage.setItem('downloadDirectory', dir);
	document.getElementById('current-download-directory').value = localStorage.getItem('downloadDirectory');
});

function downloaderLogin() {
	var email = document.getElementById('downloader-email');
	var pass = document.getElementById('downloader-pass');

	localStorage.setItem('JDMail', email.value);
	localStorage.setItem('JDPass', pass.value);
	var err = '0';

	jdownloaderAPI
		.connect(email.value, pass.value)
		.catch(function(reason) {
			document.getElementById('downloader-details').value = 'Invalid Login';
			err = '1';
		})
		.then(function() {
			if (err == '1') return;

			var downloader = jdownloaderAPI.listDevices();

			downloader.then((client) => {
				document.getElementById('downloader-details').value = 'Logged into: ' + client[0].name;
			});
		});
}

function igdbLogin() {
	var token = document.getElementById('igdb-token');
	localStorage.setItem('IGDBToken', token.value);
	document.getElementById('igdb-details').value = 'Using this token';
}

function makeList() {
	var url = document.getElementById('games-site').value;
	localStorage.setItem('gamesSite', url);

	alert(
		'Dont close Vapor Store until finished! You may continue using the app whilst generating, pressing  generate again will restart this process!'
	);

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

		const data = await page.evaluate(() => {
			var blog = (document.getElementsByClassName('blog-post').id = 'blog');

			const list = document.querySelectorAll('body > div > div > div > div > div > div > div > ul > li > a');

			const urls = Array.from(list).map((v) => v.href);
			return urls;
		});

		await browser.close();

		var total = 0;

		data.forEach(() => {
			total++;
		});

		var done = 0;

		var list = {
			list: []
		};

		fs.writeFile(app.getPath('userData') +'/Json/store.json', JSON.stringify(list), 'utf-8', function(err) {
			if (err) throw err;
		});

		async function asyncForEach(array, callback) {
			for (let index = 0; index < array.length; index++) {
				await callback(array[index], index, array);
			}
		}

		await asyncForEach(data, async (url) => {
			try {
				var name = url
					.replace('https://steamunlocked.net/', '')
					.replace('-free-download/', '')
					.replace(/[-]/g, ' ');

				const client = igdb(localStorage.getItem('IGDBToken'));

				const response = await client
					.fields('id,cover')
					.search(name) // Search game by name
					.limit(1)
					.request('/games');

				const cover = await client
					.fields('url') //
					.where(`id = ` + response.data[0].cover)
					.request('/covers');

				var gameCover = cover.data[0].url.replace('t_thumb', 't_1080p').replace('//', 'https://');
				var gameID = response.data[0].id;

				fs.readFile(app.getPath('userData') +'/Json/store.json', 'utf-8', function(err, data) {
					if (err) throw err;

					var games = JSON.parse(data)
					games.list.push({
						name: name,
						cover: gameCover,
						id: gameID,
						link: url
					});

					fs.writeFile(app.getPath('userData') +'/Json/store.json', JSON.stringify(games), 'utf-8', function(err) {
						if (err) throw err;
					});
				});

				done++;
				var percentage = done * 100 / total;
				var full = JSON.stringify(percentage);
				var progress = Number(Math.round(full + 'e0') + 'e-0');
				document.getElementById('generate-details').value = progress + '%';
			} catch (e) {}
		});
	};
	scrapeGames();
}
//Set settings

//Set current wallpaper url lable
document.getElementById('background-url').value = localStorage.getItem('backgroundUrl');

//Set download location lable
document.getElementById('current-download-directory').value = localStorage.getItem('downloadDirectory');

//Set JDownloader login lables
document.getElementById('downloader-email').value = localStorage.getItem('JDMail');
document.getElementById('downloader-pass').value = localStorage.getItem('JDPass');

//Set IGDB token lable
document.getElementById('igdb-token').value = localStorage.getItem('IGDBToken');

//Set games site lable
document.getElementById('games-site').value = localStorage.getItem('gamesSite');

//Set version lable
document.getElementById('current-version').value = app.getVersion();
