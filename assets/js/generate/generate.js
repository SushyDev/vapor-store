function makeList() {
	var url = document.getElementById('source-url').value;
	localStorage.setItem('gamesSite', url);

	alert('Dont close Vapor Store, Also do not open the store while generating. This could break the generated list!');

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

		if (document.getElementById('overwrite-current-list').checked == true) {
			console.log("overwriting")
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

				fs.readFile(app.getPath('userData') + '/Json/store.json', 'utf-8', function(err, data) {
					if (err) throw err;

					var games = JSON.parse(data);
					games.list.push({
						name: name,
						link: url
					});

					fs.writeFile(app.getPath('userData') + '/Json/store.json', JSON.stringify(games), 'utf-8', function(
						err
					) {
						if (err) throw err;
					});
				});

				done++;
			} catch (e) {}
		});
	};
	scrapeGames();
}
