var name;
var cover;
var id;
var url;

function Download(data) {
	if (sessionStorage.getItem('Downloading') == 'true') {
		alert('Already Downloading ');
		return;
	}
	sessionStorage.setItem('Downloading', 'true');

	document.getElementById('download-progress').style.width = '100%';
	document.getElementById('download-progress-counter').innerHTML = '...';
	document.getElementById('download-speed-counter').innerHTML = '';

	var data = JSON.parse(data);

	name = data.name;
	cover = data.cover;
	id = data.id;
	url = data.link;

	alert('Starting download of ' + data.name);

	const scrapeDownloads = async () => {
		function getChromiumExecPath() {
			return puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked');
		}

		const browser = await puppeteer.launch({
			headless: true,
			executablePath: getChromiumExecPath()
		});

		const page = await browser.newPage();

		await page.goto(url);

		const downloadUrl = await page.evaluate(() => {
			var blog = document.getElementsByClassName('btn-download')[0].getAttribute('href');

			return blog;
		});

		await browser.close();

		var name = url.replace('https://steamunlocked.net/', '').replace('-free-download/', '').replace(/[-]/g, ' ');

		startDownload(downloadUrl);
	};
	scrapeDownloads();
}

function startDownload(url) {

	jdownloaderAPI.listDevices().then((client) => {
		var name = client[0].name;
		var id = client[0].id;
		var status = client[0].status;

		var dir = localStorage.getItem('downloadDirectory');

		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}

		jdownloaderAPI.cleanUpFinishedLinks(id);

		jdownloaderAPI.addLinks(url, id, dir).then(function() {
			jdownloaderAPI.queryLinks(id).then((info) => {
				getData();

				function getData() {
					jdownloaderAPI.queryLinks(id).then((info) => {
						var data = info.data[0];

						if (typeof data !== 'undefined') {
							checkProgress(id);
						} else {
							setTimeout(getData, 250);
						}
					});
				}
			});
		});
	});
}

function checkProgress(id) {
	downloadProgress();

	function downloadProgress() {
		jdownloaderAPI.queryLinks(id).then((json) => {
			var data = json.data[0];
			var total = data.bytesTotal;
			var received = data.bytesLoaded;
			var speed = data.speed;
			var status = data.status;
			var folder = data.name.replace('.zip', '');

			var percentage = received * 100 / total;
			var full = JSON.stringify(percentage);
			var progress = Number(Math.round(full + 'e0') + 'e-0');
			var calc = speed / 1000000;
			var mbps = Number(Math.round(calc + 'e1') + 'e-1');

			if (isNaN(mbps)) {
				mbps = '< 1';
			}

			if (status == 'Finished') {
				downloadComplete(folder);
			} else if (status == 'Extraction OK') {
				extractionComplete(folder);
			} else if (status == 'Extracting') {
				downloadExtraction(status);
			} else {
				updateCounter(mbps, progress);
				setTimeout(downloadProgress, 500);
			}
		});
	}
}

function updateCounter(mbps, progress) {
	document.getElementById('download-progress').style.width = progress + '%';
	document.getElementById('download-progress-counter').innerHTML = progress + '%';
	document.getElementById('download-speed-counter').innerHTML = mbps + 'MB/s';
}

function downloadExtraction(status) {
	document.getElementById('download-progress').style.width = '100%';
	document.getElementById('download-progress-counter').innerHTML = 'Ext';
	document.getElementById('download-speed-counter').innerHTML = 'Zip';

	jdownloaderAPI.listDevices().then((client) => {
		var id = client[0].id;

		async function waitForOk() {
			const data = await jdownloaderAPI.queryLinks(id).then((info) => {
				var data = info.data[0];
				return data;
			});

			if (data.status == 'Extraction OK') {
				var folder = data.name.replace('.zip', '');
				extractionComplete(folder);
			} else {
				setTimeout(waitForOk(), 250);
			}
		}
		waitForOk();
	});
}

function extractionComplete(folderName) {
	downloadComplete(folderName);
}

function downloadComplete(folderName) {
	sessionStorage.setItem('Downloading', 'false');
	document.getElementById('download-progress').style.width = '100%';
	document.getElementById('download-progress-counter').innerHTML = 'Done';
	document.getElementById('download-speed-counter').innerHTML = '';

	addGameToLibrary(folderName);
}

function addGameToLibrary(folderName) {
	var folder = folderName;

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
