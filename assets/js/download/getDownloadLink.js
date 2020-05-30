function getDownloadLink(data) {
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
    
    sessionStorage.setItem('downloadName', data.name);
	sessionStorage.setItem('downloadCover', data.cover);
	sessionStorage.setItem('downloadID', data.id);
	sessionStorage.setItem('downloadUrl', data.link);

	alert('Starting download of ' + data.name);

	const getDownload = async () => {
		function getChromiumExecPath() {
			return puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked');
		}

		const browser = await puppeteer.launch({
			headless: true,
			executablePath: getChromiumExecPath(),
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

		await page.evaluate(() => {
			return document.getElementById("downloadNowBtn").click();
		});

        document.getElementById('download-progress-counter').innerHTML = '7/10';
        
        await page.waitForNavigation( { timeout: 999999999, waitUntil: 'domcontentloaded' })

		document.getElementById('download-progress-counter').innerHTML = '8/10';

		const downloadUrl = await page.evaluate(() => {
			var href = document.getElementsByClassName('alert-success')[0].getElementsByTagName('a')[0].href;
			return href;
		});

		document.getElementById('download-progress-counter').innerHTML = '9/10';

		await browser.close();

		document.getElementById('download-progress-counter').innerHTML = '10/10';

		startDownload(downloadUrl);
	};
	getDownload();
}