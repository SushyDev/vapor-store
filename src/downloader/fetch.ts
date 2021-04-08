import puppeteer from 'puppeteer';

//@ts-ignore
const getPath = () => (process.platform == 'linux' ? puppeteer.executablePath().replace('/electron/', '/puppeteer/') : puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked'));

// #Download game
export const fetchDownload = async (url: string) => {
    const browser = await puppeteer.launch({
        executablePath: getPath(),
    });

    const page = await browser.newPage();

    // ? Go to page
    await page.goto(url);

    // ? Wait for download button visible
    await page.waitForSelector('.btn-download', {visible: true});

    // ? Change button to redirect, then click
    await page.evaluate(() => {
        //@ts-ignore
        document.querySelector('.btn-download').target = '_self';
        //@ts-ignore
        document.querySelector('.btn-download').click();
        return;
    });

    // ? Wait until upload heaven loaded
    await page.waitForNavigation({waitUntil: 'networkidle0'});

    // ? Wait for 5 second cooldown
    await page.waitForSelector('#downloadNowBtn', {visible: true});

    // ? Click download button
    //@ts-ignore

    await page.evaluate(() => document.querySelector('#downloadNowBtn').click());

    // ? Wait for redirect
    await page.waitForNavigation({waitUntil: 'networkidle0'});

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
        //   vapor.ui.dialog.MDCAlert('Download failed', `Please retry<br>Fetched url is ${downloadURL}`);

        // ? Remove item from currently fetching list
        //  fetchingDownload = fetchingDownload.filter((item) => item !== gameID);

        // ? Remove item in downloader page
        //   downloader.item.removeItem(gameID, 'fetch');
        return;
    }

    await browser.close();

    return downloadURL;
    //downloader.startDownload(downloadURL, gameID)
};
