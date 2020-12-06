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
devLog(localStorage.getItem('listFile'));
if (!localStorage.getItem('listFile')) {
    document.getElementById('gameFileDir').innerHTML = 'Please select a json file';
} else {
    document.getElementById('gameFileDir').innerHTML = `Current file: ${localStorage.getItem('listFile')}`;
}

document.getElementById('sgdb-key').value = localStorage.getItem('SGDB_Key');

document.getElementById('gameDownloadDir').innerHTML = `Current folder: ${localStorage.getItem('downloadDir')}`;

function saveSGDBKey() {
    key = document.getElementById('sgdb-key').value;
    localStorage.setItem('SGDB_Key', key);
    win.reload();
}