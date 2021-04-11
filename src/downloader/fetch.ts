/*
!
! TSC giving errors about HTML Elements in the compiler
!
*/

// # Fetch download URL from page with Puppeteer
export const fetchDownload = async (url: string) => {
    const puppeteer = require('puppeteer');

    const getPath = () => (process.platform == 'linux' ? puppeteer.executablePath().replace('/electron/', '/puppeteer/') : puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked'));

    const browser = await puppeteer.launch({executablePath: getPath()}).catch((err: Error) => onError(err, url));

    const page = await browser.newPage().catch((err: Error) => onError(err, url));

    await page.goto(url).catch((err: Error) => onError(err, url));

    // ? Wait for download button visible
    await page.waitForSelector('.btn-download', {visible: true}).catch((err: Error) => onError(err, url));

    // ? Change button to redirect, then click
    await page
        .evaluate(() => {
            // @ts-ignore
            const button: HTMLAnchorElement = document.querySelector('.btn-download')!;
            button.target = '_self';
            button.click();
            return;
        })
        .catch((err: Error) => onError(err, url));

    // ? Wait until upload heaven loaded
    await page.waitForNavigation({waitUntil: 'networkidle0'}).catch((err: Error) => onError(err, url));
    // ? Wait for 5 second cooldown
    await page.waitForSelector('#downloadNowBtn', {visible: true}).catch((err: Error) => onError(err, url));

    // ? Click download button
    await page
        .evaluate(() => {
            // @ts-ignore
            const button: HTMLButtonElement = document.querySelector('#downloadNowBtn')!;
            button.click();
            return;
        })
        .catch((err: Error) => onError(err, url));

    // ? Wait for redirect
    await page.waitForNavigation({waitUntil: 'networkidle0'}).catch((err: Error) => onError(err, url));

    // ? Get download URL from 'here' button
    const downloadURL: string | null = await page
        .evaluate(() => {
            return document.getElementsByClassName('alert-success')[0].getElementsByTagName('a')[0].href || null;
        })
        .catch((err: Error) => onError(err, url));

    await browser.close().catch((err: Error) => onError(err, url));

    // ? Close chromium instance
    return downloadURL;
};

function onError(err: Error, url: string) {
    console.error(`Error fetching ${url}`);
    console.error(err);
}
