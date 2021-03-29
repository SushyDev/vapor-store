exports.Initialize = () => {
    fs.readFile(vapor.fn.installedGames(), 'utf-8', (err, data) => {
        if (err) return;
        if (data) document.querySelector('#installed-games h2').textContent = JSON.parse(data).list.length;
    });

    fs.readFile(vapor.config.get().listFile, 'utf-8', (err, data) => {
        if (err) return;
        if (data) document.querySelector('#loaded-games h2').textContent = JSON.parse(data).list.length;
    });

    document.getElementById('version').textContent = `Version: ${app.getVersion()}`;

    $(document).ready(() => ipcRenderer.send('loaded', true));
};

exports.showChangelog = () => {
    const dialogData = {
        'main': [
            {
                name: `Changelog`,
                id: 'changelog',
            },
        ],
        content: '<zero-md src="https://raw.githubusercontent.com/SushyDev/vapor-store/master/CHANGELOG.md"><template data-merge="append"><link rel="stylesheet" href="../css/overlays.css"></template></zero-md>',
        actions: [
            {
                name: 'close',
                action: `vapor.ui.dialog.close('changelog')`,
            },
        ],
    };

    vapor.ui.dialog.create(dialogData);
};
