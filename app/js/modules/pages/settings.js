// ! Initialize settings page
exports.Initialize = () => {
    //Set checked if checked is true
    if (vapor.config.get().autoExtract) {
        document.getElementById('extract-switch').checked = true;
        document.getElementById('extract-switch').setAttribute('aria-checked', true);
    }

    //Set checked if checked is true
    if (vapor.config.get().betaOpt) {
        document.getElementById('beta-switch').checked = true;
        document.getElementById('beta-switch').setAttribute('aria-checked', true);
    }

    //Check for list file & set text
    if (!vapor.config.get().listFile) {
        document.getElementById('gameFileDir').innerHTML = 'Please select a json file';
    } else {
        document.getElementById('gameFileDir').innerHTML = `Current file: ${localStorage.getItem('listFile')}`;
    }

    document.getElementById('gameDownloadDir').innerHTML = `Current folder: ${vapor.config.get().downloadDir}`;

    vapor.settings.updateThemeToggle();
};
