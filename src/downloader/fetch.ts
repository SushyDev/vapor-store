/*
!
! TSC giving errors about HTML Elements in the compiler
!
*/

// # Fetch download URL from page with Puppeteer
export const fetchDownload = async (url: string) => {
    const puppeteer = require('puppeteer');

    const getPath = () => (process.platform == 'linux' ? puppeteer.executablePath().replace('/electron/', '/puppeteer/') : puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked'));

    const browser = await puppeteer.launch({executablePath: getPath()});

    const page = await browser.newPage();

    try {
        await page.goto(url);

        // ? Wait for download button visible
        await page.waitForSelector('.btn-download', {visible: true});
    } catch (timeout) {}

    // ? Change button to redirect, then click
    await page.evaluate(() => {
        try {
            // @ts-ignore
            const button: HTMLAnchorElement = document.querySelector('.btn-download')!;
            button.target = '_self';
            button.click();
        } catch (err) {}
        return;
    });

    try {
        // ? Wait until upload heaven loaded
        await page.waitForNavigation({waitUntil: 'networkidle0'});
        // ? Wait for 5 second cooldown
        await page.waitForSelector('#downloadNowBtn', {visible: true});
    } catch (timeout) {}

    // ? Click download button
    await page.evaluate(() => {
        try {
            // @ts-ignore
            const button: HTMLButtonElement = document.querySelector('#downloadNowBtn')!;
            button.click();
            return;
        } catch (e) {}
    });

    try {
        // ? Wait for redirect
        await page.waitForNavigation({waitUntil: 'networkidle0'});
    } catch (timeout) {}

    // ? Get download URL from 'here' button
    const downloadURL = await page.evaluate(() => {
        try {
            return document.getElementsByClassName('alert-success')[0].getElementsByTagName('a')[0].href;
        } catch (err) {}
    });

    await browser.close();

    console.log(downloadURL);

    // ? Close chromium instance
    return downloadURL;
};
