//List of currently downloading games
var downloading = [];

//Download game
function downloadGame(downloadGame) {
    //If already downloading
    if (downloading.includes(downloadGame)) {
        alert('Already downloading this game');
        return;
    }

    //Add downloading game to array
    downloading.push(downloadGame);

    //Get file from local storage
    var file = localStorage.getItem('listFile');
    $.getJSON(file, (data) => {
        data['list'].forEach((game) => {
            var listItem = game.name.substring(1).slice(0, -1).replace(/ /g, '-');
            if (listItem != downloadGame) return;
            //Get url
            getDownloadLink(game.url).then((output) => {
                //Start download
                ipcRenderer.send('download-item', output, localStorage.getItem('downloadDir'), downloadGame);
            });
        });
    });
}

//Get url
async function getDownloadLink(url) {
    if (sessionStorage.getItem('Downloading') == 'true') {
        alert('Already Downloading ');
        return;
    }

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
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    
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