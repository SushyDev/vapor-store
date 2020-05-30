process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function startDownload(file_url) {
	var filename = file_url.split('=');
	var file = filename.pop();
	var targetPath = localStorage.getItem('downloadDirectory') + file;
	var targetFolder = localStorage.getItem('downloadDirectory');
	var received_bytes = 0;
	var total_bytes = 0;
	var num = 0;

	if (!fs.existsSync(targetFolder)) {
		fs.mkdirSync(targetFolder);
	}

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
    document.getElementById('download-speed-counter').innerHTML = 'Extracting';


	extract(targetPath, targetFolder).then(
		() => {
            var folderName = file.replace('.zip', '');
			addGameToLibrary(folderName);
		},
		(err) => {
			console.log('extract failed');
		}
	);
}
