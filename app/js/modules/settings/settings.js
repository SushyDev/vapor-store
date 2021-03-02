// ! Select list file
exports.selectListFile = () => {
    const options = {
        title: 'Select File',
        properties: ['openFile'],
        filters: [{name: 'JSON', extensions: ['json']}],
    };

    dialog.showOpenDialog(null, options).then((file) => {
        vapor.config.setItem({listFile: path.resolve(file.filePaths[0])}).then((config) => {
            document.getElementById('gameFileDir').innerHTML = `Current file: ${config.listFile}`;
        });
    });
};

// ! Select download directory
exports.selectDownloadDir = () => {
    const options = {
        title: 'Select Folder',
        properties: ['openDirectory'],
    };
    dialog.showOpenDialog(null, options).then((folder) => {
        vapor.config.setItem({downloadDir: path.resolve(folder.filePaths[0])}).then((config) => {
            document.getElementById('gameDownloadDir').innerHTML = `Current folder: ${config.downloadDir}`;
        });
    });
};

// ! Toggle opt into beta versions
exports.toggleBetaOpt = () => {
    const toggle = document.getElementById('beta-switch').checked;
    toggle ? vapor.config.setItem({optBeta: true}) : vapor.config.setItem({optBeta: false});
};

// ! Toggle Auto extract
exports.toggleAutoExtract = () => {
    const toggle = document.getElementById('extract-switch').checked;
    toggle ? vapor.config.setItem({autoExtract: true}) : vapor.config.setItem({autoExtract: false});
};

// ! Update theme toggle on the settings page
exports.updateThemeToggle = (darkMode) => {
    console.log(darkMode);
    if (darkMode == undefined) darkMode = vapor.config.get().darkMode;
    console.log(darkMode);

    darkMode ? toggleLight() : toggleDark();

    function toggleLight() {
        document.getElementById('theme').childNodes[3].innerHTML = `brightness_high`;
        document.getElementById('theme').childNodes[5].innerHTML = `Light mode`;
    }

    function toggleDark() {
        document.getElementById('theme').childNodes[3].innerHTML = `nights_stay`;
        document.getElementById('theme').childNodes[5].innerHTML = `Dark mode`;
    }
};

exports.theme = require('./theme/theme');
