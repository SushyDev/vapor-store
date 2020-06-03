function makeList() {
	var url = document.getElementById('source-url').value;
	localStorage.setItem('gamesSite', url);

	alert('Dont close Vapor Store, Also do not open the store while generating. This could break the generated list!');

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

		var query = document.getElementById('game-list-query').value;

		console.log(query);

		const data = await page.evaluate((query) => {
			const list = document.querySelectorAll(query);

			const urls = Array.from(list).map((v) => v.href);
			return urls;
		}, query);

		var total = 0;
		var done = 0;

		data.forEach(() => {
			total++;
		});

		if (document.getElementById('overwrite-current-list').checked == false) {
			var list = {
				list: []
			};

			fs.writeFile(app.getPath('userData') + '/Json/store.json', JSON.stringify(list), 'utf-8', function(err) {
				if (err) throw err;
			});
		}

		await asyncForEach(data, async (url) => {
			try {
				var inputRegex = document.getElementById('name-regex-replace').value;
				var replaceTo = document.getElementById('name-regex-replace-to').value;

				var name;

				var replace = new RegExp(inputRegex, 'g');

				if (document.getElementById('game-name-by-class').checked == true) {
					var classname = document.getElementById('name-class').value;

					await page.goto(url);

					name = await page.evaluate(
						(classname, replace, replaceTo) => {
							var title = document.getElementById(classname).innerHTML;

							return title.replace(replace, replaceTo);
						},
						classname,
						replace,
						replaceTo
					);
				} else if (document.getElementById('game-name-by-id').checked == true) {
					var id = document.getElementById('name-id').value;

					await page.goto(url);

					name = await page.evaluate(
						(id, replace, replaceTo) => {
							var title = document.getElementById(id).innerHTML;

							return title.replace(replace, replaceTo);
						},
						id,
						replace,
						replaceTo
					);
				} else {
					name = url.replace(replace, replaceTo);
				}

				const client = igdb(localStorage.getItem('IGDBToken'));

				try {
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
				} catch (e) {
					var coverUrl;

					if (document.getElementById('custom-cover').checked == true) {
						coverUrl = document.getElementById('cover-url').value;
					} else {
						coverUrl =
							'https://cdn.glitch.com/fb5beaf3-f18e-457d-9358-b09e28bf5522%2FGameNotFound.png?v=1590514540794';
					}

					gameCover = coverUrl;
					gameID = '1';
				}

				if (typeof gameCover === 'undefined') {
				}

				if (typeof gameID === 'undefined') {
				}

				fs.readFile(app.getPath('userData') + '/Json/store.json', 'utf-8', function(err, data) {
					if (err) throw err;

					var games = JSON.parse(data);
					games.list.push({
						name: name,
						cover: gameCover,
						id: gameID,
						link: url
					});

					fs.writeFile(app.getPath('userData') + '/Json/store.json', JSON.stringify(games), 'utf-8', function(
						err
					) {
						if (err) throw err;
					});
				});

				done++;
				document.getElementById('generate-details').value = done + '/' + total;
			} catch (e) {}
		});
	};
	scrapeGames();
}
