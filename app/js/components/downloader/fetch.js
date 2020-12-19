//List of currently downloading games
var downloading = [];

//Download game
function fetchDownload(gameTitle) {
    //If already downloading
    if (downloading.includes(gameTitle)) {
        MDCAlert('Already downloading this game');
        return;
    }

    var snackbarData = {
        ['main']: [
            {
                name: `${gameTitle}-download-starting`,
                role: 'downloadStarting',
            },
        ],
        ['progress']: [
            {
                enabled: true,
                id: `${gameTitle}-progress`,
            },
        ],
        ['label']: [
            {
                id: `download-starting-snackbar-title`,
                innerHTML: `Download is starting...`,
            },
        ],
        ['close']: [
            {
                enabled: false,
            },
        ],
    };

    //Create snackbar
    createSnack(snackbarData);

    //Add downloading game to array
    downloading.push(gameTitle);

    //Get file from local storage
    var file = localStorage.getItem('listFile');
    $.getJSON(file, (data) => {
        data['list'].forEach((game) => {
            var listItem = game.name.substring(1).slice(0, -1).replace(/ /g, '-');
            if (listItem != gameTitle) return;
            //Get url
            getDownloadURL(game.url, gameTitle).then((output) => {
                //Start download
                //ipcRenderer.send('download-item', output, localStorage.getItem('downloadDir'), downloadGame);

                //Downloading progress
                var url = output;
                var dir = localStorage.getItem('downloadDir');
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
        devLog(e);
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
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    
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

    return downloadUrl;
}

function setFetchProgress(gameTitle, progress) {
    //Progress
    document.getElementById(`${gameTitle}-progress`).style.transform = `scaleX(${progress})`;
}
