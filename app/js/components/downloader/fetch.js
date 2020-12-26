//List of currently downloading games
var fetchingDownload = [];

//Download game
function fetchDownload(gameTitle) {
    //If already downloading
    if (fetchingDownload.includes(gameTitle)) {
        MDCAlert('Already downloading this game');
        return;
    }

    var snackbarData = {
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
                onclick: `hideSnackbar('${gameTitle}-fetching')`,
                title: 'Hide',
                icon: 'keyboard_arrow_down',
                id: `${gameTitle}-fetching-hide`,
            },
        ],
    };

    //Create snackbar
    createSnack(snackbarData);

    //Add downloading game to array
    fetchingDownload.push(gameTitle);

    ipcRenderer.send('item-fetch-data', gameTitle);

    //Get file from local storage
    var file = localStorage.getItem('listFile');
    $.getJSON(file, (data) => {
        data['list'].forEach((game) => {
            var listItem = game.name.substring(1).slice(0, -1).replace(/ /g, '-');
            if (listItem != gameTitle) return;
            //Get url
            getDownloadURL(game.url, gameTitle).then((output) => {
                //Start download
                var dir = localStorage.getItem('downloadDir');
                var url = output;
                startDownload(url, dir, gameTitle);
            });
        });
    });
}

//Get url
async function getDownloadURL(url, gameTitle) {
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: getChromiumExecPath(),
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
    await page.evaluate(() => {
        document.querySelector('#downloadNowBtn').click();
    });

    setFetchProgress(gameTitle, '.7');

    //Wait for redirect
    await page.waitForNavigation({waitUntil: 'networkidle0'});

    await page.waitForSelector('.alert-success', {visible: true});

    setFetchProgress(gameTitle, '.9');

    //Get href of 'Here' anchor
    const downloadUrl = await page.evaluate(() => {
        return document.getElementsByClassName('alert-success')[0].getElementsByTagName('a')[0].href;
    });

    setFetchProgress(gameTitle, '1');

    await browser.close();

    //Make folder if doesn't exist
    var targetFolder = localStorage.getItem('downloadDir');
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder);
    }

    fetchingDownload.shift();
    return downloadUrl;
}

function setFetchProgress(gameTitle, progress) {
    //Progress
    document.getElementById(`${gameTitle}-fetching-progress`).style.transform = `scaleX(${progress})`;

    if (progress == '1') {
        ipcRenderer.send('item-fetching-complete', gameTitle);
    } else {
        ipcRenderer.send('item-fetching-progress', gameTitle, progress);
    }
}
