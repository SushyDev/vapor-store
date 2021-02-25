// ! Select list file
exports.selectListFile = () => {
    const options = {
        title: 'Select File',
        properties: ['openFile'],
        filters: [{name: 'JSON', extensions: ['json']}],
    };

    dialog.showOpenDialog(null, options).then(async (file) => {
        localStorage.setItem('listFile', path.resolve(file.filePaths[0]));
        document.getElementById('gameFileDir').innerHTML = `Current file: ${localStorage.getItem('listFile')}`;
    });
};

// ! Select download directory
exports.selectDownloadDir = () => {
    const options = {
        title: 'Select Folder',
        properties: ['openDirectory'],
    };
    dialog.showOpenDialog(null, options).then(async (folder) => {
        localStorage.setItem('downloadDir', path.resolve(folder.filePaths[0]));
        document.getElementById('gameDownloadDir').innerHTML = `Current folder: ${localStorage.getItem('downloadDir')}`;
    });
};

// ! Toggle opt into beta versions
exports.toggleBetaOpt = () => {
    const toggle = document.getElementById('beta-switch').checked;
    toggle ? localStorage.setItem('beta', true) : localStorage.setItem('beta', false);
};

// ! Toggle Auto extract
exports.toggleAutoExtract = () => {
    const toggle = document.getElementById('extract-switch').checked;
    toggle ? localStorage.setItem('autoExtract', true) : localStorage.setItem('autoExtract', false);
};

// ! Update theme toggle on the settings page
exports.updateThemeToggle = () => {
    const darkMode = localStorage.getItem('darkMode');

    darkMode == 'true' ? toggleLight() : toggleDark();

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
