// # List of currently downloading games
exports.getFetching = () => fetchingDownload;

// #Download game
exports.fetchDownload = async (gameID) => {
    // ? If already downloading
    if (fetchingDownload.includes(gameID) || currentDownloadData.find((game) => game.gameTitle == gameID)) {
        vapor.ui.dialog.MDCAlert('Already downloading this game');
        return;
    }

    // ? Add to current fetching list
    fetchingDownload.push(gameID);

    $.getJSON(vapor.config.get().listFile, (data) => {
        data['list'].forEach((game) => {
            const listItem = game.name.substring(1).slice(0, -1).replace(/ /g, '-');
            if (listItem == gameID) getDownloadURL(game.url, gameID).then((downloadURL) => downloader.startDownload(downloadURL, gameID));
        });
    });
};

// # Get url
const getDownloadURL = async (url, gameID) => {
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: vapor.fn.getChromiumExecPath(),
        args: ['--no-sandbox'],
    });

    setFetchProgress(gameID, '.1');

    const page = await browser.newPage();

    // ? Go to page
    await page.goto(url);

    setFetchProgress(gameID, '.2');

    // ? Wait for download button visible
    await page.waitForSelector('.btn-download', {visible: true});

    setFetchProgress(gameID, '.3');

    // ? Change button to redirect, then click
    await page.evaluate(() => {
        document.querySelector('.btn-download').target = '_self';
        document.querySelector('.btn-download').click();
        return;
    });

    setFetchProgress(gameID, '.4');

    // ? Wait until upload heaven loaded
    await page.waitForNavigation({waitUntil: 'networkidle0'});

    setFetchProgress(gameID, '.5');

    // ? Wait for 5 second cooldown
    await page.waitForSelector('#downloadNowBtn', {visible: true});

    setFetchProgress(gameID, '.6');

    // ? Click download button
    await page.evaluate(() => document.querySelector('#downloadNowBtn').click());

    setFetchProgress(gameID, '.7');

    // ? Wait for redirect
    await page.waitForNavigation({waitUntil: 'networkidle0'});

    setFetchProgress(gameID, '.9');

    // ? Get download URL from 'here' button
    const downloadURL = await page.evaluate(() => {
        try {
            return document.getElementsByClassName('alert-success')[0].getElementsByTagName('a')[0].href;
        } catch (e) {
            return;
        }
    });

    // ? If no download url
    if (!downloadURL) {
        // ? Show popup
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
};

// ? Unless progress is full update it
const setFetchProgress = (gameTitle, progress) => (progress == '1' ? page.downloads.itemFetchingComplete(gameTitle) : page.downloads.itemFetchProgress(gameTitle, progress));
