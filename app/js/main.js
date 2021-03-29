// ? Get App window
const
browserWindows = BrowserWindow.getAllWindows(),
browserWindow = browserWindows.find((window) => window && window.title && !window.title.includes('loading'));

//Adjust page height for mobile devices running a chromium webbrowser
const setPageHeight = () => {
    const
    vh = window.innerHeight * 0.01,
    topAppBarHeight = document.getElementById('app-bar').offsetHeight,
    mainContent = document.getElementById('main-content');

    // Then we set the value in the --vh custom property to the root of the document
    document.body.style.setProperty('--vh', `${vh}px`);

    mainContent.style.height = 'calc(' + document.body.offsetHeight + 'px - ' + topAppBarHeight + 'px)';
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setPageHeight();

//Updates pageheight if user scrolls page
window.addEventListener('resize', () => setPageHeight());
