fetch('https://api.github.com/repos/CrypticShy/vapor-store/releases').then(function(response) {
	response.json().then(function(data) {
		console.log(data);

		var latest = data[0].tag_name.substring(1);

		var changes = data[0].body;

		var downloadurl = data[0].assets[0].browser_download_url;

		if (latest > app.getVersion()) {
			console.log('New version! ' + latest);
			console.log('Changes:' + changes);

			document.getElementById('update').style.display = 'block';

			document.getElementById('update-changes').innerHTML = changes;

			var download = document.getElementById('update-download');
			download.setAttribute('onclick', 'Update(' + "'" + downloadurl + "'" + ')');
			document.getElementById('update').appendChild(download);
		}
	});
});

console.log('hi');

function Update(url) {
	var targetPath = app.getPath('userData') + '/Updates/';

	if (!fs.existsSync(targetPath)) {
		fs.mkdirSync(targetPath);
    }
    
    downloadUpdate(url);
}

function downloadUpdate(file_url) {
    if (sessionStorage.getItem('Downloading') == 'true') {
		alert('Already Downloading ');
		return;
    }
    
    sessionStorage.setItem('Downloading', 'true');
    
	// Save variable to know progress
	var filename = file_url.split('/');
	var file = filename.pop();
	var targetPath = app.getPath('userData') + '/Updates/' + file;
	var received_bytes = 0;
	var total_bytes = 0;
	var num = 0;

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
		// Change the total bytes value to get progress later.
		total_bytes = parseInt(data.headers['content-length']);
	});

	req.on('data', function(chunk) {
		// Update the received bytes
		received_bytes += chunk.length;

		showProgress(received_bytes, total_bytes, num);
	});

	req.on('end', function() {
		var downloadPath = app.getPath('userData') + path.sep + "Updates" + path.sep
		console.log(downloadPath)
        openExplorer(downloadPath, err => {
            if(err) {
                console.log(err);
            }
            else {
                //Do Something
            }
        });

		sessionStorage.setItem('Downloading', 'false');
		document.getElementById('download-progress').style.width = '100%';
		document.getElementById('download-progress-counter').innerHTML = 'Done';
		document.getElementById('download-speed-counter').innerHTML = '';
	});
}

function showProgress(received, total, time) {
	var percentage = received * 100 / total;
	var full = JSON.stringify(percentage);

	var progress = Number(Math.round(full + 'e0') + 'e-0');

	var speed = received / 1000000 / time;
	var mbps = Number(Math.round(speed + 'e0') + 'e-0');

	console.log(mbps);

	document.getElementById('download-progress').style.width = progress + '%';
	document.getElementById('download-progress-counter').innerHTML = progress + '%';
	document.getElementById('download-speed-counter').innerHTML = mbps + 'MB/s';
}

function Donate() {
	opn('https://ko-fi.com/sushy');
}
