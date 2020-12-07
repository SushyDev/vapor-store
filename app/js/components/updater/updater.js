

var name = 'newUpdate';
var version = '2.0.0'

var snackbarData = {
    ['main']: [
        {
            name: `${name}`,
        },
    ],
    ['progress']: [
        {
            enabled: true,
            id: `${name}-completed-progress`,
        },
    ],
    ['label']: [
        {
            id: `${name}-snackbar-title`,
            innerHTML: `Version ${version} is available`,
        },
    ],
    ['actions']: [
        {
            type: 'button',
            innerHTML: 'Download',
            labelid: `${name}-pause-button__label`,
            class: 'pause-button',
            id: 'pause-button',
            onclick: `pauseDownload('${name}')`,
        },
    ],
    ['close']: [
        {
            enabled: true,
            onclick: `closeSnackbar('${name}', 'Are you sure you want to cancel the download for ${name}?')`,
            confirm: true,
            title: 'Dismiss',
            icon: 'close',
            id: `${name}-close`,
        },
    ],
};

if ('1.3.4' > '1.3.3') {
    console.log('yes');
    $(document).ready(function () {
        newNotif(snackbarData);
    });
}
