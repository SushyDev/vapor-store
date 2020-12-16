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
                enabled: false,
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
            getDownloadURL(game.url).then((output) => {
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
async function getDownloadURL(url) {

    const browser = await puppeteer.launch({
        headless: true,
        executablePath: getChromiumExecPath(),
        args: ['--no-sandbox'],
    });

    const page = await browser.newPage();

    //Go to steamunlocked page
    await page.goto(url);

    //Wait for download button visible
    try {
        await page.waitForSelector('.btn-download', {visible: true});
    } catch (e) {
        devLog(e);
    }

    //Change button to redirect, then click
    await page.evaluate(() => {
        document.querySelector('.btn-download').target = '_self';
        document.querySelector('.btn-download').click();
        return;
    });

    //Wait until upload heaven loaded
    await page.waitForNavigation({waitUntil: 'networkidle0'});

    //Wait for 5 second cooldown
    await page.waitForSelector('#downloadNowBtn', {visible: true});

    //Click download button
    await page.evaluate(() => {
        document.querySelector('#downloadNowBtn').click();
    });

    //Wait for redirect
    await page.waitForNavigation({waitUntil: 'networkidle0'});

    await page.waitForSelector('.alert-success', {visible: true});

    //Get href of 'Here' anchor
    const downloadUrl = await page.evaluate(() => {
        return document.getElementsByClassName('alert-success')[0].getElementsByTagName('a')[0].href;
    });

    await browser.close();

    //Make folder if doesn't exist
    var targetFolder = localStorage.getItem('downloadDir');
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder);
    }

    return downloadUrl;
}
