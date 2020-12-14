$.get('https://api.github.com/repos/SushyDev/vapor-store/releases', function (data) {
    var release = data[0];

    var fileName;
    var downloadUrl;
    release.assets.forEach((asset) => {
        if (asset.name.endsWith('exe')) {
            downloadUrl = asset.browser_download_url;
            fileName = asset.name;
        }
    });

    var name = fileName.slice(0, -4);
    var latest = release.tag_name.slice(1);
    var current = app.getVersion();

    var snackbarData = {
        ['main']: [
            {
                name: `${name}`,
            },
        ],
        ['progress']: [
            {
                enabled: false,
                id: `${name}-completed-progress`,
            },
        ],
        ['label']: [
            {
                id: `${name}-snackbar-title`,
                innerHTML: `Version ${latest} is available`,
            },
        ],
        ['actions']: [
            {
                type: 'button',
                innerHTML: 'Download',
                labelid: `${name}-download-button__label`,
                class: 'download-button',
                id: 'download-button',
                onclick: `downloadUpdate('${name}', '${downloadUrl}')`,
            },
        ],
        ['close']: [
            {
                enabled: true,
                onclick: `closeSnackbar('${name}', false)`,
                title: 'Dismiss',
                icon: 'close',
                id: `${name}-close`,
            },
        ],
    };

    if (current.includes('beta')) {
        if (latest.includes('beta')) {
            var currentnb = current.replace('-beta-', '.'); // latest version will be 2.0.0.2 if its 2.0.0-beta-2
            var latestnb = latest.replace('-beta-', '.'); // current version will be 2.0.0.1 if its 2.0.0-beta-1

            //New beta over top of old beta
            if (latestnb > currentnb) updateAvailable(true);
        } else {
            currentnb = current.split('-beta-')[0]; // current version will be 2.0.0 if its 2.0.0-beta-x
            //New stable over top of beta
            if (latest > currentnb) updateAvailable();
        }
    } else {
        if (latest.includes('beta')) {
            latestnb = latest.split('-beta-')[0]; // latest version will be 2.0.1 if its 2.0.1-beta-x
            //new beta over top of latest
            if (latestnb > current) updateAvailable(true);
        } else {
            if (latest > current) updateAvailable();
        }
    }

    function updateAvailable(beta) {
        if (localStorage.getItem('beta') == 'false' && beta == true) return;

        //Create the snackbar
        newNotif(snackbarData);
    }

    //On download complete
    ipcRenderer.on(`${downloadUrl}-download-success`, (event, gameTitle) => {
        //Run exe
        exec(path.join(localStorage.getItem('downloadDir'), fileName), function (err, data) {
            console.log(err);
        });

        //Remove notification
        setTimeout(() => {
            closeSnackbar(`${name}-download`, false);
        }, 2500);
    });
});

function downloadUpdate(name, downloadUrl) {
    closeSnackbar(name, false);
    ipcRenderer.send('download-item', downloadUrl, localStorage.getItem('downloadDir'), 'vapor-store-update');
}
