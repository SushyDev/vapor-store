(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: getChromiumExecPath(),
        args: ['--no-sandbox'],
    });

    const page = await browser.newPage();

    //Go to steamunlocked page
    await page.goto('https://sushydev.github.io/vapor-store-data/');

    var bodyHTML = await page.evaluate(() => document.body.innerHTML);

    document.getElementById('cards').innerHTML = bodyHTML;

    window.mdc.autoInit();

    await browser.close();
})();
