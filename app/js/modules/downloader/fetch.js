//List of currently downloading games

exports.getFetching = () => fetchingDownload;

//Download game
exports.fetchDownload = (gameTitle) => {
    //If already downloading
    if (fetchingDownload.includes(gameTitle)) {
        vapor.ui.dialog.MDCAlert('Already downloading this game');
        return;
    }

    const snackbarData = {
        ['main']: [
            {
                name: `${gameTitle}-fetching`,
            },
        ],
        ['progress']: [
            {
                id: `${gameTitle}-fetching-progress`,
            },
        ],
        ['label']: [
            {
                id: `fetching-snackbar-title`,
                innerHTML: `Fetching download`,
            },
        ],
        ['close']: [
            {
                onclick: `vapor.ui.snackbar.hide('${gameTitle}-fetching')`,
                title: 'Hide',
                icon: 'keyboard_arrow_down',
                id: `${gameTitle}-fetching-hide`,
            },
        ],
    };

    //Create snackbar
    vapor.ui.snackbar.create(snackbarData);

    //Add downloading game to array
    fetchingDownload.push(gameTitle);

    ipcRenderer.send('item-fetch-data', gameTitle);

    //Get file from local storage
    const file = localStorage.getItem('listFile');
    $.getJSON(file, (data) => {
        data['list'].forEach((game) => {
            const listItem = game.name.substring(1).slice(0, -1).replace(/ /g, '-');
            if (listItem == gameTitle) getDownloadURL(game.url, gameTitle).then((output) => downloader.startDownload(output, vapor.config.get().downloadDir, gameTitle));
        });
    });
};

//Get url
async function getDownloadURL(url, gameTitle) {
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: vapor.fn.getChromiumExecPath(),
        args: ['--no-sandbox'],
    });

    setFetchProgress(gameTitle, '.1');

    const page = await browser.newPage();

    //Go to steamunlocked page
    await page.goto(url);

    setFetchProgress(gameTitle, '.2');

    //Wait for download button visible
    try {
        await page.waitForSelector('.btn-download', {visible: true});
    } catch (e) {
        if (isDev) console.log(e);
    }

    setFetchProgress(gameTitle, '.3');

    //Change button to redirect, then click
    await page.evaluate(() => {
        document.querySelector('.btn-download').target = '_self';
        document.querySelector('.btn-download').click();
        return;
    });

    setFetchProgress(gameTitle, '.4');

    //Wait until upload heaven loaded
    await page.waitForNavigation({waitUntil: 'networkidle0'});

    setFetchProgress(gameTitle, '.5');

    //Wait for 5 second cooldown
    await page.waitForSelector('#downloadNowBtn', {visible: true});

    setFetchProgress(gameTitle, '.6');

    //Click download button
    await page.evaluate(() => document.querySelector('#downloadNowBtn').click());

    setFetchProgress(gameTitle, '.7');

    //Wait for redirect
    await page.waitForNavigation({waitUntil: 'networkidle0'});

    setFetchProgress(gameTitle, '.9');

    //Get href of 'Here' anchor
    const downloadUrl = await page.evaluate(() => {
        try {
            return document.getElementsByClassName('alert-success')[0].getElementsByTagName('a')[0].href;
        } catch (e) {
            return;
        }
    });

    if (!downloadUrl) {
        console.log(downloadUrl);
        vapor.ui.dialog.MDCAlert('Download failed', 'please retry');
        fetchingDownload.shift();
        return;
    }

    setFetchProgress(gameTitle, '1');

    await browser.close();

    //Make folder if doesn't exist
    const targetFolder = vapor.fn.vaporGames();

    // ? If target folder doesn't exist then create it
    fs.existsSync(targetFolder) || fs.mkdirSync(targetFolder);

    // ? Remove item from currently fetching list
    fetchingDownload.shift();

    //Remove starting snackbar
    if (!gameTitle.includes('vapor-store-update')) vapor.ui.snackbar.close(`${gameTitle}-fetching`, false);
    return downloadUrl;
}

function setFetchProgress(gameTitle, progress) {
    // ? Update fetching progress snackbar
    document.getElementById(`${gameTitle}-fetching-progress`).style.transform = `scaleX(${progress})`;

    // ? Unless progress is full update it
    progress == '1' ? ipcRenderer.send('item-fetching-complete', gameTitle) : ipcRenderer.send('item-fetching-progress', gameTitle, progress);
}
