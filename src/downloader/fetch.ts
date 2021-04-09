// #Download game
export const fetchDownload = async (url: string) => {
    // # Dynamically import puppeteer to prevent unecessarily loading it
    const puppeteer = require('puppeteer');

    //@ts-ignore
    const getPath = () => (process.platform == 'linux' ? puppeteer.executablePath().replace('/electron/', '/puppeteer/') : puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked'));

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

    await browser.close();

    return downloadURL;
};
