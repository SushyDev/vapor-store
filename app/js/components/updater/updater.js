$.get('https://api.github.com/repos/SushyDev/vapor-store/releases/latest', function (data) {
    var downloadUrl = data.assets[0].browser_download_url;
    var fileName = data.assets[0].name;
    var name = fileName.slice(0, -4);
    var latest = data.tag_name.slice(1);
    console.log(fileName);
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

    if (latest > app.getVersion()) {
        newNotif(snackbarData);

        ipcRenderer.on(`${data.assets[0].browser_download_url}-download-success`, (event, gameTitle) => {
            var exec = require('child_process').exec;
            //Run exe
            exec(path.join(localStorage.getItem('downloadDir'), fileName), function (err, data) {
                console.log(err);
            });

            //Remove notification
            setTimeout(() => {
                document.getElementById(`${name}-snackbar`).remove();
            }, 2500);
        });
    }
});

function downloadUpdate(name, downloadUrl) {
    closeSnackbar(name, false);
    ipcRenderer.send('download-item', downloadUrl, localStorage.getItem('downloadDir'), 'vapor-store-update');
}
