var name;
var cover;
var id;
var url;

function Download(data) {
	if (sessionStorage.getItem('Downloading') == 'true') {
		alert('Already Downloading ');
		return;
	}

	document.getElementById('download-progress').style.width = '100%';
	document.getElementById('download-progress-counter').innerHTML = '0/10';
	document.getElementById('download-speed-counter').innerHTML = '';

	var data = JSON.parse(data);

	name = data.name;
	cover = data.cover;
	id = data.id;
	url = data.link;

	alert('Starting download of ' + data.name);

	const getDownload = async () => {
		function getChromiumExecPath() {
			return puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked');
		}

		const browser = await puppeteer.launch({
			headless: true,
			executablePath: getChromiumExecPath(),
			args: [
				'--no-sandbox',
				'--disable-setuid-sandbox',
				'--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3803.0 Safari/537.36',
				'--lang=en-US,en;q=0.9'
			]
		});

		document.getElementById('download-progress-counter').innerHTML = '1/10';

		const page = await browser.newPage();

		document.getElementById('download-progress-counter').innerHTML = '2/10';

		await page.goto(url);

		document.getElementById('download-progress-counter').innerHTML = '3/10';

		const downloadPage = await page.evaluate(() => {
			return document.getElementsByClassName('btn-download')[0].getAttribute('href');
		});

		document.getElementById('download-progress-counter').innerHTML = '4/10';

		await page.goto(downloadPage);

		document.getElementById('download-progress-counter').innerHTML = '5/10';

		await page.waitForSelector('#downloadNowBtn', { visible: true });

		document.getElementById('download-progress-counter').innerHTML = '6/10';

		await page.click('#downloadNowBtn');

		document.getElementById('download-progress-counter').innerHTML = '7/10';

		await page.waitForNavigation();

		document.getElementById('download-progress-counter').innerHTML = '8/10';

		const downloadUrl = await page.evaluate(() => {
			var href = document.getElementsByClassName('alert-success')[0].getElementsByTagName('a')[0].href;
			return href;
		});

		document.getElementById('download-progress-counter').innerHTML = '9/10';

		await browser.close();

		document.getElementById('download-progress-counter').innerHTML = '10/10';

		var targetFolder = localStorage.getItem('downloadDirectory')

		if (!fs.existsSync(targetFolder)) {
			fs.mkdirSync(targetFolder);
		}

		startDownload(downloadUrl);
	};
	getDownload();
}

function startDownload(file_url) {
	var filename = file_url.split('=');
	var file = filename.pop();
	var targetPath = localStorage.getItem('downloadDirectory') + file;
	var targetFolder = localStorage.getItem('downloadDirectory')
	var received_bytes = 0;
	var total_bytes = 0;
	var num = 0;

	sessionStorage.setItem('Downloading', 'true');

	setInterval(function() {
		num++;
	}, 1000);

	var req = request({
		method: 'GET',
		uri: file_url
	});

	var out = fs.createWriteStream(targetPath);
	req.pipe(out);

	req.on('response', function(data) {
		total_bytes = parseInt(data.headers['content-length']);
	});

	req.on('data', function(chunk) {
		received_bytes += chunk.length;

		showProgress(received_bytes, total_bytes, num);
	});

	req.on('end', function() {
		extractDownload(targetPath, targetFolder, file);

		sessionStorage.setItem('Downloading', 'false');
	});
}

function extractDownload(targetPath, targetFolder, file) {
	document.getElementById('download-progress').style.width = '100%';
	document.getElementById('download-progress-counter').innerHTML = 'Ext';
	document.getElementById('download-speed-counter').innerHTML = '';

	async function start() {
		try {
			await extract(targetPath, { dir: targetFolder });

			fs.unlink(targetPath, (err) => {
				if (err) {
					console.error(err);
					return;
				}
			});

			var folderName = file.replace('.zip', '');
			addGameToLibrary(folderName);
		} catch (err) {
			console.log(err);
		}
	}
	start();
}

function addGameToLibrary(folderName) {
	var folder = folderName;

	document.getElementById('download-progress').style.width = '100%';
	document.getElementById('download-progress-counter').innerHTML = 'Done';
	document.getElementById('download-speed-counter').innerHTML = '';

	try {
		fs.readFile(app.getPath('userData') + '/Json/library.json', 'utf-8', function(err, data) {
			try {
				var arrayOfObjects = JSON.parse(data);
				arrayOfObjects.list.push({
					name: name,
					cover: cover,
					id: id,
					link: url,
					folder: folder
				});
				fs.writeFile(
					app.getPath('userData') + '/Json/library.json',
					JSON.stringify(arrayOfObjects),
					'utf-8',
					function(err) {
						if (err) makeLibrary();
					}
				);
			} catch (e) {
				makeLibrary();
			}
		});
	} catch (e) {
		makeLibrary();
	}

	function makeLibrary() {
		var list = {
			list: [
				{
					name: name,
					cover: cover,
					id: id,
					link: url,
					folder: folder
				}
			]
		};

		fs.writeFile(app.getPath('userData') + '/Json/library.json', JSON.stringify(list), 'utf-8', function(err) {
			if (err) console.log(err);
		});
	}
}
