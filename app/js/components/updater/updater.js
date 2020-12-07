
$.get('https://api.github.com/repos/SushyDev/vapor-store/releases/latest', function (data) {
    var downloadUrl = data.assets[0].browser_download_url;
    var latest = data.tag_name.slice(1);
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

    if (latest < app.getVersion()) {
        newNotif(snackbarData);
    }

    console.log(data.assets[0].browser_download_url);
});


function downloadUpdate(name, downloadUrl) {
    closeSnackbar(name, false);
    ipcRenderer.send('download-item', downloadUrl, localStorage.getItem('downloadDir'), 'Update');
}
