//If darkmode was on last time keep it on
function switchTheme() {
    if (localStorage.getItem('darkMode') == 'false') {
        localStorage.setItem('darkMode', true);
    } else {
        localStorage.setItem('darkMode', false);
    }
    checkTheme();
}
checkTheme();

function selectListFile() {
    var options = {
        title: 'Select File',
        properties: ['openFile'],
        filters: [{name: 'JSON', extensions: ['json']}],
    };

    dialog.showOpenDialog(null, options).then(async (file) => {
        localStorage.setItem('listFile', path.resolve(file.filePaths[0]));
        document.getElementById('gameFileDir').innerHTML = `Current file: ${localStorage.getItem('listFile')}`;
    });
}

function selectDownloadDir() {
    var options = {
        title: 'Select Folder',
        properties: ['openDirectory'],
    };
    dialog.showOpenDialog(null, options).then(async (folder) => {
        localStorage.setItem('downloadDir', path.resolve(folder.filePaths[0]));
        document.getElementById('gameDownloadDir').innerHTML = `Current folder: ${localStorage.getItem('downloadDir')}`;
    });
}

//Check for list file & set text
if (!localStorage.getItem('listFile')) {
    document.getElementById('gameFileDir').innerHTML = 'Please select a json file';
} else {
    document.getElementById('gameFileDir').innerHTML = `Current file: ${localStorage.getItem('listFile')}`;
}

document.getElementById('gameDownloadDir').innerHTML = `Current folder: ${localStorage.getItem('downloadDir')}`;

//Opt into beta versions
function betaOpt() {
    var toggle = document.getElementById('beta-switch').checked;
    if (toggle == true) {
        localStorage.setItem('beta', true);
    } else {
        localStorage.setItem('beta', false);
    }
}
//Set checked if checked is true
if (localStorage.getItem('beta') == 'true') {
    document.getElementById('beta-switch').checked = true;
    document.getElementById('beta-switch').setAttribute('aria-checked', true)
}
