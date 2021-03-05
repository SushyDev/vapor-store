//List of currently downloading games

exports.getFetching = () => fetchingDownload;

//Download game
exports.fetchDownload = async (gameID) => {
    //If already downloading
    if (fetchingDownload.includes(gameID) || currentDownloadData.find((game) => game.gameTitle == gameID)) {
        vapor.ui.dialog.MDCAlert('Already downloading this game');
        return;
    }

    const gameInfo = await vapor.cards.query.fetch(gameID);

    // ? Create snackbar data 
    const fetchingSnackbar = {
        ['main']: [
            {
                name: `${gameID}-started`,
            },
        ],
        ['label']: [
            {
                id: `started-snackbar-title`,
                innerHTML: `Starting download for ${gameInfo.name}`,
            },
        ],
    };

    // ? Create snackbar
    vapor.ui.snackbar.create(fetchingSnackbar);

    // ? Remove snackbar after 4 seconds
    setTimeout(() => vapor.ui.snackbar.close(fetchingSnackbar.main[0].name), 4000);

    //Add downloading game to array
    fetchingDownload.push(gameID);

    ipcRenderer.send('item-fetch-data', gameID);

    $.getJSON(vapor.config.get().listFile, (data) => {
        data['list'].forEach((game) => {
            const listItem = game.name.substring(1).slice(0, -1).replace(/ /g, '-');
            if (listItem == gameID) getDownloadURL(game.url, gameID).then((downloadURL) => downloader.startDownload(downloadURL, gameID));
        });
    });
};

//Get url
async function getDownloadURL(url, gameID) {
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: vapor.fn.getChromiumExecPath(),
        args: ['--no-sandbox'],
    });

    setFetchProgress(gameID, '.1');

    const page = await browser.newPage();

    //Go to steamunlocked page
    await page.goto(url);

    setFetchProgress(gameID, '.2');

    //Wait for download button visible
    await page.waitForSelector('.btn-download', {visible: true});

    setFetchProgress(gameID, '.3');

    //Change button to redirect, then click
    await page.evaluate(() => {
        document.querySelector('.btn-download').target = '_self';
        document.querySelector('.btn-download').click();
        return;
    });

    setFetchProgress(gameID, '.4');

    //Wait until upload heaven loaded
    await page.waitForNavigation({waitUntil: 'networkidle0'});

    setFetchProgress(gameID, '.5');

    //Wait for 5 second cooldown
    await page.waitForSelector('#downloadNowBtn', {visible: true});

    setFetchProgress(gameID, '.6');

    //Click download button
    await page.evaluate(() => document.querySelector('#downloadNowBtn').click());

    setFetchProgress(gameID, '.7');

    //Wait for redirect
    await page.waitForNavigation({waitUntil: 'networkidle0'});

    setFetchProgress(gameID, '.9');

    //Get href of 'Here' anchor
    const downloadURL = await page.evaluate(() => {
        try {
            return document.getElementsByClassName('alert-success')[0].getElementsByTagName('a')[0].href;
        } catch (e) {
            return;
        }
    });

    if (!downloadURL) {
        vapor.ui.dialog.MDCAlert('Download failed', `Please retry<br>Fetched url is ${downloadURL}`);
        // ? Remove item from currently fetching list
        fetchingDownload = fetchingDownload.filter((item) => item !== gameID);

        // ? Remove item in downloader page
        downloader.item.removeItem(gameID, 'fetch');
        return;
    }

    setFetchProgress(gameID, '1');

    await browser.close();

    // ? Remove item from currently fetching list
    fetchingDownload = fetchingDownload.filter((item) => item !== gameID);

    return downloadURL;
}

// ? Unless progress is full update it
const setFetchProgress = (gameTitle, progress) => (progress == '1' ? page.downloads.itemFetchingComplete(gameTitle) : page.downloads.itemFetchProgress(gameTitle, progress));
